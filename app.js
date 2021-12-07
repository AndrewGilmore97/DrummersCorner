// A basic web application to play drums with either the mouse of the keyboard, inspired by Angela Yu

// Select all drums
const drums = document.querySelectorAll(".drum");
// Select all buttons
const buttons = document.querySelectorAll(".smallBtn");

// Initialise the variables
let instrument = "";
let key = "";
let keyFound = true;

// Additional mode
let memoryGame = false;
const numToLetter = ["q","w","e","r","a","s","d"];
// Game active
let firstGame = true;
let computerTurn = false;
let computerPattern = [];
let playerPattern = [];

let arrayNumber = 0;
let arrayChecker = 0;
let level = 1;

// Add an event listener for each of the drum buttons for if they are clicked
for (let i = 0; i< drums.length; i++) {
    drums[i].addEventListener("click",clicked);
}

// And for menu buttons
for (let i=0; i< buttons.length; i++) {
    buttons[i].addEventListener("click",menuClicked);
}

// Add an event listener for when a keydown event is triggered on the document
document.addEventListener("keydown",keyClick);

// A function that takes a lowercase character and assigns the correct instrument string, otherwise returns false for keyFound to skip playing audio
function findSound(note) {

    switch(note) {
        case "q":
            instrument = "tom-1";
            break;
        case "w":
            instrument = "snare";
            break;
        case "e":
            instrument = "tom-2";
            break;
        case "r":
            instrument = "crash";
            break;
        case "a":
            instrument = "tom-3";
            break;
        case "s":
            instrument = "kick-bass";
            break;
        case "d":
            instrument = "tom-4";
            break;
        default:
            keyFound = false;

    }
}

// A function to play the sound file of the corresponding input
function playSound() {
    let soundFile = "sounds/" + instrument + ".mp3";
    let audio = new Audio(soundFile);
    audio.play();

}

// A function to animate the appropriate button to visualise the input for the user
function animateButton (note) {

    // Compare the character with the contents of each button
    for (let i=0; i<drums.length; i++) {
        if (drums[i].innerHTML === note) {
            // When the correct button is found, add a "clicked" class to animate and then remove after a short interval
            drums[i].classList.add("clicked");
            setTimeout(function(){ drums[i].classList.remove("clicked");}, 300);
        }
    }

}

// A function to convert the clicked button into an input for each function
function clicked () {
    const letter = this.innerHTML.toLowerCase();
    mainFunction(letter);
}

// A function to extract the key pressed for each function
function keyClick(input) {
    const key = input.key.toLowerCase();
    mainFunction(key);
}

// The function that points to each function chronologically for execution
function mainFunction(note) {

    if (memoryGame === false){
            // Check input to find matching instrument
            findSound(note);
            // Skip playing the audio and animating and reinitialise if the input isn't mapped, otherwise play and animate
            if (keyFound === true) {
                playSound();
                animateButton(note);
            } else {
                keyFound = true;
            }

    } else if (memoryGame === true && firstGame === true){ // Add one random letter to array and play
        console.log("Start Game: ");
        document.querySelector(".levelNumber").innerHTML = level;
        document.querySelector(".messageText").innerHTML = "Playing!";
        computerTurn = true;
        sequenceGen();

    } else if (memoryGame === true && computerTurn === false){ // Play what is inputted and check it step by step
        console.log("Player Choice: ");
        playerPattern.push(note);
        findSound(note);

        if (keyFound === true) {
            playSound();
            animateButton(note);
        } else {
            keyFound = true;
        }

        if (computerPattern[arrayChecker] !== playerPattern[arrayChecker]){
            gameOver();
        } else if (computerPattern[arrayChecker] === playerPattern[arrayChecker] && computerPattern.length !== playerPattern.length){
            // console.log("Good so far: ");
            // console.log("comp: " + computerPattern);
            // console.log("player: " + playerPattern);
            arrayChecker++
        }
        
        else if (computerPattern.length === playerPattern.length && computerPattern[arrayChecker] === playerPattern[arrayChecker]){
            // console.log("Correct on: ");
            // console.log("comp: " + computerPattern);
            // console.log("player: " + playerPattern);
            level++;
            document.querySelector(".levelNumber").innerHTML = level;
            arrayChecker = 0;
            arrayNumber = 0;
            playerPattern = [];
            computerTurn = true;
            setTimeout(sequenceGen,1000);
        }

    } 

}


