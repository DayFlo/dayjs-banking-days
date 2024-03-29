import { Dayjs, PluginFunc } from 'dayjs'
import { bankingDaysOptions } from 'dayjs' // From our extended options

const bankingDays: PluginFunc<bankingDaysOptions>  = (option: Partial<bankingDaysOptions> = {}, dayjsClass) => {
	// On first load, check the option object for fixed date holidays and validate them
	if (option.fixedDateHolidays) {
		for (let i = 0; i < option.fixedDateHolidays.length; i++) {
			if (!/^\d{2}-\d{2}$/.test(option.fixedDateHolidays[i])) {
				throw new Error('Fixed date holidays must be in the format MM-DD')
			}
		}
	}

	const holidayMap = {
		fixedDateHolidays: [
			'01-01', // New Year's Day
			'06-19', // Juneteenth
			'07-04', // Independence Day
			'11-11', // Veterans Day
			'12-25', // Christmas Day
		],
		floatingDateHolidays: {
			'01': [1, 3], // Martin Luther King Jr. Day
			'02': [1, 3], // Presidents Day
			'05': [1, -1], // Memorial Day
			'09': [1, 1], // Labor Day
			'10': [1, 2], // Columbus Day
			'11': [4, 4], // Thanksgiving Day
		},
	}

	// Assuming appendHolidays follows the same structure
	if (option.fixedDateHolidays) {
		holidayMap.fixedDateHolidays = [
			...holidayMap.fixedDateHolidays,
			...option.fixedDateHolidays,
		]
	}

	if (option.floatingDateHolidays) {
		Object.keys(option.floatingDateHolidays).forEach((month) => {
			if (holidayMap.floatingDateHolidays[month]) {
				// Merge or override the existing entry
				holidayMap.floatingDateHolidays[month] = option.floatingDateHolidays[month]
			} else {
				// Otherwise add new entry
				holidayMap.floatingDateHolidays[month] = option.floatingDateHolidays[month]
			}
		})
	}

	/**
	 * Check if the date is a banking day
	 * ```
	 * dayjs('2024-01-01').isBankingDay() // false
	 * dayjs('2024-01-06').isBankingDay() // false
	 * ```
	 */
	function isBankingDay(this: Dayjs): boolean {
		const commonNonBankingDays = [0, 6] // Sunday and Saturday

		if (commonNonBankingDays.includes(this.day())) return false

		if (this.isBankingHoliday()) return false

		return true
	}

	/**
	 * Check date passed is a holiday against a set of a holidays
	 * Format: YYYY-MM-DD
	 * ```
	 * dayjs('2024-01-01').isBankHoliday() // true
	 * dayjs('2024-01-06').isBankHoliday() // false
	 * dayjs('2024-01-02').isBankHoliday() // false
	 * ```
	 */
	function isBankingHoliday(this: Dayjs): boolean {
		const [, month, day] = this.format('YYYY-MM-DD').split('-')

		// Check if month is included in the fixed date holidays
		if (holidayMap.fixedDateHolidays.some(x=> x.split('-')[0] === (month))) {
			// Check if the day is included in the fixed date holidays
			const adjustedMonthDay = this.format('MM-DD')
			if (holidayMap.fixedDateHolidays.includes(adjustedMonthDay)) {
				return true
			}

			const clonedDay = this.clone()
			// If day is Friday, check if the next day is a holiday
			if (this.day() === 5) {
				const addedDay = clonedDay.add(1, 'day')
				if (holidayMap.fixedDateHolidays.includes(addedDay.format('MM-DD')))
					return true
			} else if (this.day() === 1) { // If day is Monday, check if the previous day is a holiday
				const subtractedDay = clonedDay.subtract(1, 'day')
				if (holidayMap.fixedDateHolidays.includes(subtractedDay.format('MM-DD')))
					return true
			}
		}

		// Check if the month is in the holiday map
		if (!Object.keys(holidayMap.floatingDateHolidays).includes(month))
			return false

		// Check if the day is a floating date holiday day (e.g. Monday)
		const [weekdayTarget, occurrence] = holidayMap.floatingDateHolidays[month]
		if (weekdayTarget === this.day()) {
			const parsedDayOfMonth = parseInt(day)
			const nthOccurence = Math.ceil(parsedDayOfMonth / 7)
			// Check for "last" occurrence
			if (occurrence === -1 && parsedDayOfMonth + 7 > this.daysInMonth())
				return true
			// Check for nth occurrence match
			else return nthOccurence === occurrence
		}

		return false
	}

	/**
	 * Add business days to a date
	 * ```
	 * dayjs('2023-12-22').addBankingDays(2) // 2023-12-27
	 * dayjs('2024-01-02').addBankingDays(1) // 2024-01-03
	 * dayjs('2024-01-05').addBankingDays(1) // 2024-01-08
	 * ```
	 */
	function addBankingDays(number: number): Dayjs {
		if (number === 0) return this

		let daysAdded = 0
		let day = this.clone()

		// Add days to the current date
		while (daysAdded < Math.abs(number)) {
			day = number > 0 ? day.add(1, 'day') : day.subtract(1, 'day')
			if (day.isBankingDay()) daysAdded++
		}

		return day
	}

	/**
	 * Subtract business days from a date
	 * ```
	 * dayjs('2023-12-27').subtractBankingDays(2) // 2023-12-22
	 * dayjs('2024-01-03').subtractBankingDays(1) // 2024-01-02
	 * dayjs('2024-01-08').subtractBankingDays(1) // 2024-01-05
	 */
	function subtractBankingDays(number: number) {
		return this.addBankingDays(number * -1)
	}

	/**
	 * Get the next banking day
	 * ```
	 * dayjs('2023-12-22').nextBankingDay() // 2023-12-27
	 * dayjs('2024-01-02').nextBankingDay() // 2024-01-03
	 * dayjs('2024-01-05').nextBankingDay() // 2024-01-08
	 * ```
	 */
	function nextBankingDay() {
		return this.addBankingDays(1)
	}

	/**
	 * Get the previous banking day
	 * ```
	 * dayjs('2023-12-26').prevBankingDay() // 2023-12-22
	 * dayjs('2024-01-03').prevBankingDay() // 2024-01-02
	 * dayjs('2024-01-08').prevBankingDay() // 2024-01-05
	 */
	function previousBankingDay() {
		return this.addBankingDays(-1)
	}

	dayjsClass.prototype.isBankingDay = isBankingDay
	dayjsClass.prototype.isBankingHoliday = isBankingHoliday
	dayjsClass.prototype.addBankingDays = addBankingDays
	dayjsClass.prototype.subtractBankingDays = subtractBankingDays
	dayjsClass.prototype.nextBankingDay = nextBankingDay
	dayjsClass.prototype.previousBankingDay = previousBankingDay
}

export default bankingDays
