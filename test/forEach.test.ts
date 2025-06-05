import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject } from './lib/util.js';

describe('.forEach()', () => {
	describe('array', () => {
		it('should iterate over the array', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([1, 2, 3]);
		});

		it('should iterate over the array with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3], (value) => value * 2);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([2, 4, 6]);
		});

		it('should iterate over an empty array', () => {
			const iter = new ExtendedIterable([]);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([]);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.forEach('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});
	});

	describe('iterable', () => {
		it('should iterate over the iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([1, 2, 3]);
		});

		it('should iterate over the iterable with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]), (value) => value * 2);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([2, 4, 6]);
		});

		it('should iterate over an empty iterable', () => {
			const iter = new ExtendedIterable(new Set([]));
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should iterate over the iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([0, 1, 2, 3]);
		});

		it('should iterate over the iterable object with a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([0, 2, 4, 6]);
		});

		it('should iterate over an empty iterable object', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([]);
		});
	});

	describe('generator function', () => {
		it('should iterate over the generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([1, 2, 3]);
		});

		it('should iterate over the generator function with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			const result: number[] = [];
			iter.forEach(item => result.push(item));
			expect(result).toEqual([2, 4, 6]);
		});
	});

	describe('async generator function', () => {
		it('should iterate over the async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			const result: number[] = [];
			await iter.forEach(item => result.push(item));
			expect(result).toEqual([1, 2, 3]);
		});

		it('should iterate over the async generator function with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			const result: number[] = [];
			await iter.forEach(item => result.push(item));
			expect(result).toEqual([2, 4, 6]);
		});
	});
});
