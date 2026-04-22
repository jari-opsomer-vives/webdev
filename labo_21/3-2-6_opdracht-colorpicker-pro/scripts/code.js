const STORAGE_KEY_SLIDERS = "colorpicker_sliders";
const STORAGE_KEY_SWATCHES = "colorpicker_swatches";

const initialize = () => {
    let btnSave = document.getElementById("btnSave");
    let sliders = document.getElementsByClassName("slider");
    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener("change", update);
        sliders[i].addEventListener("input", update);
    }

    restoreSliders();
    restoreSwatches();
    update();

    btnSave.addEventListener("click", saveSwatch);
};

// Sliders opslaan & herstellen

const saveSliders = () => {
    const sliderValues = {
        red:   document.getElementById("sldRed").value,
        green: document.getElementById("sldGreen").value,
        blue:  document.getElementById("sldBlue").value
    };
    localStorage.setItem(STORAGE_KEY_SLIDERS, JSON.stringify(sliderValues));
};

const restoreSliders = () => {
    const stored = localStorage.getItem(STORAGE_KEY_SLIDERS);
    if (!stored) return;
    const { red, green, blue } = JSON.parse(stored);
    document.getElementById("sldRed").value   = red;
    document.getElementById("sldGreen").value = green;
    document.getElementById("sldBlue").value  = blue;
};

// Swatches opslaan & herstellen

const loadSwatchData = () => {
    const stored = localStorage.getItem(STORAGE_KEY_SWATCHES);
    return stored ? JSON.parse(stored) : [];
};

const persistSwatches = () => {
    // Lees de data-attributen van alle bestaande swatches uit de DOM
    const swatchDivs = document.getElementById("swatchComponents").children;
    const data = [];
    for (let div of swatchDivs) {
        data.push({
            red:   div.getAttribute("data-red"),
            green: div.getAttribute("data-green"),
            blue:  div.getAttribute("data-blue")
        });
    }
    localStorage.setItem(STORAGE_KEY_SWATCHES, JSON.stringify(data));
};

const restoreSwatches = () => {
    const swatchData = loadSwatchData();
    const swatchComponents = document.getElementById("swatchComponents");
    swatchData.forEach(({ red, green, blue }) => {
        const swatch = buildSwatchComponent(red, green, blue);
        swatchComponents.appendChild(swatch);
    });
};

// Swatch aanmaken & beheren

const saveSwatch = () => {
    const swatchComponents = document.getElementById("swatchComponents");
    const swatch = buildSwatchComponent(
        document.getElementById("sldRed").value,
        document.getElementById("sldGreen").value,
        document.getElementById("sldBlue").value
    );
    swatchComponents.appendChild(swatch);
    persistSwatches(); // opslaan na toevoeging
};

const configureSwatch = (swatch, red, green, blue) => {
    swatch.setAttribute("data-red",   red);
    swatch.setAttribute("data-green", green);
    swatch.setAttribute("data-blue",  blue);
    swatch.style.background = `rgb(${red},${green},${blue})`;
};

const buildSwatchComponent = (red, green, blue) => {
    let swatch    = document.createElement("div");
    let btnDelete = document.createElement("input");

    swatch.className = "swatch";
    configureSwatch(swatch, red, green, blue);
    swatch.addEventListener("click", setColorPickerFromSwatch);

    btnDelete.setAttribute("type",  "button");
    btnDelete.setAttribute("value", "X");
    btnDelete.addEventListener("click", deleteSwatch);

    swatch.appendChild(btnDelete);
    return swatch;
};

const setColorPickerFromSwatch = (event) => {
    let swatch = event.target;
    document.getElementById("sldRed").value   = swatch.getAttribute("data-red");
    document.getElementById("sldGreen").value = swatch.getAttribute("data-green");
    document.getElementById("sldBlue").value  = swatch.getAttribute("data-blue");
    update();
};

const deleteSwatch = (event) => {
    let swatchComponents = document.getElementById("swatchComponents");
    let swatch = event.target.parentNode;
    swatchComponents.removeChild(swatch);
    persistSwatches(); // opslaan na verwijdering
    event.stopPropagation();
};

// UI bijwerken

const update = () => {
    let red   = document.getElementById("sldRed").value;
    let green = document.getElementById("sldGreen").value;
    let blue  = document.getElementById("sldBlue").value;

    document.getElementById("lblRed").innerHTML   = red;
    document.getElementById("lblGreen").innerHTML = green;
    document.getElementById("lblBlue").innerHTML  = blue;

    document.getElementById("swatch").style.background = `rgb(${red},${green},${blue})`;

    saveSliders(); // slider stand opslaan bij elke wijziging
};

window.addEventListener("load", initialize);