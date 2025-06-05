import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject } from './lib/util.js';

describe('.take()', () => {
	describe('array', () => {
		it('should return an iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.take(2).asArray).toEqual([1, 2]);
		});

		it('should return every item if the limit is greater than the length of the array', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.take(4).asArray).toEqual([1, 2, 3]);
		});

		it('should return a transformed iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable([1, 2, 3], (value) => value * 2);
			expect(iter.take(2).asArray).toEqual([2, 4]);
		});

		it('should return an empty iterable if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.take(2).asArray).toEqual([]);
		});

		it('should throw an error if the limit is not a number', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.take('foo' as any)).toThrowError(new TypeError('limit is not a number'));
		});

		it('should throw an error if the limit is negative', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.take(-1 as any)).toThrowError(new RangeError('limit must be a positive number'));
		});
	});

	describe('iterable', () => {
		it('should return an iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter.take(2).asArray).toEqual([1, 2]);
		});

		it('should return every item if the limit is greater than the length of the iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter.take(4).asArray).toEqual([1, 2, 3]);
		});

		it('should return a transformed iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]), (value) => value * 2);
			expect(iter.take(2).asArray).toEqual([2, 4]);
		});

		it('should return an empty iterable if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.take(2).asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return an iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.take(2).asArray).toEqual([0, 1]);
		});

		it('should return every item if the limit is greater than the length of the iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.take(4).asArray).toEqual([0, 1, 2, 3]);
		});

		it('should return a transformed iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.take(2).asArray).toEqual([0, 2]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.take(2).asArray).toEqual([]);
		});
	});

	describe('generator function', () => {
		it('should return an iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.take(2).asArray).toEqual([1, 2]);
		});

		it('should return every item if the limit is greater than the length of the generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.take(5).asArray).toEqual([1, 2, 3]);
		});

		it('should return a transformed iterable with the first `limit` items', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.take(2).asArray).toEqual([2, 4]);
		});
	});

	describe('async generator function', () => {
		it('should return an iterable with the first `limit` items', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.take(2).asArray).toEqual([1, 2]);
		});

		it('should return every item if the limit is greater than the length of the async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.take(5).asArray).toEqual([1, 2, 3]);
		});

		it('should return a transformed iterable with the first `limit` items', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.take(2).asArray).toEqual([2, 4]);
		});
	});
});