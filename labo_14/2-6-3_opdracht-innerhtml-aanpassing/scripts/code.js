const setup = () => {

    let btnWijzigen=document.getElementById("btnWijzigen");
    btnWijzigen.addEventListener("click", wijzigen);
}

const wijzigen = () => {

    let pElement=document.getElementById("txtOutput");
    pElement.innerHTML="Welkom!";
}

window.addEventListener("load", setup);

