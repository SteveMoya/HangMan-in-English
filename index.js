import { wordsEasy, wordsMedium, wordsHard } from './words.js';

const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const difficultySelector = document.querySelector(".difficulty-selector");
const jsConfetti = new JSConfetti();

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width  = 0;
ctx.canvas.height = 0;

const bodyParts = [
    [4,2,1,1],
    [4,3,1,2],
    [3,5,1,1],
    [5,5,1,1],
    [3,3,1,1],
    [5,3,1,1]
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;
let words;
let wins = 0;

  difficultySelector.addEventListener("change", () => {
    let difficulty = difficultySelector.querySelector("input:checked").value;
  
    switch (difficulty) {
      case "easy":
        words = wordsEasy;
        break;
      case "medium":
        words = wordsMedium;
        break;
      case "hard":
        words = wordsHard;
        break;
      default:
        alert("Invalid difficulty.");
        break;
    }
});

const addLetter = letter => {
    const letterElement = document.createElement('span');
    document.getElementById('usedLetters').innerHTML = `<p>Letters Used: ${usedLetters}</p>`
    usedLettersElement.appendChild(letterElement);
}

const addBodyPart = bodyPart => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    document.getElementById('mistakes').innerHTML = `<h3>Number of Failures: ${mistakes}</h3>`;
    if(mistakes === bodyParts.length) endGame();
}

const inputElement = document.getElementById('wordContainer');
inputElement.addEventListener('click', () => {
    inputElement.focus();
});

const endGame = () => {
    document.removeEventListener('keydown', letterEvent);
    startButton.style.display = 'block';

    if (mistakes === bodyParts.length) {
        document.getElementById('result').innerHTML = '<h2 style="color:red;">YOU LOST</h2>';
        startButton.innerHTML = 'Try Again';
    } else {
        document.getElementById('result').innerHTML = '<h2 style="color:springgreen;">YOU WIN</h2>';
        wins++;
        document.getElementById('wins').innerHTML = `<h3>Victorias: ${wins}</h3>`;
        startButton.innerHTML = 'Next Word';
        jsConfetti.addConfetti();

    }
}

const correctLetter = letter => {
    const { children } =  wordContainer;
    for(let i = 0; i < children.length; i++) {
        if(children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if(hits === selectedWord.length) endGame();
}

const letterInput = letter => {
    if(selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    if(newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    }else {
        alert('Invalid or previously used font. Select another');
    }
};

const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
};

const selectRandomWord = () => {
    let word = words[Math.floor((Math.random() * words.length))].toUpperCase();
    selectedWord = word.split('');
};

const drawHangMan = () => {
    ctx.canvas.width  = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#c2c2c2';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

let startGame = () => {
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked');
    if (!selectedDifficulty) {
        alert("Select a difficulty before starting the game.");
        return;
    }
    
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    startButton.style.display = 'none';
    drawHangMan();
    selectRandomWord();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

startButton.addEventListener('click', startGame);
