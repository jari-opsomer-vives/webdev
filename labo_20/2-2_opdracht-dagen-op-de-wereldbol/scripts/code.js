const setup = () => {
    const geboortedatum = new Date("2007-05-04T00:00:00.000Z");
    let verschil = new Date() - geboortedatum;
    let verschilInDagen = verschil / 1000 / 60 / 60 / 24;
    let string = `${Math.floor(verschilInDagen)} dagen (${Math.floor(verschilInDagen / 364)} jaar)`;
    console.log(string);
    document.querySelector("p").textContent = string;
}

window.addEventListener("load", setup);