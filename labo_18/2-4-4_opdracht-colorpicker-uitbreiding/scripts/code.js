// Huidige kleur bijhouden
let huidigKleur = "rgb(128, 128, 128)";

// Koppeling schuiver-id → waardeveld-id per kanaal
const kanalen = [
    { schuiver: "rood",  waarde: "rood-waarde"  },
    { schuiver: "groen", waarde: "groen-waarde" },
    { schuiver: "blauw", waarde: "blauw-waarde" }
];

// Lees de drie schuiverwaarden en pas kleurvak aan
const kleurBijwerken = () => {
    const rgb = kanalen.map(({ schuiver, waarde }) => {
        const val = document.getElementById(schuiver).value;
        document.getElementById(waarde).textContent = val;
        return val;
    });
    huidigKleur = `rgb(${rgb.join(", ")})`;
    document.getElementById("kleurvak").style.backgroundColor = huidigKleur;
};

// Zet kleur via rgb-string en sync schuivers
const kleurInstellen = (kleur) => {
    huidigKleur = kleur;
    document.getElementById("kleurvak").style.backgroundColor = kleur;

    // Haal r, g, b uit "rgb(r, g, b)"
    const delen = kleur.match(/\d+/g);
    if (delen) {
        kanalen.forEach(({ schuiver, waarde }, i) => {
            document.getElementById(schuiver).value = delen[i];
            document.getElementById(waarde).textContent = delen[i];
        });
    }
};

// Voeg huidig kleur toe als staal onderaan
const staalToevoegen = () => {
    const staal = document.createElement("div");
    staal.className = "staal";
    staal.style.backgroundColor = huidigKleur;

    // Klik op staal → herstel die kleur in de kiezer
    staal.addEventListener("click", (e) => kleurInstellen(e.currentTarget.style.backgroundColor));

    // Verwijderknop met 'X' rechtsboven
    const knop = document.createElement("button");
    knop.className = "verwijder";
    knop.textContent = "X";
    knop.addEventListener("click", (e) => {
        e.stopPropagation(); // voorkom klik op staal zelf
        staal.remove();
    });

    staal.appendChild(knop);
    document.getElementById("stalen-vak").appendChild(staal);
};

// Opstarten: luisteraars koppelen
const initialiseren = () => {
    kanalen.forEach(({ schuiver }) =>
        document.getElementById(schuiver).addEventListener("input", kleurBijwerken)
    );
    kleurBijwerken();
    document.getElementById("opslaan").addEventListener("click", staalToevoegen);
};

window.addEventListener("load", initialiseren);