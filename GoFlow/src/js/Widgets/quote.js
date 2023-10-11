import { Widget } from "../widget";

export class Quote extends Widget{
    constructor(
        widgetId,
        title = "Widget",
        type = "textBox",
        textContent="enter text",
        textColor="black",
        xPos = "0px",
        yPos = "0px",
        anchorX = ["left", "0px"],
        anchorY = ["top", "0px"]
    ){
        super(widgetId, title, type, xPos, yPos, anchorX, anchorY);

    }

}