var mobileType;
var handleControl;

export function initializeUI(mT, hC) {
    mobileType = mT;
    handleControl = hC;
    document.addEventListener("keydown", showCursor);
    document.addEventListener("mousedown", showCursor);
    document.getElementById("txt").addEventListener("input", mobileType);
}

export function stopUserInput() {
    document.removeEventListener("keydown", showCursor);
    document.removeEventListener("mousedown", showCursor);
    document.getElementById("txt").removeEventListener("input", mobileType);
    document.removeEventListener("keydown", handleControl);
    hideCursor();
}

export function startUserInput() {
    document.addEventListener("keydown", showCursor);
    document.addEventListener("mousedown", showCursor);
    document.getElementById("txt").addEventListener("input", mobileType);
}

var inactivityTimer;
function resetTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(function () {
        hideCursor();
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

    resetTimer();
}

function hideCursor() {
    var cursor = document.querySelector(".cursor");
    cursor.style.display = "none";
    cursor.style.animation = "none";
    document.querySelector("textarea").blur();
}