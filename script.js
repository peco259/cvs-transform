// Variables
let csvData = []; 
let baseRow = ["0", "", "", "2", "0", "", "", "1", "", "", "", "", ""];
let currentLang = "fr"; // Langue par défaut

// Traductions
const translations = {
    fr: {
        instruction: "Merci de rentrer l'ID du joueur pour le tournoi",
        buttonDownload: "Télécharger CSV modifié",
        languageBtn: "ENG",
        successMessage: (num) => `✅ Le numéro ${num} est bien rentré.`,
        errorMessage: (num) => `🚨 Vous avez déjà rentré le numéro ${num}.`,
    },
    en: {
        instruction: "Please type the player ID for the tournament",
        buttonDownload: "Download modified CSV",
        languageBtn: "FR",
        successMessage: (num) => `✅ The player number ${num} is well entered.`,
        errorMessage: (num) => `🚨 You have already entered that number ${num}.`,
    }
};

// Changement de langue
function switchLanguage() {
    currentLang = currentLang === "fr" ? "en" : "fr";
    document.getElementById("instruction").innerText = translations[currentLang].instruction;
    document.getElementById("downloadBtn").innerText = translations[currentLang].buttonDownload;
    document.getElementById("languageBtn").innerText = translations[currentLang].languageBtn;
}

document.getElementById("languageBtn").addEventListener("click", switchLanguage);

// Charger un fichier CSV
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    let file = event.target.files[0];
    Papa.parse(file, {
        complete: function(results) {
            csvData = results.data; 
            console.log("Fichier CSV chargé :", csvData);
        }
    });
});

// Ajout d’un numéro
document.getElementById('numberInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let number = event.target.value.trim();
        if (number === "") return;

        let alreadyExists = csvData.some(row => row[5] === number);
        let status = document.getElementById('status');

        if (alreadyExists) {
            status.innerHTML += `<p style="color: red;">${translations[currentLang].errorMessage(number)}</p>`;
        } else {
            let newRow = [...baseRow];
            newRow[5] = number;
            csvData.push(newRow);
            status.innerHTML += `<p>${translations[currentLang].successMessage(number)}</p>`;
        }

        event.target.value = "";
    }
});

// Téléchargement du CSV
document.getElementById('downloadBtn').addEventListener('click', function() {
    if (csvData.length === 0) {
        alert("Aucun fichier chargé !");
        return;
    }

    let csvString = Papa.unparse(csvData);
    let blob = new Blob([csvString], { type: 'text/csv' });
    saveAs(blob, "bandai_tournament.csv");

    document.getElementById('status').innerHTML = "";
    csvData = []; // Réinitialise les données après téléchargement
});