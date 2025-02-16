// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZsVjv92RBNBhpC8CR5487DAVOs8RR-D0",
    authDomain: "davidalanocom.firebaseapp.com",
    projectId: "davidalanocom",
    storageBucket: "davidalanocom.appspot.com",
    messagingSenderId: "2820834762",
    appId: "1:2820834762:web:16944cf2e5cf8876263b33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var messagesDB = collection(getFirestore(app), "messages");

document.addEventListener("keydown", showCursor);
document.addEventListener("mousedown", showCursor);
document.getElementById("txt").addEventListener("input", mobileType);

var inactivityTimer;
function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function () {
        var cursor = document.querySelector(".cursor");
        cursor.style.display = "none";
        cursor.style.animation = "none";
        document.querySelector("textarea").blur();
        document.addEventListener("keydown", showCursor);
        document.addEventListener("mousedown", showCursor);
    }, 5000);
}

function showCursor() {
    var cursor = document.querySelector(".cursor");
    cursor.style.display = "inline-block";
    cursor.style.animation = "cursor-blink 1s infinite";
    document.addEventListener("keydown", handleControl);
    //remove event listeners
    document.removeEventListener("keydown", showCursor);
    document.removeEventListener("mousedown", showCursor);

    // Hide the cursor after 5 seconds of inactivity
    resetTimer();
}

var message = "";
function deleteText() {
    var cursor = document.querySelector(".cursor");
    var previousSibling = cursor.previousSibling;
    //Delete all the text up until the cursor
    while (previousSibling) {
        cursor.parentNode.removeChild(previousSibling);
        previousSibling = cursor.previousSibling;
    }
    message = "";
    var cursor = document.querySelector(".cursor");
    cursor.style.display = "none";
    cursor.style.animation = "none";
    document.querySelector("textarea").blur();
    document.addEventListener("keydown", showCursor);
    document.addEventListener("mousedown", showCursor);
}

function insertText(text) {
    text = text.toLowerCase();
    var cursor = document.querySelector(".cursor");
    var textNode = document.createTextNode(text);
    var span = document.createElement("span");
    span.appendChild(textNode);
    message += text;
    span.classList.add("fade-in");
    cursor.parentNode.insertBefore(span, cursor);
}

function removeLastCharacter() {
    var cursor = document.querySelector(".cursor");
    var previousSibling = cursor.previousSibling;
    if (previousSibling) {
        cursor.parentNode.removeChild(previousSibling);
        message = message.substring(0, message.length - 1);
    }
    var txt = document.getElementById("txt");
    txt.value = "→";
}

function handleControl(event) {
    switch (event.key) {
        case "Backspace":
            //event.preventDefault();
            //TODO: message deleted message
            //addDoc(messagesDB, { data: message, timestamp: new Date(), deleted: true });
            //deleteText();//displayText("your message has been deleted.");
            removeLastCharacter();
            break;
        case "Enter":
            //STUB FOR SENDING
            addDoc(messagesDB, { data: message, timestamp: new Date(), deleted: false });
            deleteText();//displayText("message sent.");
            break;
        default:
            if (!compatibilityCheck(event))
                typeText(event);
            break;

    }
    //Refresh inactivity timer
    resetTimer();
}

function mobileType(event) {
    if (compatibilityCheck(event)) {
        typeText(event);
    }
}

function typeText(event) {
    //Make sure it is a text key not a control key (SHIFT ALT etc)
    var key = event.data || event.key;
    //if key starts with - remove it
    if (key.startsWith("→")) {
        key = key.substring(1);
    }
    if (key.length === 1) {
        insertText(key);
        //delete text in text area
        var txt = document.getElementById("txt");
        txt.value = "→";
    }
}

var keydownDetected = false;
function compatibilityCheck(event) {
    if (event.key) {
        var input = event.key;
        if (input.length === 1) {
            keydownDetected = true;
        }
    }
    //return true when keydown incompatible
    return !keydownDetected;
}

function displayText(text) {
    document.removeEventListener("keydown", showCursor);
    document.removeEventListener("mousedown", showCursor);
    document.getElementById("txt").removeEventListener("input", mobileType);

    deleteText();
    insertText(text);

    setTimeout(function () {
        document.addEventListener("keydown", showCursor);
        document.addEventListener("mousedown", showCursor);
        document.getElementById("txt").addEventListener("input", mobileType);
        deleteText();
    }, 1500);
}
