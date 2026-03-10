const setup = () => {
    const input = document.getElementById("input").value.trim();
    const output = input.split("").join(" ");
    document.getElementById("output").textContent = output;
    console.log(output);
};

window.addEventListener("load", () => {
    document.getElementById("button").addEventListener("click", setup);
});