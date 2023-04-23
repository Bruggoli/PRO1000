const { Session } = require("express-session");

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
    let oldData = localStorage.getItem("Navneliste");
    if (oldData) {
        // todo if exists
        localStorage.setItem("Navneliste", info);
        console.log("LocalStorage Updated");
    } else {
        localStorage.setItem("Navneliste", info);
        console.log("LocalStorage Created");
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
    // change to get names from json file
    var navn = [{
        "name": [   "Anne Gry Sturød",    
                    "Amalie H. Røimål",    
                    "Anette Myhre Momrak",    
                    "Asbjørn Nygård",    
                    "Anh Nguyen Duc",    
                    "Aud Stokland",    
                    "Bjørn Kristoffersen",    
                    "Birgit Leick",    
                    "Christian Persson",    
                    "Dieu Tien Bui",    
                    "Erik Aarnes",    
                    "Endre Før Gjermundsen",    
                    "Elisabeth Fleseland",    
                    "Einar Mo",    
                    "Gjest 1",    
                    "Gjest 2",    
                    "Gudrun Helgadottir",    
                    "Gunn Kristin Leikvoll",    
                    "Helge Gjermund Kaasin",    
                    "Håkon Svendsen",    
                    "Ingeborg Nordbø",    
                    "Ingrid Sundbø",    
                    "Jon Kvisli",    
                    "Karl Johan Gloppen",    
                    "Lars Halvor O. Johnsen",    
                    "Lars Sanden",    
                    "Martin Falk",    
                    "Mesay Moges Menebo",    
                    "Nuno Marques",    
                    "Niklas Valter Kreander",    
                    "Per Christian Hagen",    
                    "Per Strømberg",    
                    "Runar Gundersen",    
                    "Roy Martin Istad",    
                    "Sigbjørn Hjelmbrekke",    
                    "Safiqul Islam",    
                    "Simone",    
                    "Terje Andersen",    
                    "Tor Lønnestad",    
                    "Øystein A. Wendelborg",    
                    "Hege Skogli Riege"]
    }];


    localStorage.setItem("Navneliste", JSON.stringify(navn));
}

