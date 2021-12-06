// A basic web application to play drums with either the mouse of the keyboard, inspired by Angela Yu

// Select all drums
const drums = document.querySelectorAll(".drum");

// Initialise the variables
let instrument = "";
let key = "";
let keyFound = true;

// Add an event listener for each of the drum buttons for if they are clicked
for (let i = 0; i< drums.length; i++) {
    drums[i].addEventListener("click",clicked);
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
    // Check input to find matching instrument
    findSound(note);
    // Skip playing the audio and animating and reinitialise if the input isn't mapped, otherwise play and animate
    if (keyFound === true) {
        playSound();
        animateButton(note);
    } else {
        keyFound = true;
    }
}