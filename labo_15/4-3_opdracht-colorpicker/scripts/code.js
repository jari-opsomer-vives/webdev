const setup = () => {
    // vind alle sliders en hun waardeteksten
    const redSlider = document.getElementById("red-slider");
    const greenSlider = document.getElementById("green-slider");
    const blueSlider = document.getElementById("blue-slider");

    const redValue = document.getElementById("red-value");
    const greenValue = document.getElementById("green-value");
    const blueValue = document.getElementById("blue-value");

    const colorBox = document.getElementById("color-box");

    const updateColor = () => {
        // haal RGB-waarden op en toon ze
        const r = redSlider.value;
        redValue.textContent = r;

        const g = greenSlider.value;
        greenValue.textContent = g;

        const b = blueSlider.value;
        blueValue.textContent = b;

        // Stel kleur in
        colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    };

    // luister naar de sliders
    redSlider.addEventListener("input", updateColor);
    greenSlider.addEventListener("input", updateColor);
    blueSlider.addEventListener("input", updateColor);

    // start met huidige waarden
    updateColor();
};

window.addEventListener("load", setup);
