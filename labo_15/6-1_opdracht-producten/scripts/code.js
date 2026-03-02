const setup = () => {

    // luister naar klik op "Bereken" knop
    document.getElementById("calculate").addEventListener("click", berekenTotaal);
};

const formatValuta = (bedrag) => {

    // maak bv. Eur 12,34 van 12.34
    return `${bedrag.toFixed(2).replace(".", ",")} Eur`;
};

const berekenTotaal = () => {

    let totaal = 0;

    // doorloop alle rijen in tabel (behalve kop)
    const rijen = document.querySelectorAll("table tr");
    for (let i = 1; i < rijen.length; i++) {
        const rij = rijen[i];

        // sla rijen met te weinig kolommen over
        if (rij.cells.length < 5) continue;

        // haal waarden op uit kolommen
        const prijsTekst = rij.cells[1].textContent.replace(" Eur", "").replace(",", ".");
        const prijs = parseFloat(prijsTekst);

        const hoeveelheid = parseInt(rij.cells[2].querySelector("input").value) || 0;

        const btwTekst = rij.cells[3].textContent.replace("%", "").trim();
        const btw = parseFloat(btwTekst) / 100;

        // bereken sub-totaal en toon
        const subTotaal = hoeveelheid * prijs * (1 + btw);
        rij.cells[4].textContent = formatValuta(subTotaal);

        // tel op bij groot totaal
        totaal += subTotaal;
    }

    // toon groot totaal
    document.getElementById("totalPrice").textContent = formatValuta(totaal);
};

window.addEventListener("load", setup);
