import { WORDS } from "./Words/WordEN.js";
import { animate } from "./confetti.js";

const NUMBER_GUESS = 6;
let guessesLeft = NUMBER_GUESS;
let listGuessLetters = [];
let guess = "";
let nextLetter = 0;
let correctWord = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(correctWord);

let isStatsTracked = JSON.parse(localStorage.getItem('statsTracked')) || false;
let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;
let gamesWon = parseInt(localStorage.getItem('gamesWon')) || 0;
let triesStats = JSON.parse(localStorage.getItem('triesStats')) || Array(NUMBER_GUESS).fill(0);

if (!isStatsTracked) {
    localStorage.setItem('statsTracked', true);
    localStorage.setItem('gamesPlayed', 0);
    localStorage.setItem('gamesWon', 0);
    localStorage.setItem('triesStats', JSON.stringify(Array(NUMBER_GUESS).fill(0)));
}

const restartBtn = document.getElementById("restart-btn");

const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const gamesPlayedElem = document.getElementById("gamesPlayed");
const winRateElem = document.getElementById("winRate");
const winsElem = document.getElementById("wins");

const triesElems = [];
for (let i = 1; i <= NUMBER_GUESS; i++) {
    triesElems.push(document.getElementById(`try${i}`));
}

function startGame() {
    for (let i = 0; i < NUMBER_GUESS; i++) {
        const row = document.createElement("div");
        row.className = "letterRow";

        for (let j = 0; j < 5; j++) {
            const box = document.createElement("div");
            box.className = "letterBox";
            row.appendChild(box);
        }

        container.appendChild(row);
    }
}

restartBtn.addEventListener("click", () => {
    if (3 >= guessesLeft) {
        container.innerHTML = "";
        listGuessLetters = [];
        nextLetter = 0;
        guessesLeft = NUMBER_GUESS;
        correctWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        console.log(correctWord);
        startGame();
        resetKeyboard();
        updateStats();
    }

    restartBtn.blur();
    restartBtn.hidden = true;
    clearCanvas();
});

deleteBtn.addEventListener("click", () => {
    deleteLetter();
});

enterBtn.addEventListener("click", () => {
    checkGuess();
});

resetStatsBtn.addEventListener("click", () => {
    resetStats();
});

function putLetter(key) {
    if (nextLetter === 5) {
        return;
    }
    key = key.toLowerCase();

    let row = document.getElementsByClassName("letterRow")[6 - guessesLeft];
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.innerHTML = key;
    box.classList.add("filledBox");
    listGuessLetters.push(key);
    console.log(listGuessLetters);
    nextLetter++;
}

function deleteLetter() {
    let row = document.getElementsByClassName("letterRow")[6 - guessesLeft];
    let box = row.children[nextLetter - 1];
    box.innerHTML = "";
    box.classList.remove("filledBox");
    listGuessLetters.pop();
    nextLetter--;
}

function checkGuess() {
    if (listGuessLetters.length != 5) {
        alert("Not enough letters to guess");
        return;
    }

    guess = listGuessLetters.join("");
    if (!WORDS.includes(guess)) {
        alert("Word does not exist or is not in the list");
        return;
    }

    let listCorrectWord = Array.from(correctWord);
    console.log(listCorrectWord);
    let row = document.getElementsByClassName("letterRow")[6 - guessesLeft];
    nextLetter = 0;

    for (let i = 0; i < 5; i++) {
        let color = "";
        let box = row.children[i];
        let letter = listGuessLetters[i];
        let letterPosition = listCorrectWord.indexOf(listGuessLetters[i]);

        if (letterPosition === -1) {
            color = "grey";
        } else {
            if (listGuessLetters[i] === listCorrectWord[i]) {
                color = "green";
            } else {
                color = "yellow";
            }
        }

        setTimeout(() => {
            animateCSS(box, 'flipInX');
            box.style.backgroundColor = color;
            shadeKeyboard(letter, color);
        }, 250 * i);

        setTimeout(() => {
            if (guessesLeft <= 3) {
                restartBtn.hidden = false;
            } else {
                restartBtn.hidden = true;
            }
        }, 210 * 5);
    }

    if (guess === correctWord) {
        triesStats[NUMBER_GUESS - guessesLeft]++;
        guessesLeft = 0;
        gamesWon++;
        gamesPlayed++;
        updateStats();

        setTimeout(() => {
            animate();
            canvas.style.display = 'block';
        }, 1000);
    } else {
        guessesLeft--;
        listGuessLetters = [];
        if (guessesLeft === 0) {
            setTimeout(() => {
                alert("You lost, please try again");
                container.innerHTML = "";
                listGuessLetters = [];
                nextLetter = 0;
                guessesLeft = NUMBER_GUESS;
                correctWord = WORDS[Math.floor(Math.random() * WORDS.length)];
                console.log(correctWord);
                startGame();
                resetKeyboard();
                gamesPlayed++;
                updateStats();
            }, 210 * 5);
        }
    }
}

function resetKeyboard() {
    for (let elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = restartBtn.style.backgroundColor;
    }
}

function shadeKeyboard(letter, color) {
    for (let elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === 'green') {
                return;
            }

            if (oldColor === 'yellow' && color !== 'green') {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}

document.addEventListener("keyup", (e) => {
    if (guessesLeft === 0) {
        return;
    }

    let keyPress = String(e.key);

    if (keyPress === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }

    if (keyPress === "Enter") {
        checkGuess();
        return;
    }

    if (keyPress.length > 1) {
        return;
    }

    let found = keyPress.match(/[a-z]/gi);
    if (!found || found.length > 1) {
        return;
    } else {
        putLetter(keyPress);
    }
});

const animateCSS = (element, animation, prefix = 'animate__') =>
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = element;
        node.style.setProperty('--animate-duration', '0.3s');

        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });

function clearCanvas() {
    canvas.style.display = 'none';
}

function updateStats() {
    localStorage.setItem('gamesPlayed', gamesPlayed);
    localStorage.setItem('gamesWon', gamesWon);
    localStorage.setItem('triesStats', JSON.stringify(triesStats));
    gamesPlayedElem.innerHTML = String(gamesPlayed);
    let wr = gamesWon / gamesPlayed * 100;
    winRateElem.innerHTML = wr.toFixed(2) + "%";
    winsElem.innerHTML = String(gamesWon);

    for (let i = 0; i < NUMBER_GUESS; i++) {
        triesElems[i].innerHTML = String(triesStats[i]);
    }
}

function resetStats() {
    localStorage.setItem('gamesPlayed', 0);
    localStorage.setItem('gamesWon', 0);
    localStorage.setItem('triesStats', JSON.stringify(Array(NUMBER_GUESS).fill(0)));
    gamesPlayed = 0;
    gamesWon = 0;
    triesStats = Array(NUMBER_GUESS).fill(0);
    updateStats();
}

document.addEventListener('DOMContentLoaded', (event) => {
    updateStats();
});
startGame();
