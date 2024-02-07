import assert from 'node:assert'
import { before, describe, test, it } from 'node:test'

import dayjs from 'dayjs'

import bankingDays from '../src'
before(() => {
	dayjs.extend(bankingDays)
})

describe('isBankingDay', () => {
	it('should return false for Saturday and Sunday', () => {
		assert.equal(dayjs('2024-01-06').isBankingDay(), false)
		assert.equal(dayjs('2024-01-07').isBankingDay(), false)
	})

	it("should return false for New Year's Day", () => {
		assert.equal(dayjs('2024-01-01').isBankingDay(), false)
	})

	it('should return true for a regular weekday', () => {
		assert.equal(dayjs('2024-01-02').isBankingDay(), true)
	})

	it('should return false for floating holidays', () => {
		assert.equal(dayjs('2024-05-27').isBankingDay(), false)
		assert.equal(dayjs('2025-05-26').isBankingDay(), false)
		assert.equal(dayjs('2026-05-25').isBankingDay(), false)
		assert.equal(dayjs('2027-05-31').isBankingDay(), false)
		assert.equal(dayjs('2038-05-31').isBankingDay(), false)
	})
})

describe('isBankingHoliday', () => {
	it("should return true for New Year's Day", () => {
		assert.equal(dayjs('2024-01-01').isBankingHoliday(), true)
	})

	it('should return false for a regular weekday', () => {
		assert.equal(dayjs('2024-01-02').isBankingHoliday(), false)
	})

	it('should return true for floating holidays', () => {
		assert.equal(dayjs('2024-05-27').isBankingHoliday(), true)
		assert.equal(dayjs('2025-05-26').isBankingHoliday(), true)
		assert.equal(dayjs('2026-05-25').isBankingHoliday(), true)
		assert.equal(dayjs('2027-05-31').isBankingHoliday(), true)
		assert.equal(dayjs('2038-05-31').isBankingHoliday(), true)
	})
})

