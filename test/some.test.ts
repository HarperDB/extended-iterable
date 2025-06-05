import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject } from './lib/util.js';

describe('.some()', () => {
	describe('array', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.some(item => item > 4)).toBe(false);
		});

		it('should return false if the iterable is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.some(item => item < 5)).toBe(false);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.some('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});
	});

	describe('iterable', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.some(item => item > 4)).toBe(false);
		});

		it('should return false if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.some(item => item < 5)).toBe(false);
		});
	});

	describe('iterable object', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.some(item => item > 4)).toBe(false);
		});

		it('should return false if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.some(item => item < 5)).toBe(false);
		});
	});

	describe('generator function', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.some(item => item > 4)).toBe(false);
		});
	});

	describe('async generator function', () => {
		it('should return true if some items satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.some(item => item > 4)).toBe(false);
		});
	});
});
