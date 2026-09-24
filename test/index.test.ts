import { describe, expect, it } from 'vitest'
import { map } from '../src/index'

interface Person {
	id: number
	b: string
	name: string
	gender: string
	family: string
	mosquitoBites: number
	nullableField: string | null
}

const testData: Person[] = [
	{ id: 1, b: 'Something', name: 'Steve', gender: 'male', family: 'deer', mosquitoBites: 430, nullableField: null },
	{ id: 2, b: 'Something', name: 'Dave', gender: 'male', family: 'wolf', mosquitoBites: 98, nullableField: 'asdf' },
	{ id: 3, b: 'Something', name: 'Mary', gender: 'female', family: 'deer', mosquitoBites: 254, nullableField: 'asdf' },
	{ id: 4, b: 'Something', name: 'Margaret', gender: 'female', family: 'wolf', mosquitoBites: 178, nullableField: '' },
]

describe('map', () => {
	it('returns an empty array when mapping null', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = map(null as any, () => 'unused')
		expect(result).toEqual([])
	})

	it('returns an empty array when mapping undefined', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = map(undefined as any, () => 'unused')
		expect(result).toEqual([])
	})

	it('returns an empty array when mapping a number', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = map(1 as any, () => 'unused')
		expect(result).toEqual([])
	})

	it('returns an empty array when mapping a boolean', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = map(true as any, () => 'unused')
		expect(result).toEqual([])
	})

	it('maps over a string literal by character', () => {
		const result = map('hello world', (_key, value) => value)
		expect(result).toEqual(['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'])
	})

	it('maps over a String object by character', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = map(new String('hello world') as any, (_key, value) => value)
		expect(result).toEqual(['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'])
	})

	it('maps over an array, returning the values unchanged', () => {
		const result = map(testData, (_key, value) => value)
		expect(result).toEqual(testData)
	})

	it('maps over an array, returning transformed values', () => {
		const result = map(testData, (_key, value) => value.name)
		expect(result).toEqual(['Steve', 'Dave', 'Mary', 'Margaret'])
	})

	it('maps over an object, returning the values', () => {
		const result = map({ a: 1, b: 2 }, (_key, value) => value)
		expect(result).toEqual([1, 2])
	})

	it('maps over an object, passing the key to the callback', () => {
		const result = map({ a: 1, b: 2 }, (key) => key)
		expect(result).toEqual(['a', 'b'])
	})

	it('keeps null returns in the result when squash is not set', () => {
		const result = map(testData, () => null)
		expect(result).toEqual([null, null, null, null])
	})

	it('removes null returns from the result when squash is true', () => {
		const result = map(testData, () => null, true)
		expect(result).toEqual([])
	})

	it('removes undefined returns from the result when squash is true', () => {
		const result = map(testData, () => undefined, true)
		expect(result).toEqual([])
	})

	it('keeps falsy-but-defined returns (0) when squash is true', () => {
		const result = map(testData, () => 0, true)
		expect(result).toEqual([0, 0, 0, 0])
	})

	it('keeps falsy-but-defined returns (false) when squash is true', () => {
		const result = map(testData, () => false, true)
		expect(result).toEqual([false, false, false, false])
	})

	it('supports emitting multiple values per iteration via emit()', () => {
		const result = map([1, 2, 3], (_key, value, emit) => {
			emit(value)
			emit(value * 10)
		}, true)
		expect(result).toEqual([1, 10, 2, 20, 3, 30])
	})

	it('stops iterating early when end() is called', () => {
		const result = map([1, 2, 3, 4, 5], (_key, value, _emit, end) => {
			if (value === 3) {
				end()
				return
			}

			return value
		}, true)
		expect(result).toEqual([1, 2])
	})
})
