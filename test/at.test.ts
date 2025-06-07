import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import {
	createIterableObject,
	createMixedAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.at()', () => {
	describe('array', () => {
		it('should return an item at a specific index of an array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index of an array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			expect(iter.at(2)).toEqual(6);
		});

		it('should return undefined if index out of range', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.at(2)).toBeUndefined;
		});

		it('should throw an error if the index is not a number', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.at('foo' as any)).toThrowError(new TypeError('index is not a number'));
		});

		it('should throw an error if the index is negative', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.at(-1)).toThrowError(new RangeError('index must be a positive number'));
		});
	});

	describe('iterable', () => {
		it('should return an item at a specific index of an iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index of an iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			expect(iter.at(2)).toEqual(6);
		});

		it('should return undefined if index out of range', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.at(2)).toBeUndefined;
		});
	});

	describe('iterable object', () => {
		it('should return an item at a specific index from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.at(2)).toEqual(2);
		});

		it('should return a transformed item at a specific index from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.at(2)).toEqual(4);
		});

		it('should return undefined if index out of range from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.at(4)).toBeUndefined;
		});

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.at(4)).toEqual(4);
		});
	});

	describe('generator function', () => {
		it('should return an item at a specific index from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.at(2)).toEqual(6);
		});

		it('should return undefined if index out of range', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.at(6)).toBeUndefined;
		});
	});

	describe('async generator function', () => {
		it('should return an item at a specific index from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.at(2)).toEqual(6);
		});

		it('should return undefined if index out of range', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.at(6)).toBeUndefined;
		});
	});
});
