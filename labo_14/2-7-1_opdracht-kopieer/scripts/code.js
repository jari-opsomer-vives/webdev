const setup = () => {

    let btnKopieer = document.getElementById("btnKopieer");
    btnKopieer.addEventListener("click", kopieer);
}

const kopieer = () => {

    let txtOutput=document.getElementById("txtOutput");

    let txtInput = document.getElementById("txtInput");

    txtOutput.innerHTML=txtInput.value;
}

window.addEventListener("load", setup);