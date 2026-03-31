// Hier bewaar ik alle instellingen en speldata op één centrale plek
// Zo hoef ik maar op één plek iets aan te passen als ik het spel wil veranderen
let global = {
    IMAGE_COUNT: 5,                     // hoeveel verschillende afbeeldingen er zijn (0 t.e.m. 4)
    IMAGE_SIZE: 48,                     // breedte én hoogte van het doelwit in pixels
    IMAGE_PATH_PREFIX: "images/",       // begin van het pad naar een afbeelding
    IMAGE_PATH_SUFFIX: ".png",          // einde van het pad (de bestandsextensie)

    MOVE_DELAY: 3000,                   // hoelang (in ms) het doelwit op dezelfde plek blijft

    score: 0,                           // het aantal keer dat de speler een niet-bom heeft geraakt
    timeoutId: 0                        // ik bewaar het id van de timer zodat ik hem kan annuleren
};

// Deze functie wordt uitgevoerd zodra de pagina volledig geladen is
// Ik koppel hier de startknop aan de startGame-functie
const setup = () => {
    console.log("loaded");
    let btnStart = document.getElementById("btnStart");
    btnStart.addEventListener("click", startGame);
};

// Deze functie start het spel op als de speler op de startknop klikt
const startGame = () => {
    console.log("startgame");

    // Ik verberg de startknop zodat de speler er niet opnieuw op kan klikken
    document.getElementById("btnStart").style.display = "none";

    // Ik voeg een click-listener toe aan het doelwit
    // Zo reageert het doelwit als de speler erop klikt
    //
    // Ik gebruik de klasse "bom" om bij te houden of het huidige doelwit een bom is:
    // - heeft het doelwit de klasse "bom" → het is een bom
    // - heeft het doelwit de klasse "bom" niet → het is geen bom
    // Dit is handig omdat ik die klasse makkelijk kan opvragen in de klik-functie
    let target = document.getElementById("target");
    target.addEventListener("click", klik);

    // Ik roep move() op om het eerste doelwit te tonen
    move();
};

// Deze functie wordt aangeroepen als de speler op het doelwit klikt
const klik = (ev) => {
    // Ik controleer of de aangeklikte afbeelding de klasse "bom" heeft
    // indexOf geeft -1 terug als de klasse niet gevonden wordt
    if (ev.target.className.indexOf("bom") != -1) {
        // Het is een bom: spel is voorbij
        gameOver();
    } else {
        // Het is geen bom: de speler scoort een punt
        hit();
    }
};

// Deze functie verplaatst het doelwit naar een willekeurige positie
// en kiest een willekeurige afbeelding (bom of geen bom)
const move = () => {
    let target = document.getElementById("target");
    let speelScherm = document.getElementById("playField");

    // Ik bereken de maximale positie zodat het doelwit altijd binnen het speelveld valt
    // Ik trek de grootte van het doelwit af, anders zou het gedeeltelijk buiten vallen
    let maxLeft = speelScherm.clientWidth - global.IMAGE_SIZE;
    let maxTop = speelScherm.clientHeight - global.IMAGE_SIZE;

    // Ik kies een willekeurig getal tussen 0 en IMAGE_COUNT - 1
    // Afbeelding 0 is de bom, de rest zijn geldige doelwitten
    let nummer = Math.floor(Math.random() * global.IMAGE_COUNT);

    if (nummer == 0) {
        // Afbeelding 0 is de bom: ik geef het doelwit de klasse "bom"
        target.className = "bom";
    } else {
        // Geen bom: ik verwijder alle klassen van het doelwit
        target.className = "";
    }

    // Ik stel de juiste afbeelding in op basis van het gekozen nummer
    target.setAttribute("src", global.IMAGE_PATH_PREFIX + nummer + global.IMAGE_PATH_SUFFIX);

    // Ik verplaats het doelwit naar een willekeurige positie binnen het speelveld
    target.style.left = Math.floor(Math.random() * maxLeft) + "px";
    target.style.top = Math.floor(Math.random() * maxTop) + "px";

    // Ik plan een nieuwe verplaatsing na MOVE_DELAY milliseconden
    // Ik sla het id op zodat ik de timer later kan annuleren als het spel stopt
    global.timeoutId = setTimeout(move, global.MOVE_DELAY);
};

// Deze functie wordt aangeroepen als de speler op een bom klikt
const gameOver = () => {
    // Ik annuleer de timer zodat het doelwit niet meer beweegt
    clearTimeout(global.timeoutId);
    alert("GAME OVER");
};

// Deze functie wordt aangeroepen als de speler een niet-bom raakt
const hit = () => {
    let scoreSpans = document.getElementsByClassName("score");

    // Ik annuleer de huidige timer want ik ga zelf move() opnieuw oproepen
    clearTimeout(global.timeoutId);

    // Ik verhoog de score met 1
    global.score++;

    // Ik update alle elementen met de klasse "score" zodat de nieuwe score zichtbaar is
    // Er is er maar één in mijn HTML, maar zo werkt het ook als ik er meerdere zou toevoegen
    for (let i = 0; i < scoreSpans.length; i++) {
        scoreSpans[i].innerText = global.score;
    }

    // Ik verplaats het doelwit meteen naar een nieuwe positie
    move();
};

// Zodra de pagina volledig geladen is, roep ik setup aan
window.addEventListener("load", setup);