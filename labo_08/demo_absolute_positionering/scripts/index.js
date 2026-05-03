const setup = () => {
    const player = document.getElementsByClassName("player")[0];
    const left = parseInt(window.getComputedStyle(player).left);
    
	player.style.left = left + "px";

    window.requestAnimationFrame(tick);
}

// deze functie wordt meermaals per seconde opgeroepen
const tick = () => {
	const player=document.getElementsByClassName("player")[0];

    // verhoog de waarde van de 'left' property
    let left = parseInt(player.style.left); // haalt 30 uit bv "30px"
    left += 1;
    left %= 200;
	
    player.style.left=left+"px";

    window.requestAnimationFrame(tick);
}

window.addEventListener("load", setup);