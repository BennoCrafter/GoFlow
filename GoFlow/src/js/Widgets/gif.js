import { Widget } from "../widget.js";

export class GifWidget extends Widget {
  constructor(
    widgetId,
    data,
    uniqueWidgetData
  ) {
    super(widgetId, data, uniqueWidgetData);
    //this.widgetPath.querySelector(".title-bar").remove()
    this.widgetPath.innerHTML += `<img src="${uniqueWidgetData.gifSrc}" width=${uniqueWidgetData.width} height=${uniqueWidgetData.height}/>`

}
 
}