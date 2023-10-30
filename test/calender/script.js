import { Widget } from "../widget.js";


export class CalendarWidget extends Widget{
    constructor(widgetId, data, uniqueWidgetData){
        super(widgetId, data, uniqueWidgetData)
        this.uniqueWidgetData = uniqueWidgetData
        // month abbreviations
        this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // get current date values
        this.currentDate = new Date();
        this.currentYear = currentDate.getFullYear();
        this.currentMonth = currentDate.getMonth();
        this.currentDay = currentDate.getDate();
        this.currentMarkedDay; 
        this.loadMonth(currentMonth, currentYear)

    }
    getDescription(year, month, day){
        const event = events.find(event => event.from.getFullYear() === year && event.from.getMonth() == month && event.from.getDate() == day)
        return event ? [true, event.description] : [false, "No Event for this date"]
    }
    
    loadMonth(month, year){
        this.uniqueWidgetData.events.push(new Event("New Test", new Date(2023, 9, 30, 15, 30), new Date(2023, 9, 30, 16, 30)))
        // set month and year
        document.querySelector('.calendar__month').innerText = months[currentDate.getMonth()];
        document.querySelector('.calendar__year').innerText = currentYear;

        // create grid of days
        let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        let week = document.createElement('div');
        week.classList.add('calendar__day-numbers-row');
        week.id = "week" + 0/7
        
        for (i = 1; i <= daysInMonth; i++) {
            let day = document.createElement('span');
            day.classList.add('calendar__day-number');
            day.innerText = i;
            day.id = `${year}|${month}|${i}`
        
            if(i===currentDay){
                day.classList.add('calendar__day-number--current');
                currentMarkedDay = day;
            }
            week.append(day);
        
            if (new Date(currentYear, currentMonth, i).getDay() == 6 || i == daysInMonth) {
                document.querySelector('.calendar__day-numbers').append(week);
        
                if (i != daysInMonth) {
                    week = document.createElement('div');
                    week.classList.add('calendar__day-numbers-row');
                    week.id = "week" + i/7
                }
            }
            this.loadDayEventListener(day)
        }
    
        this.loadEvents()
    }

    loadDayEventListener(day){
        day.addEventListener("click", (event) =>{
            const Cday = day.id.split("|")[2]
            // console.log("Clicked day:", Cday, monthName, year.toString())
            const result = getDescription(year, month, parseInt(Cday))
            console.log(result[0] ? "Has Event: " + result[1] : result[1])
            currentMarkedDay.classList.remove("calendar__day-number--current")
            currentMarkedDay = day;
            currentMarkedDay.classList.add("calendar__day-number--current")    
        })
    }

    loadEvents(){
        for(const rawEvent of events){
            const path = document.querySelector(".calendar__day-numbers")
            let event = path.querySelector(`#week${parseInt(rawEvent.from.getDate()/7)}`)
            console.log(rawEvent.from.getMonth())
            event = event.querySelector(`[id="${rawEvent.from.getFullYear()}|${rawEvent.from.getMonth()}|${rawEvent.from.getDate()}"`)
            console.log(event)
            const point = document.createElement("span")
            point.classList.add("marked") 
            event.appendChild(point)     
        }
    }
}





class Event{
    constructor(description, from, to){
        this.description = description
        this.from = from
        this.to = to
    }
}
