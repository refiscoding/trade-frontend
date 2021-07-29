import * as React from 'react'

import Calendar, { CalendarProps, CalendarTileProperties } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './style.css'

type CalendarComponentProps = CalendarProps & {
  setSelectedDeliveryDate: React.Dispatch<React.SetStateAction<Date | Date[]>>
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ setSelectedDeliveryDate }) => {
  const handleDateChanged = (date: Date | Date[]) => {
    setSelectedDeliveryDate(date)
  }
  const isToday = (someDate: Date) => {
    const today = new Date()
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    )
  }
  const setTileClassName = (props: CalendarTileProperties) => {
    const { date } = props
    const activeDay = isToday(date)
    if (activeDay) {
      return 'current-day'
    }
    return ''
  }
  return (
    <Calendar tileClassName={setTileClassName} onChange={handleDateChanged} minDate={new Date()} />
  )
}

export default CalendarComponent
