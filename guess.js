// Setting up the game
let gameName = "Guess the Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} game made by @youssef-dev`;

// Setting game options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberofhints = 3;

//mange wordS
let secretWord = "";
const words = [
  "PUZZLE",
  "GUITAR",
  "CODING",
  "PYTHON",
  "PUZZLY",
  "SECRET",
  "MASTER",
  "PUZZLE",
  "BRIGHT",
  "SIMPLE",
  "YOUSEF",
  "BUTTON",
  "NUMBER",
  "OBJECT",
  "STRING",
  "WINDOW",
  "SCREEN",
  "BUTTON",
  "SCRIPT",
  "EDITOR",
];
secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();

// Word clues
const wordClues = {
  "puzzle": "A game or problem that requires thinking to solve",
  "guitar": "A musical instrument with strings",
  "coding": "Writing instructions for computers",
  "python": "A programming language named after a comedy group",
  "puzzly": "Something that is confusing or mysterious",
  "secret": "Something hidden or unknown to others",
  "master": "An expert or person with great skill",
  "puzzle": "A game or problem that requires thinking to solve",
  "bright": "Full of light or intelligent",
  "simple": "Easy to understand or not complicated",
  "yousef": "A common name in Arabic cultures",
  "button": "A small round object used to fasten clothing",
  "number": "A mathematical value or quantity",
  "object": "A physical thing or item",
  "string": "A thin cord or sequence of characters",
  "window": "An opening in a wall that lets light in",
  "screen": "A display device or surface",
  "button": "A small round object used to fasten clothing",
  "script": "Written text for a play or movie",
  "editor": "A person who edits or a software tool"
};

let messagearea;
let guessbutton;

// mange hint
document.querySelector(".hint span").innerHTML = numberofhints;
let gethintbutton;

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");
  // Generating tries
  for (let counter = 0; counter < numberOfTries; counter++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${counter + 1}`);
    tryDiv.innerHTML = `<span>Try ${counter + 1}</span>`;
    if (counter !== 0) tryDiv.classList.add("hidden");
    // Generating letter inputs
    for (
      let letterCounter = 0;
      letterCounter < numberOfLetters;
      letterCounter++
    ) {
      const letterInput = document.createElement("input");
      letterInput.type = "text";
      letterInput.id = `guess-${counter + 1}-letter-${letterCounter + 1}`;
      letterInput.maxLength = 1;
      tryDiv.appendChild(letterInput);
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();

  // Disable all inputs except first one
  const inputsindisablediv = document.querySelectorAll(".hidden input");
  inputsindisablediv.forEach((input) => {
    input.disabled = true;
  });
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    // convert input to uppercase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextinput = inputs[index + 1];
      if (nextinput) nextinput.focus();
    });

    input.addEventListener("keydown", function (event) {
      const currentindex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextinput = currentindex + 1;
        if (nextinput < inputs.length) inputs[nextinput].focus();
      }
      if (event.key === "ArrowLeft") {
        const previnput = currentindex - 1;
        if (previnput >= 0) inputs[previnput].focus();
      }
    });
  });
}

function handleguesses() {
  let successguess = true;
  for (let counter = 1; counter <= numberOfLetters; counter++) {
    const inputfield = document.querySelector(`#guess-${currentTry}-letter-${counter}`);
    const letter = inputfield.value.toLowerCase();
    const actualletter = secretWord[counter - 1];

    if (letter === actualletter)
      inputfield.classList.add("in-place");
    else if (secretWord.includes(letter) && letter !== "") {
      inputfield.classList.add("not-in-place");
      successguess = false;
    } else {
      inputfield.classList.add("no");
      successguess = false;
    }
  }

  // check if user win or lose
  const msg = document.querySelector(".message");
  if (successguess) {
    if (numberofhints) {
      msg.innerHTML = `Congratulations! You guessed the word "${secretWord.toUpperCase()}" correctly with ${numberofhints} hint(s) remaining!`;
    }
    else {
      msg.innerHTML = `Congratulations! You guessed the word "${secretWord.toUpperCase()}" correctly!`;
    }
    let alltries = document.querySelectorAll(".inputs > div");
    alltries.forEach((trydiv) => trydiv.classList.add("hidden"));
    // disavled all inputs
    guessbutton.disabled = true;
    gethintbutton.disabled = true;
  }
  else {
    document.querySelector(`.try-${currentTry}`).classList.add("hidden");
    const currenttryinputs = document.querySelectorAll(`.try-${currentTry} input`);
    currenttryinputs.forEach((input) => (input.disabled = true));
    currentTry++;

    if (currentTry > numberOfTries) {
      guessbutton.disabled = true;
      gethintbutton.disabled = true;
      msg.innerHTML = `Game Over! The secret word was "${secretWord.toUpperCase()}". Better luck next time!`;
    } else {
      document.querySelector(`.try-${currentTry}`).classList.remove("hidden");
      const nexttrydiv = document.querySelectorAll(`.try-${currentTry} input`);
      nexttrydiv.forEach((input) => (input.disabled = false));
      nexttrydiv[0].focus();
    }
  }
}

