// const base = "/Ragam-Certificate-Generator"
// const base =""
const base = "/certificates";

const addText = (text) => {
  let h3s = document.querySelectorAll("h3");
  for (let i = 0; i < h3s.length; i++) {
    h3 = h3s[i];
    console.log("here");
    h3.parentNode.removeChild(h3);
  }
  let main = document.querySelector(".main");
  var h = document.createElement("H3");
  var t = document.createTextNode(text);
  h.appendChild(t);
  main.appendChild(h);
};

const verifyUser = async (tathvaID) => {
  let res = await fetch("./participants.json");
  res = await res.json();
  if (res[tathvaID]) return res[tathvaID];
  return null;
};

const titleCase = (str) => {
  str = str.split(/[ ._]+/);
  for (var i = 0; i < str.length; i++) {
    if (str[i].length > 2) {
      str[i] =
        str[i].toLowerCase().charAt(0).toUpperCase() +
        str[i].slice(1).toLowerCase();
    }
  }
  return str.join(" ");
};

const generateRagamPDF = async (name) => {
  let main = document.querySelector(".main");

  certificate = await fetch("./certificate/details.json").then((res) => {
    return res.json();
  });
  const { PDFDocument, rgb } = PDFLib;

  const exBytes = await fetch("./certificate/certificate.pdf").then((res) => {
    return res.arrayBuffer();
  });

  const exFont = await fetch("./fonts/GreatVibes-Regular.ttf").then((res) => {
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(exBytes);

  pdfDoc.registerFontkit(fontkit);
  const myFont = await pdfDoc.embedFont(exFont);

  const pages = pdfDoc.getPages();
  const firstPg = pages[0];
  console.log(name);
  if (name != null) {
    name = name.trim();
    name = titleCase(name);
    firstPg.drawText(name, {
      size: certificate.name.fontSize,
      x: certificate.name.x,
      y: certificate.name.y,
      color: rgb(
        certificate.name.fontColor.r,
        certificate.name.fontColor.g,
        certificate.name.fontColor.b
      ),
      font: myFont,
    });
  }

  var qr = new QRious({
    value: window.location.href,
    foreground: certificate.qrCode.foreground,
    background: certificate.qrCode.background,
  });
  qr = qr.toDataURL();
  const qrImage = await pdfDoc.embedPng(qr);

  firstPg.drawImage(qrImage, {
    x: certificate.qrCode.x,
    y: certificate.qrCode.y,
    width: 150,
    height: 150,
  });

  const uri = await pdfDoc.saveAsBase64({ dataUri: true });

  var h = document.createElement("H2");
  // main.removeChild(main.lastElementChild);
  main.appendChild(h);
  var elem = document.createElement("img");
  elem.setAttribute("src", "./static/img/download-icon.png");
  elem.setAttribute("height", "40");
  elem.setAttribute("width", "40");
  var anchor = document.createElement("a");
  anchor.href = uri;
  anchor.download = "Certificate.pdf";
  anchor.appendChild(elem);
  main.appendChild(anchor);
  var enter = document.createElement("br");
  main.appendChild(enter);
};

var button = document.getElementById("button");
var ID = document.getElementById("ID"); // Get only the element.
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

window.onload = async (event) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const tathvaID = urlParams.get("id");
  if (tathvaID) {
    verifyUser(tathvaID).then((user) => {
      if (user) {
        document.getElementById("form").style.display = "none";
        generateRagamPDF(user);
      } else {
        addText("Invalid Tathva ID");
      }
    });
  }
};

button.addEventListener(
  "click",
  function (e) {
    e.preventDefault();
    var tathvaID = ID.value;
    if (tathvaID.length === 0) {
      alert("Enter your ID");
      return;
    }
    verifyUser(tathvaID).then((user) => {
      console.log(user);
      if (user) {
        window.location.href =
          window.location.href.split("?")[0] + "?id=" + tathvaID;
      } else {
        addText("Invalid Tathva ID");
      }
    });
  },
  false
);
