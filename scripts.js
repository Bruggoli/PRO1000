var lodd = 0;
var lyd = 0;
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

function storeCache(jsonObj) {
    let oldData = localStorage.getItem("Navneliste");
    if (oldData) {
        // Update the localStorage with the new JSON object
        localStorage.setItem("Navneliste", JSON.stringify(jsonObj));
        console.log("LocalStorage Updated");
        fillTable();
    } else {
        // Store the new JSON object in the localStorage
        localStorage.setItem("Navneliste", JSON.stringify(jsonObj));
        console.log("LocalStorage Created");
    }
}


function copyClipboard() {
    // Copy the text inside localstorage
    navigator.clipboard.writeText(localStorage.getItem("Navneliste"));

    // Alert the copied text
    alert("Copied the text: " + localStorage.getItem("Navneliste"));
}


function cacheExists() {
    if (localStorage.getItem("Navneliste") === null || typeof localStorage.getItem("Navneliste") === 'undefined') {
        console.log("No cache found");
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', (event) => {
            // Handle file upload
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                const jsonData = JSON.parse(event.target.result);
                // Store data in localStorage
                storeCache(jsonData);
            });
            reader.readAsText(file);
        });
        // Display popup
        alert('Please select a file');
        setTimeout(function () {
            fileInput.click();
        }, 100);
        fileInput.click();
    } else {
        // needs delay to fill table, otherwise the function is called before the table is created
        console.log("Cache found");
        setTimeout(function () {
            fillTable();
        }, 100);
    }
}

// cacheExists() is called when the page is loaded, clears up the HTML
document.addEventListener("DOMContentLoaded", function () {
    cacheExists();
});

function fillTable() {
    var table = document.getElementById("tableBody");
    var json = JSON.parse(localStorage.getItem("Navneliste"));

    for (var i = 0; i < json[0].navn.length; i++) {
        var newRow = document.createElement("tr");
        newRow.setAttribute("id", "row" + i);

        var nameCell = document.createElement("td");
        nameCell.setAttribute("id", "navn" + i);
        nameCell.textContent = json[0].navn[i];

        var loddCell = document.createElement("td");

        var inputWrapper = document.createElement("div");
        inputWrapper.setAttribute("class", "inputWrapper");

        var inputElement = document.createElement("input");

        inputElement.setAttribute("type", "number");
        inputElement.setAttribute("id", "inputRow" + i);
        inputElement.setAttribute("class", "inputLodd");
        inputElement.setAttribute("min", "0");
        inputElement.setAttribute("value", "0");

        inputWrapper.appendChild(inputElement);
        loddCell.appendChild(inputWrapper);

        newRow.appendChild(nameCell);
        newRow.appendChild(loddCell);
        document.getElementById("tableBody").appendChild(newRow);
    }
}



function giLodd() {
    clearTableBody("tableBodyLeft");
    var navneliste = document.getElementById("tableBody");
    var deltakertabell = document.getElementById("tableBodyLeft");
    var deltakere = [];
    var rad = 0;

    if (localStorage.getItem("loddnr") != null) {
        var loddnr = 0;
    } else {
        var loddnr = localStorage.getItem("loddnr");
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
            // TODO: change to localStorage
            localStorage.setItem("deltakere", JSON.stringify(deltakere));
        }
    }
    if (lodd > 0) {
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
    } else {
        alert("Ingen lodd å gi!");
    }
}



