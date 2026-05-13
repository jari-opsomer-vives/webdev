/* =============================================
   My Internet Start Page — JavaScript

   Aanpak: ik gebruik geen function-declaraties.
   Alle logica staat in const/let met arrow functions.
   Alle data bewaar ik in localStorage zodat de
   history bewaard blijft na een refresh.
   ============================================= */


// =============================================
// CONSTANTEN
// =============================================

// Sleutels voor localStorage — zo vermijd ik typefouten later
const STORAGE_KEY_HISTORY = "startpage_history";
const STORAGE_KEY_SORTERING = "startpage_sortering";

// Alle ondersteunde zoekmachines met hun prefix, kleur en URL-logica
// Ik gebruik encodeURIComponent zodat speciale tekens correct gecodeerd worden
const ZOEKMACHINES = [
    {
        prefix: "g",
        naam: "Google",
        kleur: "#4285f4",
        maakUrl: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`
    },
    {
        prefix: "y",
        naam: "Youtube",
        kleur: "#FF0000",
        maakUrl: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
    },
    {
        prefix: "x",
        naam: "X (Twitter)",
        kleur: "#1d9bf0",
        maakUrl: (q) => `https://x.com/search?q=${encodeURIComponent(q)}`
    },
    {
        prefix: "i",
        naam: "Instagram",
        kleur: "#e1306c",
        maakUrl: (q) => `https://www.instagram.com/explore/tags/${q.replace(/\s+/g, "")}/`
    },
    {
        prefix: "d",
        naam: "DuckDuckGo",
        kleur: "#de5833",
        maakUrl: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
    },
    {
        prefix: "t",
        naam: "TikTok",
        kleur: "#010101",
        maakUrl: (q) => `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`
    }
];


// =============================================
// LOCALSTORAGE HULPFUNCTIES
// =============================================

// Bewaar een waarde (als JSON) in localStorage
const bewaarInStorage = (sleutel, waarde) => {
    localStorage.setItem(sleutel, JSON.stringify(waarde));
};

// Haal een waarde op uit localStorage en zet het terug naar een JS-object
// Geeft null terug als de sleutel niet bestaat
const laadUitStorage = (sleutel) => {
    const data = localStorage.getItem(sleutel);
    return data ? JSON.parse(data) : null;
};

// Laad de hele history-array uit localStorage
// Als er nog niets bewaard is, geef een lege array terug
const laadHistory = () => {
    return laadUitStorage(STORAGE_KEY_HISTORY) ?? [];
};

// Voeg één item toe aan de bestaande history en sla alles opnieuw op
const slaHistoryItemOp = (item) => {
    const history = laadHistory();
    history.push(item);
    bewaarInStorage(STORAGE_KEY_HISTORY, history);
};

// Laad de opgeslagen sorteervolgorde
// Als nog nooit opgeslagen, gebruik de standaard (A→Z = true)
const laadSortering = () => {
    const opgeslagen = laadUitStorage(STORAGE_KEY_SORTERING);
    return opgeslagen !== null ? opgeslagen : true;
};

// Bewaar de huidige sorteervolgorde
const bewaarSortering = () => {
    bewaarInStorage(STORAGE_KEY_SORTERING, sorteerOplopend);
};

// Sorteervolgorde: true = A→Z, false = Z→A
// We laden de vorige keuze uit localStorage, of starten standaard op A→Z
// Let op: staat NA laadSortering zodat die const al bekend is
let sorteerOplopend = laadSortering();


// =============================================
// POPUP HULPFUNCTIES
// =============================================

// Toon een foutmelding in de popup
const toonFout = (bericht) => {
    document.getElementById("popup-bericht").textContent = bericht;
    document.getElementById("popup-overlay").classList.remove("d-none");
    document.getElementById("popup-box").classList.remove("d-none");
};

// Sluit en verberg de popup
const sluitPopup = () => {
    document.getElementById("popup-overlay").classList.add("d-none");
    document.getElementById("popup-box").classList.add("d-none");
};


// =============================================
// COMMANDO VERWERKEN
// =============================================

// Haal de zoekmachine op op basis van de prefix (bv. "g" → Google-object)
// Geeft null terug als de prefix onbekend is
const zoekMachineOpPrefix = (prefix) => {
    return ZOEKMACHINES.find(zm => zm.prefix === prefix) ?? null;
};

// Controleer het ingevoerde commando en geef de zoekmachine + zoekopdracht terug
// Geeft null terug (en toont popup) als het commando ongeldig is
const verwerkCommando = (invoer) => {
    // Commando moet starten met een slash
    if (!invoer.startsWith("/")) {
        toonFout('Ongeldig commando: start je commando met "/[letter] [zoekopdracht]"');
        return null;
    }

    // De prefix is de letter direct na de slash (positie 1)
    const prefix = invoer[1]?.toLowerCase();

    // Alles na "/x " is de zoekopdracht (we slaan de eerste 3 tekens over: /x + spatie)
    const zoekopdracht = invoer.slice(3).trim();

    // Controleer of de prefix bekend is
    const zoekmachine = zoekMachineOpPrefix(prefix);
    if (!zoekmachine) {
        toonFout(`Onbekende prefix "/${prefix}". Gebruik: /g, /y, /x, /i, /d of /t`);
        return null;
    }

    // Controleer dat er ook een zoekopdracht meegegeven werd
    if (zoekopdracht.length === 0) {
        toonFout("Vul ook een zoekopdracht in na de prefix.");
        return null;
    }

    // Stel de volledige URL samen via de functie van de zoekmachine
    const url = zoekmachine.maakUrl(zoekopdracht);

    // Geef alles terug als één object
    return {
        naam: zoekmachine.naam,
        kleur: zoekmachine.kleur,
        query: zoekopdracht,
        url: url
    };
};


