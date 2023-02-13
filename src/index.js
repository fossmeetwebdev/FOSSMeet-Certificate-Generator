// const base = "/Ragam-Certificate-Generator"
// const base =""
const base = "/certificates"

const addText = (text) => {
    let main = document.querySelector('.main');
    var h = document.createElement('H3');
    var t = document.createTextNode(text);
    h.appendChild(t);
    main.appendChild(h);
}

const checkTathvaUser = async (tathvaID) => {

    let main = document.querySelector('.main');
    main.innerHTML = '';

    try {
        user = await fetch("./ragam-users/" + tathvaID + ".json").then((res) => {
            return res.json();
        });
    }
    catch(e) {
        addText("User not found");
        return null;
    }
    return user;
}

const checkCAUser = async (caID) => {

    let main = document.querySelector('.main');
    main.innerHTML = '';

    try {
        user = await fetch("./ragam-ca/" + MD5(caID) + ".json").then((res) => {
            return res.json();
        });
    }
    catch(e) {
        addText("User not found");
        return null;
    }
    return user;
}

const addLink = (id) => {
    let main = document.querySelector('.main');
    var h = document.createElement('H3');
    var t = document.createTextNode(id);
    h.appendChild(t);
    var anchor = document.createElement('a');
	anchor.setAttribute('href', base + '/user.html?id=' + id+"&category=ragam21");
    anchor.appendChild(h);
    main.appendChild(anchor);
    var enter = document.createElement('br');
    main.appendChild(enter);
}

var button = document.getElementById('button')
var ID = document.getElementById("ID"); // Get only the element.
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

window.onload = (event) => {
    if(category === "ragam21") {
        document.getElementById("title").innerHTML = "Ragam Certificates";
        document.getElementById("ID").placeholder = "Ragam ID / Mail ID / Phone No.";
    }
    else if(category == "ca21") {
        document.getElementById("title").innerHTML = "Campus Ambassador Certificates";
        document.getElementById("ID").placeholder = "Ref ID / Mail ID / Phone No.";
    }
  };

button.addEventListener("click", function(e) {
    e.preventDefault();
    var s = document.getElementById("categories");
    var value=s.value;
    var route = ID.value;
    if(value == "none") {
        alert("Choose a Category");
        return;
    }
    if(route.length === 0){
        alert("Enter your ID");
        return;
    }
    if(value === "ragam") {
        const user = checkTathvaUser(route).then(user => {
            if(user) {
                const route = user[0].tathvaID;
                if(user.length < 2) {
                    window.location.href = base + '/user.html?id=' + route + "&category=ragam21";
                }
                else {
                    addText("Select your Ragam ID");
                    for(i=0; i<user.length; i++) {
                        addLink(user[i].tathvaID);
                    }
                }
            }
        });
    }
    else if(value === "ca") {
        const user = checkCAUser(route).then(user => {
            if(user) {
                window.location.href = base + '/event.html?id=' + user.refId + "&category=ca21&event=ca";
            }
        });
    }
    
}, false);

        
