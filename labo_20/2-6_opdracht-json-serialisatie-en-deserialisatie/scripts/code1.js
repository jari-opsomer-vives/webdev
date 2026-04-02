const setup = () => {

    // Programma 1: object definieren en omzetten naar JSON

    const adres = { straat: "Kerkstraat", nummer: 12, stad: "Brugge" };

    const student1 = {
        naam: "Jana Pieters",
        leeftijd: 21,
        inschrijvingsdatum: new Date("2023-09-01"),
        vakken: ["JavaScript", "HTML", "CSS"],
        adres: adres,
        actief: true
    };

    const jsonString = JSON.stringify(student1, null, 2);
    console.log(jsonString);

}
window.addEventListener("load", setup);

