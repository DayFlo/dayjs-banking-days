import dayjs from 'dayjs'

type occurrence = -1 | 1 | 2 | 3 | 4 | 5
type dayOfWeek = dayjs.Dayjs['day'] // 0-6
// fixed date holidays are in the format 'MM-DD'
interface HolidayMap {
    fixedDateHolidays: string[]
    floatingDateHolidays: {
        [key: string]: [dayOfWeek, occurrence]
    }
}

export { HolidayMap }