let isDragging = false;
let offsetX, offsetY;
let activeWindow = null;
let widgetPositions = {}; // Store widget positions

document.addEventListener("mousedown", (event) => {
    const titleBar = event.target.closest(".title-bar");
    const window = event.target.closest(".widget");
    if (titleBar) {
        isDragging = true;
        activeWindow = window;
        offsetX = event.clientX - window.getBoundingClientRect().left;
        offsetY = event.clientY - window.getBoundingClientRect().top;
    }
});

document.addEventListener("mousemove", (event) => {
    if (isDragging && activeWindow) {
        document.addEventListener("selectstart", preventTextSelection);

        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        activeWindow.style.left = x + "px";
        activeWindow.style.top = y + "px";

        // Store the updated widget position as a percentage of the window size
        const windowRect = activeWindow.getBoundingClientRect();
        const windowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        const position = {
            x: x / windowSize.width,
            y: y / windowSize.height,
        };
        widgetPositions[activeWindow.id] = position;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    activeWindow = null;
    document.removeEventListener("selectstart", preventTextSelection);
});


function preventTextSelection(e) {
    e.preventDefault();
  }