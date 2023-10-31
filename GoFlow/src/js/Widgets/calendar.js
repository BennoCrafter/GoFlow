import { Widget } from "../widget.js";

export class CalendarWidget extends Widget{
    constructor(widgetId, data, uniqueWidgetData){
        super(widgetId, data, uniqueWidgetData)
        this.uniqueWidgetData = uniqueWidgetData
        // month abbreviations
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // get current date values
        this.currentDate = new Date();
        this.currentYear = this.currentDate.getFullYear();
        this.currentMonth = this.currentDate.getMonth();
        this.currentDay = this.currentDate.getDate();
        this.currentMarkedDay; 
        this.convertSavedEventsToDateObject()
        this.loadMonth(this.currentMonth, this.currentYear)

    }
    getDescription(year, month, day){
        const event = this.uniqueWidgetData.events.find(event => event.from.getFullYear() === year && event.from.getMonth() == month && event.from.getDate() == day)
        return event ? [true, event.title, event.description] : [false, "No Event for this date"]
    }
    
    loadMonth(month, year){
        this.uniqueWidgetData.events.push(new Event("SUIII  Test","wowowoowo ganz tolles zeug", new Date(2023, 9, 1, 0, 0), new Date(2023, 9, 1, 1, 0)))
        // set month and year
        document.querySelector('.calendar__month').innerText = this.months[this.currentDate.getMonth()];
        document.querySelector('.calendar__year').innerText = this.currentYear;

        // create grid of days
        let daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        let week = document.createElement('div');
        week.classList.add('calendar__day-numbers-row');
        week.id = "week" + 0/7
        
        for (let i = 1; i <= daysInMonth; i++) {
            let day = document.createElement('span');
            day.classList.add('calendar__day-number');
            day.innerText = i;
            day.id = `${year}|${month}|${i}`
        
            if(i===this.currentDay){
                day.classList.add('calendar__day-number--current');
                this.currentMarkedDay = day;
            }
            week.append(day);
        
            if (new Date(this.currentYear, this.currentMonth, i).getDay() == 6 || i == daysInMonth) {
                document.querySelector('.calendar__day-numbers').append(week);
        
                if (i != daysInMonth) {
                    week = document.createElement('div');
                    week.classList.add('calendar__day-numbers-row');
                    week.id = "week" + i/7
                }
            }
            day.addEventListener("click", (event) =>{
                const Cday = day.id.split("|")[2]
                // console.log("Clicked day:", Cday, monthName, year.toString())
                const result = this.getDescription(year, month, parseInt(Cday))
                console.log(result[0] ? "Has Event: " + result[1] : result[1])
                if(result[0]){
                    this.showEvent(result[1], result[2])
                }
                this.currentMarkedDay.classList.remove("calendar__day-number--current")
                this.currentMarkedDay = day;
                this.currentMarkedDay.classList.add("calendar__day-number--current")    
            })
        }
    
        this.loadEvents()
    }

    loadEvents(){
        for(const event of this.uniqueWidgetData.events){
            const path = document.querySelector(".calendar__day-numbers");
            let eventElement = path.querySelector(`#week${parseInt(event.from.getDate()/7)}`);
            eventElement = eventElement.querySelector(`[id="${event.from.getFullYear()}|${event.from.getMonth()}|${event.from.getDate()}"]`);
            const point = document.createElement("span");
            point.classList.add("marked"); 
            eventElement.appendChild(point);
        }
    }

    convertSavedEventsToDateObject(){
        for(const event of this.uniqueWidgetData.events){
            event["from"] = new Date(event["from"])
            event["to"] = new Date(event["to"])
        }
    }

    showEvent(title, desc){
        const backButton = this.widgetPath.querySelector(".calendar-event-popup").querySelector("#backToCalendar");
        const popup = this.widgetPath.querySelector(".calendar-event-popup")
        popup.querySelector("#event-title").textContent = title
        popup.querySelector("#description").textContent = desc
        
        popup.style.display = "flex";
        this.widgetPath.querySelector(".calendar").style.display = "none";
        
        popup.style.left = this.data.xPos
        popup.style.top = this.data.yPos

        backButton.addEventListener('click', () => {
            popup.style.display = 'none';
            this.widgetPath.querySelector(".calendar").style.display = "block";
        });

    }

}





class Event{
    constructor(title, description, from, to){ 
        this.title = title
        this.description = description
        this.from = from
        this.to = to
    }
}

