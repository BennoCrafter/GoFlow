import { widgets } from "./configureWidgets.js";

export function rePosWidgets(){
    let width = window.innerWidth
    let height = window.innerHeight
    for (let w of widgets) {
        const anchorX = w.data.anchorX;
        const anchorY = w.data.anchorY;
        let newXPos;
        let newYPos;
      
        // rePos x
        if (anchorX[0] == "right") {
            newXPos = width - parseInt(w.uniqueWidgetData.width) - parseInt(anchorX[1]);
        } else if (anchorX[0] == "left") {
            newXPos = parseInt(anchorX[1]);
        }
    
        // rePos y
        if (anchorY[0] == "bottom") {
            newYPos = height - parseInt(w.uniqueWidgetData.height) - parseInt(anchorY[1]);
        } else if (anchorY[0] == "top") {
            newYPos = parseInt(anchorY[1]);
        }
    
      
        w.data.xPos = newXPos + "px";
        w.data.yPos = newYPos + "px";
        w.updatePos();
      }
      
}