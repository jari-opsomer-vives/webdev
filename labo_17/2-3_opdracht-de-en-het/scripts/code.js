const setup = () => {
    let zin = "Gisteren zat de jongen op de stoep en at de helft van de appel";

    let huidigWoord = "";
    let nieuweZin = "";

    for (let i = 0; i < zin.length; i++) {
        let letter = zin[i]; // Haal de huidige letter op

        // Als we een spatie tegenkomen, weten we dat een woord compleet is
        if (letter === " ") {

            // Is het woord exact "de"?
            if (huidigWoord === "de") {
                nieuweZin += "het"; // Voeg "het" toe aan onze nieuwe zin
            } else {
                nieuweZin += huidigWoord; // Voeg het originele woord toe
            }

            // Vergeet niet de spatie zelf ook weer toe te voegen
            nieuweZin += " ";

            // Maak het 'huidigWoord' weer leeg zodat we aan het volgende woord kunnen beginnen
            huidigWoord = "";

        } else {
            // Als het geen spatie is, plakken we de letter vast aan het woord dat we aan het bouwen zijn
            huidigWoord += letter;
        }
    }

// BELANGRIJK: Aan het einde van de zin staat geen spatie meer!
    if (huidigWoord === "de") {
        nieuweZin += "het";
    } else {
        nieuweZin += huidigWoord;
    }

    console.log(nieuweZin);
}
window.addEventListener("load", setup);