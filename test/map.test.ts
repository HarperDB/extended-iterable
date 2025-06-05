import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject } from './lib/util.js';

describe('.map()', () => {
	describe('array', () => {
		it('should return a mapped iterable', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.map(item => item * 2).asArray).toEqual([2, 4, 6]);
		});

		it('should return a mapped iterable with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3], (value) => value * 2);
			expect(iter.map(item => item * 2).asArray).toEqual([4, 8, 12]);
		});

		it('should return an empty iterable if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.map(item => item * 2).asArray).toEqual([]);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.map('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});
	});

	describe('iterable', () => {
		it('should return a mapped iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter.map(item => item * 2).asArray).toEqual([2, 4, 6]);
		});

		it('should return a mapped iterable with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]), (value) => value * 2);
			expect(iter.map(item => item * 2).asArray).toEqual([4, 8, 12]);
		});

		it('should return an empty iterable if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.map(item => item * 2).asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return a mapped iterable', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.map(item => item * 2).asArray).toEqual([0, 2, 4, 6]);
		});

		it('should return a mapped iterable with a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.map(item => item * 2).asArray).toEqual([0, 4, 8, 12]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.map(item => item * 2).asArray).toEqual([]);
		});
	});

	describe('generator function', () => {
		it('should return a mapped iterable', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.map(item => item * 2).asArray).toEqual([2, 4, 6]);
		});

		it('should return a mapped iterable with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.map(item => item * 2).asArray).toEqual([4, 8, 12]);
		});
	});

	describe('async generator function', () => {
		it('should return a mapped iterable', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.map(item => item * 2).asArray).toEqual([2, 4, 6]);
		});

		it('should return a mapped iterable with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.map(item => item * 2).asArray).toEqual([4, 8, 12]);
		});
	});
});
