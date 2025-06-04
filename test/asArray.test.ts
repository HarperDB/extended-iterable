import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterable } from './lib/util.js';

describe('.asArray', () => {
	describe('array', () => {
		it('should return an array from an array', () => {
			const iterator = new ExtendedIterable([1, 2, 3]);
			expect(iterator.asArray).toEqual([1, 2, 3]);
		});

		it('should return an array of the transformed values', () => {
			const iterator = new ExtendedIterable([1, 2, 3], (value) => value * 2);
			expect(iterator.asArray).toEqual([2, 4, 6]);
		});

		it('should return an empty array if the iterator is empty', () => {
			const iterator = new ExtendedIterable([]);
			expect(iterator.asArray).toEqual([]);
		});
	});

	describe('iterable', () => {
		it('should return an array from an iterable', () => {
			const iterator = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iterator.asArray).toEqual([1, 2, 3]);
		});

		it('should return an array of the transformed values', () => {
			const iterator = new ExtendedIterable(new Set([1, 2, 3]), (value) => value * 2);
			expect(iterator.asArray).toEqual([2, 4, 6]);
		});

		it('should return an empty array if the iterator is empty', () => {
			const iterator = new ExtendedIterable(new Set([]));
			expect(iterator.asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return an array from an iterable object', () => {
			const iterator = new ExtendedIterable(createIterable());
			expect(iterator.asArray).toEqual([0, 1, 2, 3]);
		});

		it('should return a transformed array from an iterable object', () => {
			const iter = new ExtendedIterable(createIterable(), (value) => value * 2);
			expect(iter.asArray).toEqual([0, 2, 4, 6]);
		});
	});

	describe('generator function', () => {
		it('should return an array from a generator function', () => {
			const iterator = new ExtendedIterable(simpleGenerator);
			expect(iterator.asArray).toEqual([1, 2, 3]);
		});

		it('should return an array of the transformed values', () => {
			const iterator = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iterator.asArray).toEqual([2, 4, 6]);
		});
	});

	describe('async generator function', () => {
		it('should return an array from an async generator function', async () => {
			const iterator = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iterator.asArray).toEqual([1, 2, 3]);
		});

		it('should return an array of the transformed values', async () => {
			const iterator = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iterator.asArray).toEqual([2, 4, 6]);
		});
	});
});