function velgVinner() {
    var deltakertabell = document.getElementById("tableBodyLeft");
    var numDeltakere = deltakertabell.rows.length;

    if (numDeltakere == 0) {
        alert("Ingen lodd å trekke!");
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

    if (lyd === 1) {
        playSound("sounds/trekning.mp3");
    setTimeout(function () {
        alert(winnerName + " vant med lodd #" + winningTicket + "!");
    }, 30000);
    } else {
        alert(winnerName + " vant med lodd #" + winningTicket + "!");
    }
}

function toggleSound() {
    if (lyd === 1) {
        lyd = 0;
        document.getElementById("lyd").innerHTML = "Lyd: Av";
    } else {
        lyd = 1;
        document.getElementById("lyd").innerHTML = "Lyd: På";
    }
}


// BYTT LYD FØR INNSENDING
function playSound(src) {
    var audio = new Audio(src);
    audio.play();
}

// function that allows the user to add a regular participant to the list
// also adds the name to the JSON file
function addNavn() {
    var nyttNavn = prompt("Skriv inn navnet til deltakeren:");
    if (confirm("Er dette riktig navn: " + nyttNavn + "?")) {
        var navneliste = localStorage.getItem("Navneliste");
        if (navneliste) {
            try {
                var navnelisteJSON = JSON.parse(navneliste);
                navnelisteJSON[0].navn.push(nyttNavn);
                navnelisteJSON[0].navn.sort(function (a, b) {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                });
                var newIndex = navnelisteJSON[0].navn.findIndex(function (name) {
                    return name === nyttNavn;
                });
                localStorage.setItem("Navneliste", JSON.stringify(navnelisteJSON));
                clearTableBody("tableBody");
                fillTable("tableBody");
            } catch (e) {
                console.error("Failed to parse Navneliste from local storage: ", e);
            }
        } else {
            console.error("Navneliste not found in local storage");
        }
    }
}


function addGuest() {
    var name = prompt("Skriv inn navnet til gjesten:");
    if (name === null || name === undefined) {
        return;
    }
    var tickets = parseInt(prompt("Skriv inn anntall lodd ønsket:"));
    if (tickets === null || tickets === undefined || tickets <= 0) {
        return;
    }

    if (name && tickets > 0) {
        for (var i = 0; i < tickets; i++) {
            var tableBody = document.getElementById("tableBodyLeft");
            var newRow = tableBody.insertRow(-1);
            var nameCell = newRow.insertCell(0);
            var ticketsCell = newRow.insertCell(1);

            newRow.setAttribute("id", "guestRow" + i);
            nameCell.textContent = name;
            ticketsCell.textContent = ++lodd;

            tableBody.appendChild(newRow);
        }
    }
}

function clearTableBody(table) {
    var deltakertabell = document.getElementById(table);
    while (deltakertabell.firstChild) {
        deltakertabell.removeChild(deltakertabell.firstChild);
    }
}

// downloads the navneliste.txt file
function downloadNavneliste() {
    var deltakertabell = document.getElementById("tableBody");
    while (deltakertabell.firstChild) {
        deltakertabell.removeChild(deltakertabell.firstChild);
    }

    var navneliste = localStorage.getItem("Navneliste");
    var blob = new Blob([navneliste], { type: "text/plain" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    link.href = url;
    link.download = "navneliste.txt";
    document.body.appendChild(link);
    link.click();
}

// looks for a file input element and adds an event listener to it
// when the DOM is loaded, the event listener will be loaded
// when the user selects a file, the file will be read and the contents will be passed to the txtToJSON function
// the returned JSON object will be stored in the browser's local storage
document.addEventListener('DOMContentLoaded', () => {
    toggleSound();
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];

        if (file) {
            try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                console.log(contents);
                const json = JSON.parse(contents);
                localStorage.setItem("Navneliste", contents) // You can use jsonStorage(json) here to store the generated JSON object
                storeCache(json);
                clearTableBody("tableBody");
                fillTable("tableBody");
            };
            reader.readAsText(file);
        } catch (e) {
            console.log("Failed to read file: ", e);
        }
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    var hamburgerButton = document.querySelector('.hamburger-button');
    var modalOverlay = document.querySelector('.modal-overlay');
    var closeButton = document.querySelector('.close-button');

    hamburgerButton.addEventListener('click', function () {
        modalOverlay.style.display = 'block';
        hamburgerButton.classList.toggle('active');
    });

    closeButton.addEventListener('click', function () {
        modalOverlay.style.display = 'none';
        hamburgerButton.classList.remove('active');
    });

    modalOverlay.addEventListener('click', function(event) {
        if (!event.target.closest('.modal')) {
            console.log('clicked outside modal');
            modalOverlay.style.display = 'none';
            hamburgerButton.classList.remove('active');
        }
    });
});
