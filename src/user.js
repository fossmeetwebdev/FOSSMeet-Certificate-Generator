// const base = "/Ragam-Certificate-Generator"
// const base =""
const base = "/certificates"

const addText = (text) => {
    let main = document.querySelector('.main');
    var h = document.createElement('H2');
    var t = document.createTextNode(text);
    h.appendChild(t);
    main.appendChild(h);
}

const addLink = (id, text) => {
    let main = document.querySelector('.main');
    var h = document.createElement('H2');
    var t = document.createTextNode(text);
    h.appendChild(t);
    var anchor = document.createElement('a');
	anchor.setAttribute('href', base + '/event.html?id=' + id + "&category=ragam21&event=" + text.replace(/ /g,'').toLowerCase());
    anchor.appendChild(h);
    main.appendChild(anchor);
    var enter = document.createElement('br');
    main.appendChild(enter);
}

const checkUser = async (ragamID) => {

    try {
        user = await fetch("./ragam-users/" + MD5(ragamID) + ".json").then((res) => {
            return res.json();
        });
    }
    catch(e) {
        addText("User not found");
        return null;
    }
    return user;
}

window.onload = (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const user = checkUser(id).then(user => {
        if(user) {
            for(i=0; i<user.length; i++) {
                for(j=0; j<user[i].events.length; j++) {
                    addLink(id, user[i].events[j].name);
                }
                if(j==0) {
                    addText("No events");
                }
            }    
        }
    });
}



