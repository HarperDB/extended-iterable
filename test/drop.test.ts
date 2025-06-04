import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterable } from './lib/util.js';

describe('.drop()', () => {
	describe('array', () => {
		it('should return an array with the first `limit` items removed', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(2).asArray).toEqual([3, 4]);
		});

		it('should return a transformed array with the first `limit` items removed', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6, 8]);
		});

		it('should return an empty array if the limit is greater than the length of the array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(5).asArray).toEqual([]);
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
			const iter = new ExtendedIterable(createIterable());
			expect(iter.drop(2).asArray).toEqual([2, 3]);
		});

		it('should return a transformed array with the first `limit` items removed from an iterable object', () => {
			const iter = new ExtendedIterable(createIterable(), (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([4, 6]);
		});

		it('should return an empty array if the limit is greater than the length of the array from an iterable object', () => {
			const iter = new ExtendedIterable(createIterable());
			expect(iter.drop(5).asArray).toEqual([]);
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
	});
});