function getHint() {
  if (numberofhints > 0) {
    numberofhints--;
    document.querySelector(".hint span").innerHTML = numberofhints;
  }
  if (numberofhints === 0) {
    gethintbutton.disabled = true;
  }
  const enabledinputs = document.querySelectorAll(`input:not([disabled])`);
  const emptyenabledinputs = Array.from(enabledinputs).filter(input => input.value === "");

  if (emptyenabledinputs.length > 0) {
    const randomindex = Math.floor(Math.random() * emptyenabledinputs.length);
    const randominput = emptyenabledinputs[randomindex];
    // Parse the input id to get the letter position: id = "guess-<try>-letter-<n>"
    const parts = randominput.id.split('-');
    const letterPos = parseInt(parts[3], 10) - 1; // Convert to zero-based index

    if (letterPos >= 0 && letterPos < secretWord.length) {
      randominput.value = secretWord[letterPos].toUpperCase();
    }
  }
}

function handlebackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentindex = Array.from(inputs).indexOf(document.activeElement);
    if (currentindex > 0) {
      const previnput = inputs[currentindex - 1];
      const currentinput = inputs[currentindex];
      currentinput.value = "";
      previnput.value = "";
      previnput.focus();
    }
  }
}

document.addEventListener("keydown", handlebackspace);

function restart() {
  // Reset game variables
  currentTry = 1;
  numberofhints = 3;
  secretWord = words[Math.floor(Math.random() * words.length)].toLowerCase();

  // Clear inputs container
  const inputsContainer = document.querySelector(".inputs");
  inputsContainer.innerHTML = "";

  // Update hint display
  document.querySelector(".hint span").innerHTML = numberofhints;

  // Display clue for the new secret word
  const clueText = document.querySelector(".clue-text");
  const clue = wordClues[secretWord];
  if (clue) {
    clueText.innerHTML = clue;
  }

  // Clear message
  const msg = document.querySelector(".message");
  msg.innerHTML = "";

  // Enable buttons
  guessbutton.disabled = false;
  gethintbutton.disabled = false;

  // Regenerate inputs
  generateInput();
}

window.onload = function () {
  guessbutton = document.querySelector(".check");
  gethintbutton = document.querySelector(".hint");
  const restartbutton = document.querySelector(".restart");
  messagearea = document.querySelector(".message");

  // Display clue for the secret word
  const clueText = document.querySelector(".clue-text");
  const clue = wordClues[secretWord];
  if (clue) {
    clueText.innerHTML = clue;
  }

  guessbutton.addEventListener("click", handleguesses);
  gethintbutton.addEventListener("click", getHint);
  restartbutton.addEventListener("click", restart);
  generateInput();
};

