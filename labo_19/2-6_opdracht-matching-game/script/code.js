// Hier sla ik alle instellingen op die ik door het spel gebruik
// Zo moet ik maar op één plek iets aanpassen als ik het spel wil veranderen
let global = {
    AANTAL_AFBEELDINGEN: 12,            // hoeveel verschillende afbeeldingen er zijn
    AANTAL_KAARTEN_PER_AFBEELDING: 2,   // elke afbeelding komt 2 keer voor
    AANTAL_KAARTEN_HORIZONTAAL: 6,      // hoeveel kaarten er per rij staan
    PREFIX_KAART_PATH: "image/kaart",   // begin van het pad naar een kaartafbeelding
    SUFFIX_KAART_PATH: ".png",          // einde van het pad (de bestandsextensie)
    ACHTERKANT_PATH: "image/achterkant.png", // afbeelding voor de achterkant van een kaart
}

// Deze functie schudt een array door elkaar
// Ik gebruik dit om de kaarten in een willekeurige volgorde te leggen
const shuffle = (array) => {
    // sort() vergelijkt telkens twee elementen
    // door een willekeurig getal terug te geven beslis ik willekeurig wie "groter" is
    // zo komen de elementen in een willekeurige volgorde terecht
    array.sort((a, b) => {
        return Math.random() - 0.5;
    });
}

// Deze functie wordt aangeroepen als twee kaarten overeenkomen
// Ik voeg de klasse "goed" toe zodat de kaarten groen worden via CSS
const toonGoed = () => {
    let kaarten = document.getElementsByClassName("voorkant");
    // speel het geluid af voor een correcte match
    document.getElementById("goed").play();
    // voeg "goed" toe aan de klassenaam van elke omgedraaide kaart
    for (let i = 0; i < kaarten.length; i++) {
        kaarten[i].className += " goed";
    }
}

// Deze functie wordt aangeroepen als twee kaarten NIET overeenkomen
// Ik voeg de klasse "fout" toe zodat de kaarten rood worden via CSS
const toonFout = () => {
    let kaarten = document.getElementsByClassName("voorkant");
    // speel het geluid af voor een foute match
    document.getElementById("fout").play();
    // voeg "fout" toe aan de klassenaam van elke omgedraaide kaart
    for (let i = 0; i < kaarten.length; i++) {
        kaarten[i].className += " fout";
    }
}

// Deze functie draait alle omgedraaide kaarten (met klasse "voorkant") terug om
// Dit doe ik als de twee kaarten niet overeenkomen
const draaiKaartenMetVoorkantNaarAchterkant = () => {
    let kaartenMetVoorkant = document.getElementsByClassName("voorkant");

    // Opgelet: getElementsByClassName geeft een LIVE collection terug
    // Dat betekent dat de lijst automatisch verandert als ik een klasse aanpas
    // Als ik een gewone for-lus zou gebruiken zou ik kaarten overslaan
    // omdat .length kleiner wordt terwijl i groter wordt
    // Met een while-lus pak ik telkens opnieuw het eerste element
    // zodat ik zeker alle kaarten verwerk
    while (kaartenMetVoorkant.length > 0) {
        kaartenMetVoorkant[0].setAttribute("src", global.ACHTERKANT_PATH);
        kaartenMetVoorkant[0].className = "kaart achterkant";
    }

    // Ik verwijder de klasse "geblokkeerd" zodat de speler weer kan klikken
    document.getElementById("playField").className = "";
}

// Deze functie verwijdert alle omgedraaide kaarten als ze overeenkomen
// Ze verdwijnen dus volledig uit het speelveld
const verwijderKaartenMetVoorkant = () => {
    let kaart;
    let kaartenMetVoorkant = document.getElementsByClassName("voorkant");

    // Ook hier gebruik ik een while-lus omdat het een LIVE collection is
    // (zie uitleg bij draaiKaartenMetVoorkantNaarAchterkant)
    while (kaartenMetVoorkant.length > 0) {
        kaart = kaartenMetVoorkant[0];
        // Ik verwijder eerst de click-listener zodat de kaart niet meer reageert
        kaart.removeEventListener("click", klikOpKaart);
        // Dan verwijder ik de kaart zelf uit de DOM-tree
        kaart.parentNode.removeChild(kaart);
    }

    // Ik verwijder de klasse "geblokkeerd" zodat de speler weer kan klikken
    document.getElementById("playField").className = "";

    // Ik controleer of het spel voorbij is (geen kaarten meer over)
    controleerSpelGedaan();
}

// Deze functie controleert of alle kaarten al gematcht zijn
// Als er geen kaarten meer over zijn, is het spel gedaan
const controleerSpelGedaan = () => {
    let kaarten = document.getElementsByClassName("kaart");
    if (kaarten.length == 0) {
        // Er zijn geen kaarten meer, dus het spel is voorbij
        let playField = document.getElementById("playField");

        // Ik onthoud de hoogte van het speelveld voordat ik het leegmaak
        // zodat de "klaar"-afbeelding even groot blijft als het speelveld was
        let savedHeight = playField.clientHeight;
        playField.innerHTML = "";

        // Na innerHTML="" is de hoogte 0, dus ik stel hem handmatig opnieuw in
        playField.style.height = savedHeight + "px";

        // Door de klasse "klaar" toe te voegen toont de CSS een afbeelding
        playField.className = "klaar";
    }
}

