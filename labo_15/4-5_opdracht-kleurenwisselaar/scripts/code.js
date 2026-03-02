const setup = () => {

    // vind alle buttons
    const buttons = document.getElementsByTagName("button");

    // zet om naar echte array
    const buttonsArray = Array.from(buttons);

    // voeg klik aan elke button toe
    for (let i = 0; i < buttonsArray.length; i++) {
        const button = buttonsArray[i];
        button.addEventListener("click", function() {
            button.classList.toggle("isingedrukt");
        });
    }
};

window.addEventListener("load", setup);


