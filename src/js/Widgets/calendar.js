import { Widget } from "../widget.js";

export class CalendarWidget extends Widget {
  constructor(widgetId, data, uniqueWidgetData) {
    super(widgetId, data, uniqueWidgetData);
    this.uniqueWidgetData = uniqueWidgetData;
    // month abbreviations
    this.months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // get current date values
    this.currentDate = new Date();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonth = this.currentDate.getMonth();
    this.currentDay = this.currentDate.getDate();
    this.currentMarkedDay;
    //this.createEvent("Lunch", "Lunch break", new Date(2023, 10, 5, 12, 0), new Date(2023, 10, 5, 13, 0))
    //this.createEvent("Meeting 1", "Discuss project updates", new Date(2023, 10, 5, 9, 0), new Date(2023, 10, 5, 11, 0))
    this.convertSavedEventsToDateObject();
    this.loadMonth(this.currentMonth, this.currentYear);
    this.rightClickListener();
    this.submitCalendarEventListener();
    this.backButton = this.widgetPath.querySelector("#backToCalendar");
    this.backButton.addEventListener("click", () => {
      this.closeCurrentPopup();
    });
    this.createButton = this.widgetPath.querySelector("#createEvent");
    this.createButton.addEventListener("click", () => {
      this.openEventCreationPopup();
    });
  }
  getEventsOfDay(year, month, day) {
    if (
      this.uniqueWidgetData.events.hasOwnProperty(new Date(year, month, day))
    ) {
      return [true, this.uniqueWidgetData.events[new Date(year, month, day)]];
    } else {
      return [false, "No Event for this date"];
    }
  }

  loadMonth(month, year) {
    // set month and year
    document.querySelector(".calendar__month").innerText =
      this.months[this.currentDate.getMonth()];
    document.querySelector(".calendar__year").innerText = this.currentYear;

    // create grid of days
    let daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    ).getDate();
    let week = document.createElement("div");
    week.classList.add("calendar__day-numbers-row");
    week.id = "week" + 0 / 7;

    for (let i = 1; i <= daysInMonth; i++) {
      let day = document.createElement("span");
      day.classList.add("calendar__day-number");
      day.innerText = i;
      day.id = `${year}|${month}|${i}`;
      if (i === this.currentDay) {
        day.classList.add("calendar__day-number--current");
        this.currentMarkedDay = day;
      }
      week.append(day);

      if (
        new Date(this.currentYear, this.currentMonth, i).getDay() == 6 ||
        i == daysInMonth
      ) {
        document.querySelector(".calendar__day-numbers").append(week);

        if (i != daysInMonth) {
          week = document.createElement("div");
          week.classList.add("calendar__day-numbers-row");
          week.id = "week" + i / 7;
        }
      }
      day.addEventListener("click", (event) => {
        const Cday = day.id.split("|")[2];
        // console.log("Clicked day:", Cday, monthName, year.toString())
        const result = this.getEventsOfDay(year, month, parseInt(Cday));
        console.log(result[0] ? "Has Event: " + result[1] : result[1]);
        this.clickedDayId = day.id;
        if (result[0]) {
          this.showEvent(result[1], result[2]);
        } else {
          console.log(day.id);
          this.openEventCreationPopup();
        }
        // this.currentMarkedDay.classList.remove("calendar__day-number--current")
        // this.currentMarkedDay = day;
        // this.currentMarkedDay.classList.add("calendar__day-number--current")
      });
    }

