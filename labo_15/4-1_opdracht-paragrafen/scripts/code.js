const setup = () => {

    let opvallende = document.getElementsByClassName("belangrijk");
    for (let i = 0; i < opvallende.length; i++) {
        opvallende[i].classList.add("opvallend");
    }

}
window.addEventListener("load", setup);