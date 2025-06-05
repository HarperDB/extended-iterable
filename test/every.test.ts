import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createMixedAsyncIterableObject } from './lib/util.js';

describe('.every()', () => {
	describe('array', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.every(item => item < 3)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.every(item => item < 6)).toBe(false);
		});

		it('should return true if the iterable is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.every('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});
	});

	describe('iterable', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.every(item => item < 3)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), item => item * 2);
			expect(iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), item => item * 2);
			expect(iter.every(item => item < 6)).toBe(false);
		});

		it('should return true if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.every(item => item < 5)).toBe(true);
		});
	});

	describe('iterable object', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.every(item => item < 2)).toBe(false);
		});

		it('should return true if all items satisfy the callback with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.every(item => item < 8)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.every(item => item < 4)).toBe(false);
		});
	});

	describe('generator function', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.every(item => item < 2)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.every(item => item < 6)).toBe(false);
		});
	});

	describe('async generator function', () => {
		it('should return true if all items satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.every(item => item < 2)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.every(item => item < 6)).toBe(false);
		});
	});
});
