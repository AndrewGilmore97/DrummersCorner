// A basic web application to play drums with either the mouse of the keyboard, inspired by Angela Yu

// Select all drums
const drums = document.querySelectorAll(".drum");
// Select all buttons
const buttons = document.querySelectorAll(".smallBtn");

// Initialise the variables
let instrument = "";
let key = "";
let keyFound = true;

// The memory mode, booleans to determine if the website is on the memory tab
let memoryGame = false;
// The possible letter choices for the random number generator
const numToLetter = ["q","w","e","r","a","s","d"];
// Default the game to be new
let firstGame = true;
// When active, computerTurn means that clicks and keyboard input does nothing, to prevent glitches and spamming
let computerTurn = false;
// Arrays to compare for the memory game
let computerPattern = [];
let playerPattern = [];
// Array number determines the buttons and in what order they should play for the computer's turn
let arrayNumber = 0;
// Array checker is used as reference to ensure that the array created by the user each turn matches each step with the computer array
let arrayChecker = 0;
// Level, starting from 1
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

    // If the memory game isn't active, any valid input can be generated at will
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

    // Otherwise the memory game will determine if it is time for the computer's turn or the player's
    } else if (memoryGame === true && firstGame === true){
        // Initialise level to 1 when starting a new game, so players can see their high scores on game over
        level = 1;
        // Update the level display
        document.querySelector(".levelNumber").innerHTML = level;
        // Computer turn locks out player input and starts the sequence generator function
        computerTurn = true;
        sequenceGen();

    // If the memory game is active and it isn't the computer's turn, the input is added to an array, it is played as normal
    } else if (memoryGame === true && computerTurn === false){

        playerPattern.push(note);
        findSound(note);

        if (keyFound === true) {
            playSound();
            animateButton(note);
        } else {
            keyFound = true;
        }

        // If the input isn't matching the computer's array, it's game over
        if (computerPattern[arrayChecker] !== playerPattern[arrayChecker]){
            gameOver();
        // Otherwise if it's correct but there is still more array to compare, the array checker progresses and awaits the next input
        } else if (computerPattern[arrayChecker] === playerPattern[arrayChecker] && computerPattern.length !== playerPattern.length){
            arrayChecker++
        }
        // If the array lengths match and the last input is correct, it is time to go to the next level
        else if (computerPattern.length === playerPattern.length && computerPattern[arrayChecker] === playerPattern[arrayChecker]){
            level++;
            document.querySelector(".levelNumber").innerHTML = level;
            // Reinitialising the arrays for the computer output sequence and comparison checker
            arrayChecker = 0;
            arrayNumber = 0;
            // The player's array is emptied as they are required to remember the entire pattern with each round
            playerPattern = [];
            // The player is locked out of input and after a small delay, the next sequence is generated
            computerTurn = true;
            setTimeout(sequenceGen,1000);
        }

    } 

}


// Menu buttons

// Find menu function
function findMenu(btn) {

    switch(btn) {

        case "Freestyle":
            // Grey out the active button
            buttons[0].classList.add("clicked");
            buttons[1].classList.remove("clicked");

            // Change the background
            document.body.classList.remove("bgMemory");

            // Deactive memory game
            memoryGame = false;

            document.querySelectorAll(".levelTitle")[0].style.display = "none";
            document.querySelectorAll(".levelTitle")[1].style.display = "none";
            document.querySelectorAll(".levelTitle")[2].style.display = "none";
            // The message text is only for the memory game
            document.querySelector(".messageText").innerHTML = "";

            // Turn off the game and reintialise if you leave the page so it is as before
            firstGame = true;
            computerTurn = false;
            computerPattern = [];
            playerPattern = [];
            arrayNumber = 0;
            arrayChecker = 0;
            level = 1;
            document.querySelector(".messageText").innerHTML = "Press any key to start";
            document.querySelector(".levelNumber").innerHTML = level;

            // Set the page title
            document.querySelector(".subTitle").innerHTML = "Freestyle Mode";

            // Ensure all buttons have uniform colours for freestyle mode
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

            document.querySelector(".subTitle").innerHTML = "Memory Game";

            for (let i=0; i<drums.length;i++){
                drums[i].classList.remove("freeStl");
            }
            break;
        default:
            console.log(btn);
    }
}

// A function to compare the menu buttons
function menuClicked(btn) {
    const buttonSel = this.innerHTML;
    findMenu(buttonSel);

}

/////////Memory Game

function sequenceGen(){
    // Visually communciate to the player that they are not expected to input yet
    document.querySelector(".messageText").innerHTML = "Listen...";

    // Make sure first game is only active once
    if (firstGame === true) {
        firstGame = false;
    }

    // Generate random number and add to the sequence based on the corresponding letter
    let randomLetter = numToLetter[Math.floor(Math.random()*7)];
    computerPattern.push(randomLetter);

    // To play each part
    playComputer();

}

// A function to play each part of the computer generated array
function playComputer(){

    // Play the sound in that point of the array
    findSound(computerPattern[arrayNumber]);
    playSound();
    animateButton(computerPattern[arrayNumber]);
    arrayNumber++;

    // If the array isn't finished, with a small wait, recommence the function playing the next sequence, otherwise after a pause, allow the player to input
    if (arrayNumber<computerPattern.length){
        setTimeout(playComputer, 500);
    } else {
        setTimeout(function(){
            document.querySelector(".messageText").innerHTML = "Repeat...";
            computerTurn = false;
        },400);   
    }

}

// A function that resets the game data
function gameOver(){

    // A little animation and sound to indigate losing the game
    document.querySelector(".messageText").innerHTML = "Game over! Press any key to retry";
    document.body.classList.add("gameOver");
    setTimeout(function(){document.body.classList.remove("gameOver");},400);
    instrument = "wrong";
    playSound();

    // Empty the game data
    computerPattern = [];
    playerPattern = [];
    arrayNumber = 0;
    arrayChecker = 0;

    // Allow player to see their score before resettinng
    document.querySelector(".levelNumber").innerHTML = level;

    // Stop players from spamming the button
    computerTurn = true;
    setTimeout(function(){
        firstGame = true;
        computerTurn = false;
    },700);
}