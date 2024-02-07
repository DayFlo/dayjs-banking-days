import { Dayjs, PluginFunc } from 'dayjs'

declare const plugin: PluginFunc
export as namespace plugin
export = plugin

type occurrence = -1 | 1 | 2 | 3 | 4 | 5
type dayOfWeek = Dayjs['day'] // 0-6

declare namespace plugin {
	interface BankingDaysOptions {
		fixedDateHolidays: string[]
		floatingDateHolidays: {
			[key: string]: [dayOfWeek, occurrence]
		}
	}
	interface BankingDays {
		isBankingDay(): boolean
		isBankingHoliday(): boolean
		addBankingDays(number): Dayjs
		subtractBankingDays(number): Dayjs
		nextBankingDay(): Dayjs
		previousBankingDay(): Dayjs
	}
}

declare module 'dayjs' {
	interface Dayjs extends plugin.BankingDays {}
}
