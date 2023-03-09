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

    splitUsers();
}

function splitUsers() {
    let csv = localStorage.getItem("loddtrekning-data-cache");
    if (csv) {
        let splitData = csv.split(" ");
        let tabell = [];
        for (i in splitData) {
            console.log(splitData[i]);
            let persInfo = splitData[i].split(";");
            console.log(persInfo[0], persInfo[1], persInfo[2]);
        };
    };
};

function copyClipboard() {
    // Copy the text inside localstorage
    navigator.clipboard.writeText(localStorage.getItem("loddtrekning-data-cache"));

    // Alert the copied text
    alert("Copied the text: " + localStorage.getItem("loddtrekning-data-cache"));
}
