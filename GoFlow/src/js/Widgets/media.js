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
    this.inputField = this.widgetPath.querySelector(".mediaSrc").querySelector("#inputField")
    if(uniqueWidgetData.mediaSrc==""){this.showSrcChooser()}else{this.showMediaSrc()}
  
  }

  initializeEventListener(){

  }


  showSrcChooser(){
    this.inputField.style.display = "block"
    this.inputField.placeholder = "please enter media link"
    this.inputField.value = ""
    this.inputField.addEventListener("keydown", (event) => {
      if(event.key == "Enter"){
        this.uniqueWidgetData.mediaSrc = this.inputField.value
        this.showMediaSrc()
        // hide field
        this.inputField.style.display =  "none"
      }
    })
  }

  showMediaSrc(){
    const mediaElement = this.widgetPath.querySelector(".mediaSrc").querySelector("#mediaElement");

    mediaElement.src = this.uniqueWidgetData.mediaSrc;
    mediaElement.style.width = this.uniqueWidgetData.width;
    mediaElement.style.height = this.uniqueWidgetData.height;
    }

  enterEditMode(){
    console.log("x")
    this.showSrcChooser()
  }

}