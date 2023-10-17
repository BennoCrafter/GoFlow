
import { Widget } from "../widget.js";


export class TextBox extends Widget {
    constructor(widgetId, data, uniqueWidgetData) {
      super(widgetId, data, uniqueWidgetData);
      console.log(widgetId)
      this.initializeDragAndDrop();
      this.updateText()
      this.saveTextListener()
      this.updateTextPos()
    }
    
    initializeDragAndDrop() {
        const draggable = this.widgetPath.querySelector(".textBoxWindow").querySelector(".text");
        let isDragging = false;
        let offsetX, offsetY;
      
        draggable.style.left = this.uniqueWidgetData.textX || 0; // Set initial left position
        draggable.style.top = this.uniqueWidgetData.textY || 0; // Set initial top position
        
        draggable.addEventListener("mousedown", (event) => {
          isDragging = true;
          offsetX = event.clientX - draggable.getBoundingClientRect().left;
          offsetY = event.clientY - draggable.getBoundingClientRect().top + 33;
          draggable.style.cursor = "grabbing";
        });
      
        document.addEventListener("mousemove", (event) => {
          if (isDragging) {
            const containerRect = this.widgetPath.getBoundingClientRect();
            const left = event.clientX - containerRect.left - offsetX;
            const top = event.clientY - containerRect.top - offsetY;
      
            draggable.style.left = `${left}px`;
            draggable.style.top = `${top}px`;
            this.uniqueWidgetData.textX = draggable.style.left;
            this.uniqueWidgetData.textY = draggable.style.top;
          }
        });
      
        document.addEventListener("mouseup", () => {
          if (isDragging) {
            isDragging = false;
            draggable.style.cursor = "grab";
          }
        });
      }      
  
    updateText() {
      this.widgetPath
        .querySelector(".textBoxWindow")
        .querySelector("#textContent").textContent = this.uniqueWidgetData.textContent
    }

    saveTextListener(){
        const textSpan = this.widgetPath.querySelector(".textBoxWindow").querySelector(".text").querySelector("#textContent")
        textSpan.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              event.preventDefault(); // Prevent the default Enter key behavior (e.g., adding a new line)
              this.uniqueWidgetData.textContent = textSpan.textContent
              textSpan.blur()
              this.saveData()
            }
            if (event.key === "Enter" && event.shiftKey) {
                console.log("triggerd")
                textSpan.innerHTML += '<br>';
                textSpan.focus()
            }
          });
    }

    updateTextPos(){
        const text = this.widgetPath.querySelector(".textBoxWindow").querySelector(".text")
        text.style.left = this.uniqueWidgetData.textX
        text.style.top = this.uniqueWidgetData.textY
        this.saveData()
    }
}
  