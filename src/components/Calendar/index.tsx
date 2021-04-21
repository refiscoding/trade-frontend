import * as React from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarComponent = () => {
    const handleDateChanged = (date: Date | Date[]) => {
        console.log("SELECTED DATE", date);
    };
    return <Calendar onChange={handleDateChanged} />
};

export default CalendarComponent;