function fillTable(tableIn, jsonIn) {
    var json = JSON.parse(localStorage.getItem(jsonIn));
    console.log("filltable test 1: " + json[0].name[0]);
    var table = document.getElementsByClassName(tableIn);
    
    for (var i = 0; i < json[0].name.length; i++) {
        var newRow = document.createElement("tr");
        newRow.setAttribute("id", "row" + i);
        console.log(json[0].name[i]);
        var nameCell = document.createElement("td");
        nameCell.setAttribute("id", "navn" + i);
        nameCell.textContent = json[0].name[i];
        
        let nameArr = json[0].name[i].split(" ");
        
        var initCell = document.createElement("td");
        var initials = "";
        for (n in nameArr) {
            initials += nameArr[n].slice(0, 1);
        }
        initCell.setAttribute("id", "init" + i);
        initCell.textContent = initials;
        console.log("init " + initials);
        var loddCell = document.createElement("input");
        
        loddCell.setAttribute("type", "number");
        loddCell.setAttribute("id", "inputRow"+ i);
        loddCell.setAttribute("class", "inputLodd");
        
        newRow.appendChild(initCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(loddCell);
        document.getElementById("tableBody").appendChild(newRow);
    }
}
/*
function giLodd() {
    var navneliste = document.getElementById("tableBody");
    var deltakere = document.getElementById("tableBodyLeft");
    var rad = 0;
    var lodd = 0;

    // this is the loop that goes through the table
    // and checks if the input is 0 or not
    // if it is 0, it skips the row
    // if it is not 0, it adds the name and lodd to the tableBodyLeft
    for (var i = 0; i < navneliste.rows.length; i++) {
        if (document.getElementById("inputRow" + i).value <= 0) {
            // console.log("ingen lodd");
        } else {
            for (var i = 0; i < document.getElementById("inputRow" + i).value; i++) {
                var navn = document.getElementById("navn" + i).textContent;
                var lodd = document.getElementById("inputRow" + i).value;

                // overfør lodd og navn til tableBodyLeft
                var newRow = document.createElement("tr");
                newRow.setAttribute("id", "spillerRow" + rad);

                var loddCell = document.createElement("td");
                loddCell.setAttribute("id", "spillerLodd" + rad);
                loddCell.textContent = lodd++;
                // console.log("giLodd test 2: " + lodd);

                var initCell = document.createElement("td");
                initCell.textContent = document.getElementById("init" + i).innerHTML;

                var nameCell = document.createElement("td");
                nameCell.setAttribute("id", "spillerNavn" + rad);
                nameCell.textContent = navn;
                //console.log("giLodd test 1: " + navn);
                
                newRow.appendChild(nameCell);
                newRow.appendChild(initCell);
                newRow.appendChild(loddCell);
                deltakere.appendChild(newRow);
                rad++;
            }
        }
    }

    console.log("lodd tildelt");
}
*/

function giLodd() {
    clearTableBodyLeft();
    var navneliste = document.getElementById("tableBody");
    var deltakertabell = document.getElementById("tableBodyLeft");
    var deltakere = [];
    var lodd = 0;
    var rad = 0;
    
    if (sessionStorage.getItem("loddnr") != null) {
        var loddnr = 0;
    } else {
        var loddnr = sessionStorage.getItem("loddnr");
    }

    for (var i = 0; i < navneliste.rows.length; i++) {
        var navnRow = document.getElementById("navn" + i);
        var inputRow = document.getElementById("inputRow" + i)
        if (document.getElementById("inputRow" + i).value > 0) {
            console.log("giLodd test 2: " + navnRow.textContent);
            console.log("giLodd test 1: " + inputRow.value);
            var deltaker = {
                'navn': navnRow.textContent,
                'lodd': inputRow.value
            };
            deltakere.push(deltaker);
            lodd += parseInt(inputRow.value);
            console.log("lodd tildelt: " + lodd);
            sessionStorage.setItem("deltakere", JSON.stringify(deltakere));
        }
    }

    for (var i = 0; i < deltakere.length; i++) {
        for (var j = 1; j <= deltakere[i].lodd; j++) {
            console.log("deltaker", i, "navn: " + deltakere[i].navn + ", lodd: " + loddnr++);
            var newRow = document.createElement("tr");
            newRow.setAttribute("id", "deltakerRow" + rad);
    
            var loddCell = document.createElement("td");
            loddCell.setAttribute("id", "deltakerLodd" + rad);
            loddCell.textContent = loddnr; // Set loddCell textContent to the current ticket number
    
            var nameCell = document.createElement("td");
            nameCell.setAttribute("id", "deltakerNavn" + rad);
            nameCell.textContent = deltakere[i].navn;
        
            newRow.appendChild(nameCell);
            newRow.appendChild(loddCell);
            deltakertabell.appendChild(newRow);
            rad++;
        }
    }
    sessionStorage.setItem("loddnr", loddnr);
}



function velgVinner() {
    var deltakertabell = document.getElementById("tableBodyLeft");
    var numDeltakere = deltakertabell.rows.length;
    
    if (numDeltakere == 0) {
      alert("Ingen deltakere igjen i raffle!");
      return;
    }
    
    // Choose a random winner index from deltakertabell
    var winnerIndex = Math.floor(Math.random() * numDeltakere);
    
    // Get the winning row from deltakertabell
    var winningRow = deltakertabell.rows[winnerIndex];
    
    // Get the winning ticket number from loddCell in the winning row
    var loddCell = winningRow.querySelector("td:nth-child(2)"); // Assuming loddCell is the second <td> in each row
    var winningTicket = loddCell.textContent;   
    
    // Grey out the winning ticket number
    loddCell.style.backgroundColor = "#ddd";
    loddCell.style.color = "#888";
    
    // Remove the winning row from deltakertabell
    deltakertabell.deleteRow(winnerIndex);
    
    // Return the name of the winner and their winning ticket number
    var nameCell = winningRow.querySelector("td:nth-child(1)"); // Assuming nameCell is the first <td> in each row
    var winnerName = nameCell.textContent;

    alert(winnerName + " vant med lodd#" + winningTicket + "!");
    return winnerName + ", " + winningTicket;
  }
  

  function clearTableBodyLeft() {
    var deltakertabell = document.getElementById("tableBodyLeft");
    while (deltakertabell.firstChild) {
      deltakertabell.removeChild(deltakertabell.firstChild);
    }
  }