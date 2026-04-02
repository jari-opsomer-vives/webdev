// Voorgedefinieerde personen
let personen = [
    {
        voornaam: 'Jan',
        familienaam: 'Janssens',
        geboorteDatum: new Date('2010-10-10'),
        email: 'jan@example.com',
        aantalKinderen: 0
    },
    {
        voornaam: 'Mieke',
        familienaam: 'Mickelsen',
        geboorteDatum: new Date('1980-01-01'),
        email: 'mieke@example.com',
        aantalKinderen: 1
    },
    {
        voornaam: 'Piet',
        familienaam: 'Pieters',
        geboorteDatum: new Date('1970-12-31'),
        email: 'piet@example.com',
        aantalKinderen: 2
    }
];

// Houdt bij welke persoon momenteel getoond wordt in het formulier.
// -1 betekent: nieuwe (nog niet bestaande) persoon
let huidigIndex = -1;

// Hulpfunctie: formatteer een Date-object als "jjjj-mm-dd"
const formateerDatum = (datum) => {
    let jaar = datum.getFullYear();
    let maand = String(datum.getMonth() + 1).padStart(2, '0');
    let dag = String(datum.getDate()).padStart(2, '0');
    return `${jaar}-${maand}-${dag}`;
};

// Hulpfunctie: maak een <option> element aan en voeg het toe aan de lijst
const voegOptieToe = (persoon, index) => {
    let lstPersonen = document.getElementById("lstPersonen");
    let optie = document.createElement("option");
    optie.id = index;          // id = index in de personen array
    optie.value = index;
    optie.textContent = `${persoon.familienaam} ${persoon.voornaam}`;
    lstPersonen.appendChild(optie);
};

// Toon de gegevens van een persoon in het formulier
const toonPersoon = (persoon) => {
    document.getElementById("txtVoornaam").value = persoon.voornaam;
    document.getElementById("txtFamilienaam").value = persoon.familienaam;
    document.getElementById("txtGeboorteDatum").value = formateerDatum(persoon.geboorteDatum);
    document.getElementById("txtEmail").value = persoon.email;
    document.getElementById("txtAantalKinderen").value = persoon.aantalKinderen;
    clearAllErrors();
};

// Maak het formulier leeg
const leegFormulier = () => {
    document.getElementById("txtVoornaam").value = "";
    document.getElementById("txtFamilienaam").value = "";
    document.getElementById("txtGeboorteDatum").value = "";
    document.getElementById("txtEmail").value = "";
    document.getElementById("txtAantalKinderen").value = "";
    clearAllErrors();
};

// Controleer of het formulier geen validatiefouten bevat
const isFormulierGeldig = () => {
    let foutSpans = document.querySelectorAll(".errorMessage");
    for (let span of foutSpans) {
        if (span.innerHTML.trim() !== "") {
            return false;
        }
    }
    return true;
};

// Lees de ingevoerde gegevens uit het formulier
const leesFormulierData = () => {
    return {
        voornaam: document.getElementById("txtVoornaam").value.trim(),
        familienaam: document.getElementById("txtFamilienaam").value.trim(),
        geboorteDatum: new Date(document.getElementById("txtGeboorteDatum").value.trim()),
        email: document.getElementById("txtEmail").value.trim(),
        aantalKinderen: parseInt(document.getElementById("txtAantalKinderen").value.trim())
    };
};

// Update de tekst van een bestaande optie in de lijst
const updateOptie = (index, persoon) => {
    let optie = document.getElementById(String(index));
    if (optie) {
        optie.textContent = `${persoon.familienaam} ${persoon.voornaam}`;
    }
};

// Event listener: klik op "Bewaar"
const bewaarBewerktePersoon = () => {
    // Valideer alle velden
    valideer();

    // Ga enkel verder als het formulier geldig is
    if (!isFormulierGeldig()) {
        return;
    }

    let data = leesFormulierData();

    if (huidigIndex === -1) {
        // Nieuwe persoon: object aanmaken en toevoegen aan array en lijst
        let nieuwePersoon = {
            voornaam: data.voornaam,
            familienaam: data.familienaam,
            geboorteDatum: data.geboorteDatum,
            email: data.email,
            aantalKinderen: data.aantalKinderen
        };
        personen.push(nieuwePersoon);
        let nieuweIndex = personen.length - 1;
        voegOptieToe(nieuwePersoon, nieuweIndex);

        // Stel de nieuwe index in en selecteer de persoon in de lijst
        huidigIndex = nieuweIndex;
        document.getElementById("lstPersonen").value = huidigIndex;
    } else {
        // Bestaande persoon: properties aanpassen
        let persoon = personen[huidigIndex];
        persoon.voornaam = data.voornaam;
        persoon.familienaam = data.familienaam;
        persoon.geboorteDatum = data.geboorteDatum;
        persoon.email = data.email;
        persoon.aantalKinderen = data.aantalKinderen;

        // Naam in de lijst bijwerken
        updateOptie(huidigIndex, persoon);
    }
};

// Event listener: klik op "Nieuw"
const bewerkNieuwePersoon = () => {
    huidigIndex = -1;
    leegFormulier();

    // Deselecteer eventuele selectie in de lijst
    document.getElementById("lstPersonen").value = "";
};

// Event listener: selectie verandert in de lijst
const persoonGeselecteerd = (event) => {
    huidigIndex = parseInt(event.target.value);
    toonPersoon(personen[huidigIndex]);
};

// Setup: event listeners registreren en lijst vullen met voorgedefinieerde data
const setup = () => {
    // Vul de lijst met de voorgedefinieerde personen
    for (let i = 0; i < personen.length; i++) {
        voegOptieToe(personen[i], i);
    }

    // Registreer event listeners
    document.getElementById("btnBewaar").addEventListener("click", bewaarBewerktePersoon);
    document.getElementById("btnNieuw").addEventListener("click", bewerkNieuwePersoon);
    document.getElementById("lstPersonen").addEventListener("change", persoonGeselecteerd);
};

window.addEventListener("load", setup);
