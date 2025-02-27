const cursor = document.querySelector(".cursor");
var txt = document.getElementById("txt");

var inactivityTimer;
function resetCursorTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function () {
        hideCursor();
    }, 5000);
}

export function showCursor() {
    cursor.style.display = "inline-block";
    cursor.style.animation = "cursor-blink 1s infinite";
    resetCursorTimer();
}

export function hideCursor() {
    cursor.style.display = "none";
    cursor.style.animation = "none";
    document.querySelector("textarea").blur();
}

export function addText(text) {
    var textNode = document.createTextNode(text);
    var span = document.createElement("span");
    span.appendChild(textNode);
    span.classList.add("fade-in");
    cursor.parentNode.insertBefore(span, cursor);
    //Scroll to bottom
    document.body.scrollIntoView({ behavior: "smooth", block: "end" });
}

export function removeText() {
    var previousSibling = cursor.previousSibling;
    if (previousSibling) {
        cursor.parentNode.removeChild(previousSibling);
    }
    resetTextInput();
}

export function deleteAllText() {
    var previousSibling = cursor.previousSibling;
    //Delete all the text up until the cursor
    while (previousSibling) {
        cursor.parentNode.removeChild(previousSibling);
        previousSibling = cursor.previousSibling;
    }
}

export function resetTextInput() {
    txt.value = "→";
}

export function lockTextField() {
    txt.disabled = true;
}

export function unlockTextField() {
    txt.disabled = false;
}