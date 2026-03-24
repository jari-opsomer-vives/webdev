const setup = () => {

    document.querySelectorAll("li").forEach(l =>{
        l.className = "listitem";
    });

    const body = document.querySelector("body");
    const img = document.createElement("img");

    img.setAttribute("src", "images/ernie.png");
    img.setAttribute("alt","Mijn foto!");
    body.appendChild(img);
}
window.addEventListener("load", setup);