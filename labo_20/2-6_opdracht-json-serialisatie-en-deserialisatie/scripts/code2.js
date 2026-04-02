const setup = () => {

    // Programma 2: JSON string terug omzetten naar object

    const jsonString = `{
      "naam": "Jana Pieters",
      "leeftijd": 21,
      "inschrijvingsdatum": "2023-09-01T00:00:00.000Z",
      "vakken": ["JavaScript", "HTML", "CSS"],
      "adres": { "straat": "Kerkstraat", "nummer": 12, "stad": "Brugge" },
      "actief": true
    }`;

    const student2 = JSON.parse(jsonString);

    console.log(student2.naam);               // "Jana Pieters"
    console.log(student2.adres.stad);         // "Brugge"
    console.log(student2.vakken[0]);          // "JavaScript"
    console.log(student2.inschrijvingsdatum); // "2023-09-01T00:00:00.000Z"  ← string, geen Date!

}
window.addEventListener("load", setup);

