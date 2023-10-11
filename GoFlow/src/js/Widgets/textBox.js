import { Widget } from "../widget.js";

export class TextBox extends Widget{
    constructor(
        widgetId,
        data,
        uniqueWidgetData
    
    ){
        const type = "textBox";
        super(widgetId, type, data, uniqueWidgetData);

    }

}