// Menu buttons

// Find menu function
function findMenu(btn) {
    console.log("Finding menu");
    switch(btn) {
        case "Freestyle":
            buttons[0].classList.add("clicked");
            buttons[1].classList.remove("clicked");
            document.body.classList.remove("bgMemory");
            memoryGame = false;

            document.querySelectorAll(".levelTitle")[0].style.display = "none";
            document.querySelectorAll(".levelTitle")[1].style.display = "none";
            document.querySelectorAll(".levelTitle")[2].style.display = "block";
            document.querySelector(".messageText").innerHTML = "";

            // Turn off game
            firstGame = true;
            computerTurn = false;
            computerPattern = [];
            playerPattern = [];
            arrayNumber = 0;
            arrayChecker = 0;
            level = 1;

            document.querySelector(".levelNumber").innerHTML = level;

            document.querySelector(".subTitle").innerHTML = "Freestyle Mode";

            for (let i=0; i<drums.length;i++){
                drums[i].classList.add("freeStl");
            }
            break;
        case "Memory Game":
            buttons[0].classList.remove("clicked");            
            buttons[1].classList.add("clicked");
            document.body.classList.add("bgMemory");
            memoryGame = true;

            console.log("Finding menu for Memory game");

            document.querySelectorAll(".levelTitle")[0].style.display = "inline";
            document.querySelectorAll(".levelTitle")[1].style.display = "inline";
            document.querySelectorAll(".levelTitle")[2].style.display = "block";
            document.querySelector(".messageText").innerHTML = "Press any key to start";

            document.querySelector(".subTitle").innerHTML = "Memory Game";

            for (let i=0; i<drums.length;i++){
                drums[i].classList.remove("freeStl");
            }
            break;
        default:
            console.log(btn);
    }
}

function menuClicked(btn) {
    const buttonSel = this.innerHTML;
    findMenu(buttonSel);

}

/////////Memory Game

function sequenceGen(){
    console.log("Start Seq")
    document.querySelector(".messageText").innerHTML = "Listen...";

    if (firstGame === true) {
        firstGame = false;
    }

    let randomLetter = numToLetter[Math.floor(Math.random()*7)];
    computerPattern.push(randomLetter);

    playComputer();

    // setTimeout(function(){
    //     document.querySelector(".messageText").innerHTML = "Repeat...";
    //     computerTurn = false;
    // },1000);

}

function playComputer(){

    findSound(computerPattern[arrayNumber]);
    // console.log("Found sound: " + computerPattern[arrayNumber] + " with array number: " + arrayNumber);
    playSound();
    animateButton(computerPattern[arrayNumber]);
    arrayNumber++;

    if (arrayNumber<computerPattern.length){
        setTimeout(playComputer, 500);
    } else {
        setTimeout(function(){
            document.querySelector(".messageText").innerHTML = "Repeat...";
            computerTurn = false;
        },1000);   
    }

}


function gameOver(){
    document.querySelector(".messageText").innerHTML = "Game over! Press any key to retry";
    document.body.classList.add("gameOver");
    setTimeout(function(){document.body.classList.remove("gameOver");},400);
    firstGame = true;
    computerTurn = false;
    computerPattern = [];
    playerPattern = [];
    arrayNumber = 0;
    arrayChecker = 0;
    level = 1;
    document.querySelector(".levelNumber").innerHTML = level;
}