import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleAsyncGenerator } from './lib/util.js';

describe('ExtendedIterable', () => {
	it('should error if the iterator is invalid', () => {
		expect(() => new ExtendedIterable(undefined as any)).toThrowError(new TypeError('Invalid iterator'));
		expect(() => new ExtendedIterable(123 as any)).toThrowError(new TypeError('Invalid iterator'));
		expect(() => new ExtendedIterable({} as any)).toThrowError(new TypeError('Invalid iterator'));
	});

	it('should error if the transformer is not a function', () => {
		expect(() => new ExtendedIterable([1, 2, 3], 'foo' as any)).toThrowError(new TypeError('Transformer must be a function'));
		expect(() => new ExtendedIterable([1, 2, 3], {} as any)).toThrowError(new TypeError('Transformer must be a function'));
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
		const iter = new ExtendedIterable(simpleAsyncGenerator);
		const result: number[] = [];
		for await (const item of iter) {
			result.push(item);
		}
		expect(result).toEqual([1, 2, 3]);
	});
});
