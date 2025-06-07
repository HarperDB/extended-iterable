import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import {
	createEmptyIterableObject,
	createIterableObject,
	createMixedAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.drop()', () => {
	describe('array', () => {
		it('should return an iterable with the first `limit` items removed', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(2).asArray).toEqual([3, 4]);
		});

		it('should drop nothing if the limit is 0', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(0).asArray).toEqual([1, 2, 3, 4]);
		});

		it('should return a transformed array with the first `limit` items removed', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6, 8]);
		});

		it('should return an empty iterable if the limit is greater than the length of the array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(5).asArray).toEqual([]);
		});

		it('should throw an error if the limit is not a number', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.drop('foo' as any)).toThrowError(new TypeError('limit is not a number'));
		});

		it('should throw an error if the limit is negative', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.drop(-1)).toThrowError(new RangeError('limit must be a positive number'));
		});
	});

	describe('iterable', () => {
		it('should return an array with the first `limit` items removed', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.drop(2).asArray).toEqual([3, 4]);
		});

		it('should return a transformed array with the first `limit` items removed', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6, 8]);
		});

		it('should return an empty array if the limit is greater than the length of the array', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.drop(5).asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return an array with the first `limit` items removed from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.drop(2).asArray).toEqual([2, 3]);
		});

		it('should return a transformed array with the first `limit` items removed from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([4, 6]);
		});

		it('should return an empty array if the limit is greater than the length of the array from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.drop(5).asArray).toEqual([]);
		});

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.drop(2).asArray).toEqual([2, 3, 4, 5]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.drop(2).asArray).toEqual([]);
		});
	});

	describe('generator function', () => {
		it('should return an array with the first `limit` items removed from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.drop(2).asArray).toEqual([3]);
		});

		it('should return a transformed item at a specific index from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6]);
		});

		it('should loop over the iterable', () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleGenerator);
			for (const item of iter.drop(2)) {
				items.push(item);
			}
			expect(items).toEqual([3]);
		});
	});

	describe('async generator function', () => {
		it('should return an item at a specific index from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.drop(2).asArray).toEqual([3]);
		});

		it('should return a transformed item at a specific index from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.drop(2).asArray).toEqual([6]);
		});

		it('should async loop over the iterable', async () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			for await (const item of iter.drop(2)) {
				items.push(item);
			}
			expect(items).toEqual([3]);
		});
	});
});
