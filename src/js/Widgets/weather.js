import { Widget } from "../widget.js";


export class WeatherWidget extends Widget{
    constructor(widgetId, data, uniqueWidgetData){
        super(widgetId, data, uniqueWidgetData)
        this.getWeatherData()

        this.weatherIconsDict = {0: ["clear-night.svg","clear-day.svg"], 1: ["clear-night.svg","clear-day.svg"], 2: ["partly-cloudy-night.svg", "partly-cloudy-day.svg"], 3: ["overcast-night.svg", "overcast-day.svg"], 45: ["fog-night.svg", "wo_fog-day.svg"], 61: ["partly-cloudy-night-drizzle.svg", "partly-cloudy-day-drizzle.svg"], 65: ["partly-cloudy-night-rain.svg", "partly-cloudy-day-rain.svg"]}
      
        if(this.uniqueWidgetData.longitude==null && this.uniqueWidgetData.latitude==null){
          this.showLocationSelectionPopup()
          this.submitLocationListener()
        }else{
          this.widgetPath.querySelector(".location-popup").style.display = "none"
          this.widgetPath.querySelector(".weatherWindow").style.display = "block"
        }
      }

    showLocationSelectionPopup(){
      this.widgetPath.querySelector(".location-popup").style.display = "block"
      this.widgetPath.querySelector(".weatherWindow").style.display = "none"
    }

    getWeatherData(){
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.uniqueWidgetData.latitude}&longitude=${this.uniqueWidgetData.longitude}&hourly=temperature_2m,precipitation_probability,precipitation,weathercode,is_day&daily=weathercode&current_weather=true&timezone=Europe%2FBerlin`;

        fetch(url)
          .then(response => {
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error(`Failed to fetch data. Status code: ${response.status}`);
            }
          })
          .then(data => {
            // Now you can work with the JSON data
            console.log(data);
            // current_weather .. weathercode--- is_day
            // get loc with long and lang
            const loc = "Berlin"
            this.setWeatherIcon(1, this.weatherIconsDict[data["current_weather"]["weathercode"]][data["current_weather"]["is_day"]], data["current_weather"]["temperature"], loc)
          })
          .catch(error => {
            console.error(error);
          });
          
    }
    // day stands for, which day we should set the weather icon. day 1 is current day
    setWeatherIcon(day, weatherPath, temp, loc){
        const dayPath = this.widgetPath.querySelector(".weatherWindow").querySelector(`#day${day}`)
        // set img src
        const imgSrc = dayPath.querySelector("#weather-src");
        imgSrc.src = `resources/weather-icons/${weatherPath}`;
        // set temperature
        dayPath.querySelector(".temperature").textContent = temp;

        // set location
        dayPath.querySelector(".location").textContent = loc

    }

    submitLocationListener(){
    this.widgetPath.querySelector(".location-popup").querySelector("#submitWeatherLoc").addEventListener("click", (event) => {
      this.uniqueWidgetData.latitude = this.widgetPath.querySelector(".location-popup").querySelector("#latitudeField").value
      this.uniqueWidgetData.longitude = this.widgetPath.querySelector(".location-popup").querySelector("#longitudeField").value
      
      this.widgetPath.querySelector(".location-popup").querySelector("#latitudeField").value = ""
      this.widgetPath.querySelector(".location-popup").querySelector("#longitudeField").value = ""
    
      this.widgetPath.querySelector(".location-popup").style.display = "none"
      this.widgetPath.querySelector(".weatherWindow").style.display = "block"
    })
    }

    enterEditMode(){
      this.showLocationSelectionPopup()
      this.submitLocationListener()
    }
} 