const setup = () => {
}

// alert
alert('Dit is een waarschuwing');

// confirm
let result = confirm('Weet je zeker dat je de foto wil verwijderen?');

if (result) {
    // verwijder de foto
} else {
    // doe helemaal niets
}

// prompt
let naam = prompt('Wat is je naam?');

if (naam !== null) {
    alert('Hallo, ' + naam + '!');
} else {
    alert('Er werd niets ingevoerd.');
}

window.addEventListener("load", setup);

