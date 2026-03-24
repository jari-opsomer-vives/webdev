const setup = () => {
    document.querySelector("button").addEventListener("click", toevoegen);
}

const toevoegen = () => {
    const p = document.createElement("p");
    p.textContent = "Hallo!";
    document.querySelector("#myDIV").appendChild(p);
}

window.addEventListener("load", setup);