    this.loadEvents();
  }

  loadEvents() {
    for (const events of Object.values(this.uniqueWidgetData.events)) {
      if (events[0].from.getMonth() == this.currentMonth) {
        const path = document.querySelector(".calendar__day-numbers");
        let eventElement = path.querySelector(
          `[id="${events[0].from.getFullYear()}|${events[0].from.getMonth()}|${events[0].from.getDate()}"]`
        );
        if (!eventElement.querySelector(".marked")) {
          const point = document.createElement("span");
          point.classList.add("marked");
          eventElement.appendChild(point);
        }
      }
    }
  }

  convertSavedEventsToDateObject() {
    for (let date of Object.keys(this.uniqueWidgetData.events)) {
      date = new Date(date);
    }
    for (const events of Object.values(this.uniqueWidgetData.events)) {
      for (const event of events) {
        event["from"] = new Date(event["from"]);
        event["to"] = new Date(event["to"]);
      }
    }
  }

  showEvent(events) {
    this.popup = this.widgetPath.querySelector(".calendar-event-popup");
    this.popup.querySelector(".event-list").innerHTML = "";
    this.popup.style.display = "flex";
    this.widgetPath.querySelector(".calendar").style.display = "none";
    this.backButton.style.display = "block";
    this.createButton.style.display = "block";

    const ul = document.querySelector(".event-list");

    events.forEach((event) => {
      const li = document.createElement("li");
      li.classList.add("event-item");

      const title = document.createElement("h2");
      title.textContent = event.title;
      title.classList.add("event-title");

      const description = document.createElement("p");
      description.textContent = event.description;
      description.classList.add("event-description");

      const date = document.createElement("p");
      if (
        event.from.getHours() === 0 &&
        event.from.getMinutes() === 0 &&
        event.to.getHours() === 0 &&
        event.to.getMinutes() === 0
      ) {
        date.textContent = "All day long";
      } else {
        date.textContent = `${event.from.getHours()}:${
          event.from.getMinutes() < 10
            ? "0" + event.from.getMinutes()
            : event.from.getMinutes()
        }-${event.to.getHours()}:${
          event.to.getMinutes() < 10
            ? "0" + event.to.getMinutes()
            : event.to.getMinutes()
        }`;
      }
      date.classList.add("event-date");
      li.appendChild(title);
      li.appendChild(description);
      li.appendChild(date);

      ul.appendChild(li);
      ul.addEventListener("click", (event) => {
        
      })
    });
  }

  createEvent(title, desc, from, to) {
    // example:
    // events = {new Date(2023-10-1): [list of events ]}
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    if (!this.uniqueWidgetData.events.hasOwnProperty(date)) {
      this.uniqueWidgetData.events[date] = [];
    }
    this.uniqueWidgetData.events[date].push(new Event(title, desc, from, to));
    this.uniqueWidgetData.events[date].sort((a, b) => a.from - b.from);
    this.saveData();
  }

  rightClickListener() {
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const clickedElement = event.target;
      if (
        clickedElement.className.split(" ").includes("calendar__day-number")
      ) {
        this.clickedDayId = clickedElement.id;
        this.openEventCreationPopup();
      }
    });
  }

  openEventCreationPopup() {
    if (this.popup !== undefined) {
      this.popup.style.display = "none";
    }
    this.popup = this.widgetPath.querySelector(".calendar-new-event-popup");
    this.popup.style.display = "flex";
    this.widgetPath.querySelector(".calendar").style.display = "none";
    this.backButton.style.display = "block";
    //calendarNewEventPopup
  }

  submitCalendarEventListener() {
    const popup = this.widgetPath.querySelector(".calendar-new-event-popup");
    popup.querySelector("#submitEvent").addEventListener("click", (event) => {
        let fromTime = popup.querySelector("#fromField").value;
      let toTime = popup.querySelector("#toField").value;
      let from;
      let to;
      const Cday = this.clickedDayId.split("|");

      if (fromTime == "" && toTime == "") {
        from = new Date(Cday[0], Cday[1], Cday[2]);
        to = new Date(Cday[0], Cday[1], Cday[2]);
      } else {
        fromTime = fromTime.split(":");
        toTime = toTime.split(":");

        from = new Date(Cday[0], Cday[1], Cday[2], fromTime[0], fromTime[1]);
        to = new Date(Cday[0], Cday[1], Cday[2], toTime[0], toTime[1]);
      }

      this.createEvent(
        popup.querySelector("#titleField").value,
        popup.querySelector("#descriptionField").value,
        from,
        to
      );
      this.closeCurrentPopup();
      this.loadEvents();

      // clear user inputs
      popup.querySelector("#fromField").value = "";
      popup.querySelector("#toField").value = "";
      popup.querySelector("#titleField").value = "";
      popup.querySelector("#descriptionField").value = "";
    });
  }

  closeCurrentPopup() {
    this.popup.style.display = "none";
    this.widgetPath.querySelector(".calendar").style.display = "block";
    this.backButton.style.display = "none";
    this.createButton.style.display = "none";
  }
}

class Event {
  constructor(title, description, from, to) {
    this.title = title;
    this.description = description;
    this.from = from;
    this.to = to;
  }
}
