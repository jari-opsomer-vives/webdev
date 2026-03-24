const setup = () => {

    document.querySelectorAll("p").forEach((p) => {
        p.textContent = "Goed gedaan!";
    })
}
window.addEventListener("load", setup);