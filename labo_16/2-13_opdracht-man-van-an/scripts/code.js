const setup = () => {
    const text = "De man van An geeft geen hand aan ambetante verwanten";
    const searchTerm = "an";

// --- met indexOf ---
    let countIndexOf = 0;
    let position = text.indexOf(searchTerm);

    while (position !== -1) {
        countIndexOf++;
        position = text.indexOf(searchTerm, position + 1);
    }

    console.log(`indexOf: "${searchTerm}" komt ${countIndexOf} keer voor`);

// --- met lastIndexOf ---
    let countLastIndexOf = 0;
    let position2 = text.lastIndexOf(searchTerm);

    while (position2 !== -1) {
        countLastIndexOf++;
        position2 = text.lastIndexOf(searchTerm, position2 - 1);
    }

    console.log(`lastIndexOf: "${searchTerm}" komt ${countLastIndexOf} keer voor`);
}
window.addEventListener("load", setup);