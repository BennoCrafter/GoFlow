import { Widget } from "../widget.js";

export class MediaWidget extends Widget {
  constructor(
    widgetId,
    data,
    uniqueWidgetData
  ) {
    super(widgetId, data, uniqueWidgetData);
    //this.widgetPath.querySelector(".title-bar").remove()
    const mediaElement = document.createElement("img");
    mediaElement.src = uniqueWidgetData.mediaSrc;
    mediaElement.style.width = uniqueWidgetData.width;
    mediaElement.style.height = uniqueWidgetData.height;
    this.widgetPath.querySelector(".mediaSrc").appendChild(mediaElement)
    this.initializeEventListener()
  
  }

  initializeEventListener(){
    
  }
 
}