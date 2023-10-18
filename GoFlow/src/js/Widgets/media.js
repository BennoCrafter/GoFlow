import { Widget } from "../widget.js";

export class MediaWidget extends Widget {
  constructor(
    widgetId,
    data,
    uniqueWidgetData
  ) {
    super(widgetId, data, uniqueWidgetData);
    this.uniqueWidgetData = uniqueWidgetData
    //this.widgetPath.querySelector(".title-bar").remove()
    this.initializeEventListener()
    if(uniqueWidgetData.mediaSrc==""){this.showSrcChooser()}else{this.showMediaSrc()}
  
  }

  initializeEventListener(){

  }
 
  showSrcChooser(){
    const inputField = document.createElement("input");
    inputField.placeholder = "please enter gif link"
    this.widgetPath.appendChild(inputField);

    inputField.addEventListener("keydown", (event) => {
      if(event.key == "Enter"){
        this.uniqueWidgetData.mediaSrc = inputField.value
        inputField.value = ""; // Clear the default text when typing starts
        this.showMediaSrc()
        // hide field
        inputField.style.display =  "none"
      }
    })
  }

  showMediaSrc(){
    const mediaElement = document.createElement("img");
    mediaElement.src = this.uniqueWidgetData.mediaSrc;
    mediaElement.style.width = this.uniqueWidgetData.width;
    mediaElement.style.height = this.uniqueWidgetData.height;
    this.widgetPath.querySelector(".mediaSrc").appendChild(mediaElement)
  }
}