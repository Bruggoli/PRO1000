function loadFile() {
    document.getElementById('file').onchange = () => {
        const file = document.getElementById('file').files[0];
        if (file) {
            const READER = new FileReader();
            READER.readAsText(file, 'UTF-8');
            READER.onload = (evt) => {
                let line = evt.target.result;
                console.log(line);
                storeCache(line);
            };
            READER.onerror = (evt) => {
                console.error('Failed to read file');
            };
        };
    };
}

function storeCache(info) {
    let oldData = localStorage.getItem("loddtrekning-data-cache");
    if (oldData) {
        // todo if exists
        localStorage.setItem("loddtrekning-data-cache", info);
        console.log("Cache updated");
    } else {
        localStorage.setItem("loddtrekning-data-cache", info);
        console.log("Cache created");
    }

    //splitUsers();
}

function copyClipboard() {
    // Copy the text inside localstorage
    navigator.clipboard.writeText(localStorage.getItem("Navneliste"));

    // Alert the copied text
    alert("Copied the text: " + localStorage.getItem("Navneliste"));
}

function jsonStorage() {
    var navn = [{
        "name": ["Markus Moen Magnussen",
            "Kaisa Lien",
            "Adrian Indergård Ro",
            "Marius Jølsen Lindberg"]
    },
    {
        "lodd": [1, 1, 1, 1]
    },
    {
        "vunnet": [0, 0, 0, 0]
    }];

    // console.log("typeof testObject: " + typeof navn);
    // console.log("testObject properties: ");


    localStorage.setItem("Navneliste", JSON.stringify(navn));

    var retrievedObject = JSON.parse(localStorage.getItem("Navneliste"));

    // console.log('typeof retrievedObject: ' + typeof retrievedObject);
    // console.log('Value of retrievedObject: ' + retrievedObject);
}

function fillTable() {
    var json = JSON.parse(localStorage.getItem("Navneliste"));
    const size = json[0].length;
    console.log("filltable test 1: " + json[0].name[0]);
    var table = document.getElementById("loddtable");
    
    for (var i = 0; i < json[0].name.length; i++) {
        var newRow = document.createElement("tr");
        console.log(json[0].name[i]);
        var nameCell = document.createElement("td");
        nameCell.textContent = json[0].name[i];
        var initCell = document.createElement("td");
        let nameArr = json[0].name[i].split(" ");
        var initials = "";
        for (n in nameArr) {
            initials += nameArr[n].slice(0, 1);
        }
        initCell.textContent = initials;
        console.log("init " + initials);

        newRow.appendChild(initCell);
        newRow.appendChild(nameCell);
        table.getElementsByTagName("tbody")[0].appendChild(newRow);
    }
}

function giLodd() {

}

function trekning() {
    var navn = JSON.parse(localStorage.getItem("Navneliste"));
    var vinner = document.getElementById("vinner");
    let deVant = navn[0].name[0];
    vinner.innerText = deVant;
}