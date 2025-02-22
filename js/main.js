import * as api from "./api.js";
import * as ui from "./ui.js";

var message = "";

var inputLocked = false;
function lockInput() {
    inputLocked = true;
    ui.lockTextField();
}
function unlockInput() {
    inputLocked = false;
    ui.unlockTextField();
}

function initializeUserInput() {
    document.addEventListener("keydown", showCursor);
    document.addEventListener("mousedown", showCursor);
    document.getElementById("txt").addEventListener("input", mobileType);
    document.addEventListener("keydown", handleControl);
}

function showCursor() {
    if (!inputLocked) ui.showCursor();
}

function handleControl(event) {
    if (inputLocked) return;
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
}

function processText() {
    if (message == "access logs.") {
        requestPassword();
        return;
    }
    api.addEntry(message);
    deleteText();
}

function insertText(text) {
    text = text.toLowerCase();
    message += text;
    ui.addText(text);
}

function removeLastCharacter() {
    if (message.length === 0) return;
    message = message.substring(0, message.length - 1);
    ui.removeText();
}

function deleteText() {
    message = "";
    ui.deleteAllText();
    ui.hideCursor();
}

function mobileType(event) {
    if (inputLocked) return;
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
        ui.resetTextInput();
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

function wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function typeDisplayText(text, speed = 120, varience = 80) {
    return new Promise((resolve) => {
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
                resolve();
            }
        }
        typeChar();
    });
}

async function requestPassword() {
    lockInput();
    deleteText();
    ui.showCursor();
    await wait(3000);
    await typeDisplayText("please enter password.");
    await wait(1500);
    ui.hideCursor();
    deleteText();
    unlockInput();
    //redirect to /logs
    window.location.href = "/logs";
}


initializeUserInput();