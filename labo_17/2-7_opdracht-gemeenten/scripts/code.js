// Voeg gemeentes toe aan de dropdown op basis van gebruikersinput
const voegGemeentesToe = () => {
    const keuzelijst = document.getElementById("gemeente");
    const gemeentes = [];

    // Blijf vragen tot gebruiker "stop" invoert of annuleert
    let invoer;
    while ((invoer = prompt("Voeg een gemeente toe")) && invoer !== "stop") {
        gemeentes.push(invoer);
    }

    // Sorteer alfabetisch en voeg toe aan keuzelijst
    gemeentes.sort().reverse().forEach((gemeente) => {
        const optie = new Option(gemeente, gemeente);
        keuzelijst.add(optie, 0);
    });
};

// Koppel knop aan functie na laden pagina
window.addEventListener("load", () => {
    document.getElementById("startKnop").addEventListener("click", voegGemeentesToe);
});