// Deze functie kijkt of de omgedraaide kaarten dezelfde afbeelding hebben
// Afhankelijk van het resultaat plan ik de juiste acties in via setTimeout
const controleerOpOvereenkomst = (kaarten) => {
    let eersteKaart = kaarten[0];
    let allenGelijk = true;

    // Ik vergelijk elke kaart met de eerste kaart
    // Als één kaart anders is, stop ik meteen en weet ik dat het geen match is
    for (let i = 1; i < kaarten.length; i++) {
        if (eersteKaart.getAttribute("src") != kaarten[i].getAttribute("src")) {
            allenGelijk = false;
            break;
        }
    }

    if (allenGelijk) {
        // De kaarten komen overeen: ik toon groen na 0,5s en verwijder ze na 1s
        window.setTimeout(toonGoed, 500);
        window.setTimeout(verwijderKaartenMetVoorkant, 1000);
    } else {
        // De kaarten komen niet overeen: ik toon rood na 0,5s en draai ze na 1s terug
        window.setTimeout(toonFout, 500);
        window.setTimeout(draaiKaartenMetVoorkantNaarAchterkant, 1000);
    }
}

// Deze functie wordt aangeroepen als de speler op een kaart klikt
const klikOpKaart = (e) => {
    // Ik controleer of het speelveld NIET geblokkeerd is
    // Als er al twee kaarten open liggen, wil ik niet dat er verder geklikt kan worden
    if (document.getElementById("playField").className != "geblokkeerd") {
        let kaart = e.target;
        let kaartenMetVoorkant = document.getElementsByClassName("voorkant");

        // Speel het omdraai-geluid af
        document.getElementById("draai").play();

        // Draai de kaart om: verander de klasse en toon de voorkant-afbeelding
        kaart.className = "kaart voorkant";
        kaart.setAttribute("src", kaart.getAttribute("data-imageSource"));

        // Opgelet: kaartenMetVoorkant is een LIVE collection
        // De kaart die ik net omdraaide staat er dus al in
        // Daarom test ik op == AANTAL_KAARTEN_PER_AFBEELDING (= 2) en niet op == 1
        if (kaartenMetVoorkant.length == global.AANTAL_KAARTEN_PER_AFBEELDING) {
            // Er liggen nu genoeg kaarten open om te vergelijken
            controleerOpOvereenkomst(kaartenMetVoorkant);
            // Blokkeer het speelveld zodat de speler even moet wachten
            document.getElementById("playField").className = "geblokkeerd";
        }
    }
}

// Deze functie maakt één vak aan met een kaart erin en voegt het toe aan het speelveld
const addVak = (parent, kaartNummer) => {
    let vak = document.createElement("span");
    let kaart = document.createElement("img");

    // Ik stel de klasse en achterkant-afbeelding in voor de nieuwe kaart
    kaart.className = "kaart achterkant";
    kaart.setAttribute("src", global.ACHTERKANT_PATH);

    // Ik sla de voorkant-afbeelding op als data-attribuut
    // zodat ik weet welke afbeelding er achter de kaart zit zonder het te tonen
    kaart.setAttribute("data-imageSource", global.PREFIX_KAART_PATH + kaartNummer + global.SUFFIX_KAART_PATH);

    // Als er op de kaart geklikt wordt, roep ik klikOpKaart aan
    kaart.addEventListener("click", klikOpKaart);

    // Ik stop de kaart in het vak en het vak in het speelveld
    vak.className = "vak";
    vak.appendChild(kaart);
    parent.appendChild(vak);
}

// Deze functie start het spel op: ze maakt alle kaarten aan en legt ze neer
const initialize = () => {
    let playField = document.getElementById("playField");
    let kaartNummers = [];
    let aantalKaarten = global.AANTAL_AFBEELDINGEN * global.AANTAL_KAARTEN_PER_AFBEELDING;

    // Ik maak een lijst van kaartnummers waarbij elk nummer
    // AANTAL_KAARTEN_PER_AFBEELDING keer voorkomt
    // (bv. 0,1,2,...,11,0,1,2,...,11 voor 2 kaarten per afbeelding)
    for (let i = 0; i < aantalKaarten; i++) {
        kaartNummers.push(i % global.AANTAL_AFBEELDINGEN);
    }

    // Ik schud de kaartnummers willekeurig door elkaar
    shuffle(kaartNummers);

    // Ik voeg alle vakken toe aan het speelveld, rij per rij
    for (let i = 0; i < aantalKaarten; i++) {
        // Aan het begin van elke nieuwe rij (behalve de eerste) voeg ik een regelafbreking toe
        if (i % global.AANTAL_KAARTEN_HORIZONTAAL == 0 && i != 0) {
            let lineBreakElement = document.createElement("br");
            playField.appendChild(lineBreakElement);
        }
        // Ik voeg een vak toe met het kaartnummer uit mijn geschudde lijst
        addVak(playField, kaartNummers[i]);
    }
}

// Zodra de pagina volledig geladen is, start ik het spel op
window.addEventListener("load", initialize);