describe('addBankingDays', () => {
	it('should add 1 banking day to a regular weekday', () => {
		assert.equal(
			dayjs('2024-01-02').addBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-03',
		)
	})

	it('should add 1 banking day to a Friday', () => {
		assert.equal(
			dayjs('2024-01-05').addBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-08',
		)
	})

	it('should add 1 banking day to a Saturday', () => {
		assert.equal(
			dayjs('2024-01-06').addBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-08',
		)
	})

	it('should add 1 banking day to a Sunday', () => {
		assert.equal(
			dayjs('2024-01-07').addBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-08',
		)
	})

	it("should add 1 banking day to New Year's Day", () => {
		assert.equal(
			dayjs('2024-01-01').addBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-02',
		)
	})

	it('should add 1 banking day to a floating holiday', () => {
		assert.equal(
			dayjs('2038-05-28').addBankingDays(1).format('YYYY-MM-DD'),
			'2038-06-01',
		)
	})

	it('should add 3 banking days to a regular weekday', () => {
		assert.equal(
			dayjs('2024-01-02').addBankingDays(3).format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it('should add 3 banking days to a Friday', () => {
		assert.equal(
			dayjs('2024-01-05').addBankingDays(3).format('YYYY-MM-DD'),
			'2024-01-10',
		)
	})

	it("should add 3 banking days to a day before New Year's Day", () => {
		assert.equal(
			dayjs('2023-12-29').addBankingDays(3).format('YYYY-MM-DD'),
			'2024-01-04',
		)
	})

	it('should add 3 banking days to before a floating holiday', () => {
		assert.equal(
			dayjs('2038-05-28').addBankingDays(3).format('YYYY-MM-DD'),
			'2038-06-03',
		)
	})
})

describe('subtractBankingDays', () => {
	it('should subtract 1 banking day from a regular weekday', () => {
		assert.equal(
			dayjs('2024-01-03').subtractBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-02',
		)
	})

	it('should subtract 1 banking day from a Monday', () => {
		assert.equal(
			dayjs('2024-01-08').subtractBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it('should subtract 1 banking day from a Saturday', () => {
		assert.equal(
			dayjs('2024-01-06').subtractBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it('should subtract 1 banking day from a Sunday', () => {
		assert.equal(
			dayjs('2024-01-07').subtractBankingDays(1).format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it("should subtract 1 banking day from New Year's Day", () => {
		assert.equal(
			dayjs('2024-01-01').subtractBankingDays(1).format('YYYY-MM-DD'),
			'2023-12-29',
		)
	})

	it('should subtract 1 banking day from a floating holiday', () => {
		assert.equal(
			dayjs('2038-06-01').subtractBankingDays(1).format('YYYY-MM-DD'),
			'2038-05-28',
		)
	})

	it('should subtract 3 banking days from a regular weekday', () => {
		assert.equal(
			dayjs('2024-01-05').subtractBankingDays(3).format('YYYY-MM-DD'),
			'2024-01-02',
		)
	})

	it('should subtract 3 banking days from a Monday', () => {
		assert.equal(
			dayjs('2024-01-08').subtractBankingDays(3).format('YYYY-MM-DD'),
			'2024-01-03',
		)
	})

	it("should subtract 3 banking days from New Year's Day", () => {
		assert.equal(
			dayjs('2024-01-01').subtractBankingDays(3).format('YYYY-MM-DD'),
			'2023-12-27',
		)
	})

	it('should subtract 3 banking days from a floating holiday', () => {
		assert.equal(
			dayjs('2038-06-03').subtractBankingDays(3).format('YYYY-MM-DD'),
			'2038-05-28',
		)
	})
})

describe('nextBankingDay', () => {
	it('should return the next banking day for a regular weekday', () => {
		assert.equal(
			dayjs('2024-01-02').nextBankingDay().format('YYYY-MM-DD'),
			'2024-01-03',
		)
	})

	it('should return the next banking day for a Friday', () => {
		assert.equal(
			dayjs('2024-01-05').nextBankingDay().format('YYYY-MM-DD'),
			'2024-01-08',
		)
	})

	it('should return the next banking day for a Saturday', () => {
		assert.equal(
			dayjs('2024-01-06').nextBankingDay().format('YYYY-MM-DD'),
			'2024-01-08',
		)
	})

	it('should return the next banking day for a Sunday', () => {
		assert.equal(
			dayjs('2024-01-07').nextBankingDay().format('YYYY-MM-DD'),
			'2024-01-08',
		)
	})

	it("should return the next banking day for New Year's Day", () => {
		assert.equal(
			dayjs('2024-01-01').nextBankingDay().format('YYYY-MM-DD'),
			'2024-01-02',
		)
	})

	it('should return the next banking day for a floating holiday', () => {
		assert.equal(
			dayjs('2038-05-28').nextBankingDay().format('YYYY-MM-DD'),
			'2038-06-01',
		)
	})
})

describe('previousBankingDay', () => {
	it('should return the previous banking day for a regular weekday', () => {
		assert.equal(
			dayjs('2024-01-03').previousBankingDay().format('YYYY-MM-DD'),
			'2024-01-02',
		)
	})

	it('should return the previous banking day for a Monday', () => {
		assert.equal(
			dayjs('2024-01-08').previousBankingDay().format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it('should return the previous banking day for a Saturday', () => {
		assert.equal(
			dayjs('2024-01-06').previousBankingDay().format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it('should return the previous banking day for a Sunday', () => {
		assert.equal(
			dayjs('2024-01-07').previousBankingDay().format('YYYY-MM-DD'),
			'2024-01-05',
		)
	})

	it("should return the previous banking day for New Year's Day", () => {
		assert.equal(
			dayjs('2024-01-01').previousBankingDay().format('YYYY-MM-DD'),
			'2023-12-29',
		)
	})

	it('should return the previous banking day for a floating holiday', () => {
		assert.equal(
			dayjs('2038-06-01').previousBankingDay().format('YYYY-MM-DD'),
			'2038-05-28',
		)
	})
})
