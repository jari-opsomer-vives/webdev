const setup = () => {
    const createTrigrams = (word) => {
        const trigrams = [];

        for (let i = 0; i < word.length - 2; i++) {
            trigrams.push(word.substring(i, i + 3));
        }

        return trigrams;
    };

    const trigrams = createTrigrams("onoorbaar");
    trigrams.forEach((trigram) => console.log(trigram));
    }
window.addEventListener("load", setup);