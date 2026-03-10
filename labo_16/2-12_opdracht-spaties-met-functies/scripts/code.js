const maakMetSpaties = (inputText) => {
    let result = "";
    for (let i = 0; i < inputText.length; i++) {
        result += inputText[i];
        if (i < inputText.length - 1) {
            result += " ";
        }
    }
    return result;
};

const printSplitValue = () => {
    const input = document.getElementById("input").value.trim();
    const output = maakMetSpaties(input);
    document.getElementById("output").textContent = output;
    console.log(output);
};

window.addEventListener("load", () => {
    document.getElementById("button").addEventListener("click", printSplitValue);
});