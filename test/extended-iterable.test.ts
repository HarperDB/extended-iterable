import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { simpleAsyncGenerator } from './lib/util.js';

describe('ExtendedIterable', () => {
	it('should error if the iterator is invalid', () => {
		expect(() => new ExtendedIterable(undefined as any)).toThrowError(new TypeError('Argument is not iterable'));
		expect(() => new ExtendedIterable(123 as any)).toThrowError(new TypeError('Argument is not iterable'));
		expect(() => new ExtendedIterable({} as any)).toThrowError(new TypeError('Argument is not iterable'));
	});

	it('should loop through the iterator', () => {
		const iter = new ExtendedIterable([1, 2, 3]);
		const result: number[] = [];
		for (const item of iter) {
			result.push(item);
		}
		expect(result).toEqual([1, 2, 3]);
	});

	it('should loop through the async iterator', async () => {
		const iter = new ExtendedIterable(simpleAsyncGenerator());
		const result: number[] = [];
		for await (const item of iter) {
			result.push(item as number);
		}
		expect(result).toEqual([1, 2, 3, 4]);
	});
});