// =============================================
// CARDS WEERGEVEN
// =============================================

// Voeg één card toe aan de container in de HTML
// Elke card krijgt de Bootstrap col-klassen zodat het grid werkt
const voegCardToe = (item) => {
    const container = document.getElementById("cards-container");

    // Bootstrap kolom: 12 breed op xs, 6 op sm, 4 op md (= 3 per rij op desktop)
    const kolom = document.createElement("div");
    kolom.className = "col-12 col-sm-6 col-md-4";

    // De gekleurde card zelf
    const card = document.createElement("div");
    card.className = "zoek-card";
    card.style.backgroundColor = item.kleur;

    // Naam van de zoekmachine als titel
    const naam = document.createElement("div");
    naam.className = "card-naam";
    naam.textContent = item.naam;

    // De zoekopdracht als tekst
    const query = document.createElement("div");
    query.className = "card-query";
    query.textContent = item.query;

    // Link die de URL opent in een nieuw tabblad
    const link = document.createElement("a");
    link.className = "card-link";
    link.href = item.url;
    link.target = "_blank";       // Nieuw tabblad, niet nieuw venster
    link.rel = "noopener";        // Veiligheidsregel bij target="_blank"
    link.textContent = "Go!";

    // Alles samenvoegen
    card.appendChild(naam);
    card.appendChild(query);
    card.appendChild(link);
    kolom.appendChild(card);
    container.appendChild(kolom);
};

// Haal alle history op, sorteer ze, en toon ze opnieuw
// We leegmaken we eerst de container zodat we niet dubbel tonen
const herlaadCards = () => {
    const container = document.getElementById("cards-container");
    container.innerHTML = "";   // Leegmaken

    const history = laadHistory();

    // Sorteren op naam (A→Z), bij gelijkheid op zoekopdracht
    history.sort((a, b) => {
        const naamVergelijking = a.naam.localeCompare(b.naam);
        if (naamVergelijking !== 0) return naamVergelijking;
        return a.query.localeCompare(b.query);
    });

    // Omdraaien als Z→A gewenst is
    if (!sorteerOplopend) {
        history.reverse();
    }

    // Elke card toevoegen aan de pagina
    history.forEach(item => voegCardToe(item));
};


// =============================================
// SORTERING
// =============================================

// Wissel de sorteervolgorde om en pas de knoptekst aan
const wisselSortering = () => {
    sorteerOplopend = !sorteerOplopend;
    bewaarSortering();
    updateSorteerKnop();
    herlaadCards();
};

// Pas de tekst van de sorteerknop aan zodat het overeenkomt met de huidige volgorde
const updateSorteerKnop = () => {
    const knop = document.getElementById("sort-btn");
    knop.textContent = sorteerOplopend ? "Sort: A → Z" : "Sort: Z → A";
};


// =============================================
// GO-KNOP LOGICA
// =============================================

// Alles wat er gebeurt als de gebruiker op GO! drukt (of Enter indrukt)
const verwerkGo = () => {
    const invoerVeld = document.getElementById("command-input");
    const invoer = invoerVeld.value.trim();

    // Commando verwerken — geeft null terug bij fouten
    const resultaat = verwerkCommando(invoer);
    if (!resultaat) return;   // Fout al getoond via popup, stoppen

    // Open de URL in een nieuw tabblad
    window.open(resultaat.url, "_blank");

    // Bewaar in localStorage en herlaad de cards
    slaHistoryItemOp(resultaat);
    herlaadCards();

    // Invoerveld leegmaken
    invoerVeld.value = "";
};


// =============================================
// INITIALISATIE
// =============================================

// Wacht tot de volledige HTML geladen is voor we eventlisteners toevoegen
document.addEventListener("DOMContentLoaded", () => {

    // GO!-knop: klik-event
    document.getElementById("go-button").addEventListener("click", verwerkGo);

    // Invoerveld: Enter-toets werkt ook als GO!
    document.getElementById("command-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            verwerkGo();
        }
    });

    // Sorteerknop: wissel volgorde
    document.getElementById("sort-btn").addEventListener("click", wisselSortering);

    // Popup sluiten via de X-knop
    document.getElementById("popup-sluit").addEventListener("click", sluitPopup);

    // Popup sluiten door op de donkere achtergrond te klikken
    document.getElementById("popup-overlay").addEventListener("click", sluitPopup);

    // Zet de juiste tekst op de sorteerknop bij opstarten
    updateSorteerKnop();

    // Laad de bestaande history uit localStorage en toon ze
    herlaadCards();
});