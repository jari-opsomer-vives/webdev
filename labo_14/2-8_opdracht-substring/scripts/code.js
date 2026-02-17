const setup = () => {

    let btnSubstring = document.getElementById("btnSubstring");
    btnSubstring.addEventListener("click", substring);
}

const substring = () => {

    let txtOutput = document.getElementById("txtOutput");

    const text = document.getElementById("txtInput").value;
    const start = Number(document.getElementById("txtStartIndex").value);
    const end = Number(document.getElementById("txtEndIndex").value);

    const result = text.substring(start, end);

    if (result !== "") {
        txtOutput.innerHTML = result;
    } else {
        txtOutput.innerHTML = '(geen output)';
    }
}

window.addEventListener("load", setup);
