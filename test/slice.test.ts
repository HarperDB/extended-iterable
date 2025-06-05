import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject } from './lib/util.js';

describe('.slice()', () => {
	describe('array', () => {
		it('should return an iterable with no start or end', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.slice().asArray).toEqual([1, 2, 3, 4]);
		});

		it('should return an iterable with start, no end', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.slice(2).asArray).toEqual([3, 4]);
		});

		it('should return an iterable with start and end', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.slice(1, 3).asArray).toEqual([2, 3]);
		});

		it('should return a transformed iterable with start and end', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.slice(1, 3).asArray).toEqual([4, 6]);
		});

		it('should return an empty iterable if array is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.slice().asArray).toEqual([]);
		});

		it('should return an empty iterable if start is greater than array length', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.slice(5).asArray).toEqual([]);
		});

		it('should throw error if start is not a number', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.slice('foo' as any)).toThrowError(new TypeError('Start is not a number'));
		});

		it('should throw error if start is negative', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.slice(-1)).toThrowError(new RangeError('Start must be a positive number'));
		});

		it('should throw error if end is not a number', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.slice(2, 'foo' as any)).toThrowError(new TypeError('End is not a number'));
		});

		it('should throw error if end is negative', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.slice(2, -1)).toThrowError(new RangeError('End must be a positive number'));
		});
	});

	describe('iterable', () => {
		it('should return an iterable with no start or end', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.slice().asArray).toEqual([1, 2, 3, 4]);
		});

		it('should return an iterable with start, no end', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.slice(2).asArray).toEqual([3, 4]);
		});

		it('should return an iterable with start and end', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.slice(1, 3).asArray).toEqual([2, 3]);
		});

		it('should return a transformed iterable with start and end', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), item => item * 2);
			expect(iter.slice(1, 3).asArray).toEqual([4, 6]);
		});

		it('should return an empty iterable if iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.slice().asArray).toEqual([]);
		});

		it('should return an empty iterable if start is greater than iterable length', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.slice(5).asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return an iterable with no start or end', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.slice().asArray).toEqual([0, 1, 2, 3]);
		});

		it('should return an iterable with start, no end', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.slice(2).asArray).toEqual([2, 3]);
		});

		it('should return an iterable with start and end', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.slice(1, 3).asArray).toEqual([1, 2]);
		});

		it('should return a transformed iterable with start and end', () => {
			const iter = new ExtendedIterable(createIterableObject(), item => item * 2);
			expect(iter.slice(1, 3).asArray).toEqual([2, 4]);
		});

		it('should return an empty iterable if iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.slice().asArray).toEqual([]);
		});

		it('should return an empty iterable if start is greater than iterable object length', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.slice(5).asArray).toEqual([]);
		});
	});

	describe('generator function', () => {
		it('should return an iterable with no start or end', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.slice().asArray).toEqual([1, 2, 3]);
		});

		it('should return an iterable with start, no end', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.slice(2).asArray).toEqual([3]);
		});

		it('should return an iterable with start and end', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.slice(1, 3).asArray).toEqual([2, 3]);
		});

		it('should return a transformed iterable with start and end', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.slice(1, 3).asArray).toEqual([4, 6]);
		});
	});

	describe('async generator function', () => {
		it('should return an iterable with no start or end', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.slice().asArray).toEqual([1, 2, 3]);
		});

		it('should return an iterable with start, no end', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.slice(1).asArray).toEqual([2, 3]);
		});

		it('should return an iterable with start and end', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.slice(1, 2).asArray).toEqual([2]);
		});

		it('should return a transformed iterable with start and end', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.slice(1, 2).asArray).toEqual([4]);
		});
	});
});
