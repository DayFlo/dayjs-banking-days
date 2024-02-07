import assert from 'node:assert'
import { before, describe, test, it } from 'node:test'

import dayjs from 'dayjs'

import bankingDays from '../src'

describe('isBankingDay', () => {
	before(() => {
		dayjs.extend(bankingDays)
	})

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
