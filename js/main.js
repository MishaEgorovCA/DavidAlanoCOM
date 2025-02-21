import { addEntry } from "./api.js";
import { initializeUI, startUserInput, stopUserInput, showCursor, hideCursor } from "./ui.js";

initializeUI(mobileType, handleControl);

var message = "";
function deleteText() {
    var cursor = document.getElementById("cursor");
    var previousSibling = cursor.previousSibling;
    //Delete all the text up until the cursor
    while (previousSibling) {
        cursor.parentNode.removeChild(previousSibling);
        previousSibling = cursor.previousSibling;
    }
    message = "";
    hideCursor();
}

function handleControl(event) {
    switch (event.key) {
        case "Backspace":
            removeLastCharacter();
            break;
        case "Enter":
            processText();
            break;
        default:
            if (!compatibilityCheck(event))
                typeText(event);
            break;

    }
    //Refresh inactivity timer
    resetTimer();
}

function processText() {
    if (message == "access logs.") {
        //redircet to /access
        requestPassword();
        return;
    }
    addEntry(message);
    deleteText();
}

function insertText(text) {
    text = text.toLowerCase();
    var cursor = document.getElementById("cursor");
    var textNode = document.createTextNode(text);
    var span = document.createElement("span");
    span.appendChild(textNode);
    message += text;
    span.classList.add("fade-in");
    cursor.parentNode.insertBefore(span, cursor);
    //Scroll to bottom
    document.body.scrollIntoView({ behavior: "smooth", block: "end" });
}

function removeLastCharacter() {
    var cursor = document.getElementById("cursor");
    var previousSibling = cursor.previousSibling;
    if (previousSibling) {
        cursor.parentNode.removeChild(previousSibling);
        message = message.substring(0, message.length - 1);
    }
    var txt = document.getElementById("txt");
    txt.value = "→";
}

function mobileType(event) {
    if (compatibilityCheck(event)) {
        typeText(event);
    }
}

function typeText(event) {
    //Make sure it is a text key not a control key (SHIFT ALT etc)
    var key = event.data || event.key;
    //if key starts with → remove it
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

/*Output logs*/

function typeDisplayText(text, speed = 100, varience = 70) {
    return new Promise((resolve) => {
        showCursor();
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                var s = speed + Math.random() * varience;
                //think a bit after a space bar
                if (text[i] == " ")
                    s *= 2;

                insertText(text[i]);
                i++;
                setTimeout(typeChar, s);
            } else {
                hideCursor();
                resolve();
            }
        }
        typeChar();
    });
}

async function displayText(text) {
    stopUserInput();
    deleteText();

    await typeDisplayText(text); // change to then
    startUserInput();
}

function requestPassword() {
    displayText("please enter password.");
}