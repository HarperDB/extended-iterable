import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject, createMixedAsyncIterableObject } from './lib/util.js';

describe('.concat()', () => {
	describe('array', () => {
		it('should concatenate two arrays', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.concat([4, 5, 6]).asArray).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should concatenate two arrays with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3], (value) => value * 2);
			expect(iter.concat([4, 5, 6]).asArray).toEqual([2, 4, 6, 4, 5, 6]);
		});

		it('should concatenate two empty arrays', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.concat([]).asArray).toEqual([]);
		});

		it('should concatenate an empty array and a non-empty array', () => {
			const iter = new ExtendedIterable<number>([]);
			expect(iter.concat([1, 2, 3]).asArray).toEqual([1, 2, 3]);
		});

		it('should error if the source is not iterable-like', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.concat(null as any)).toThrowError(new TypeError('Argument is not iterable'));
		});
	});

	describe('iterable', () => {
		it('should concatenate two iterables', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter.concat(new Set([4, 5, 6])).asArray).toEqual([1, 2, 3, 4, 5, 6]);
		});

		it('should concatenate two iterables with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]), (value) => value * 2);
			expect(iter.concat(new Set([4, 5, 6])).asArray).toEqual([2, 4, 6, 4, 5, 6]);
		});

		it('should concatenate two empty iterables', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.concat(new Set([])).asArray).toEqual([]);
		});

		it('should concatenate an empty iterable and a non-empty iterable', () => {
			const iter = new ExtendedIterable(new Set<number>([]));
			expect(iter.concat(new Set([1, 2, 3])).asArray).toEqual([1, 2, 3]);
		});
	});

	describe('iterable object', () => {
		it('should concatenate two iterable objects', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.concat(createIterableObject()).asArray).toEqual([0, 1, 2, 3, 0, 1, 2, 3]);
		});

		it('should concatenate two iterable objects with a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.concat(createIterableObject()).asArray).toEqual([0, 2, 4, 6, 0, 1, 2, 3]);
		});

		it('should concatenate an empty iterable object and a non-empty iterable object', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.concat(createIterableObject()).asArray).toEqual([0, 1, 2, 3]);
		});

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.concat(createMixedAsyncIterableObject()).asArray).toEqual([0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5]);
		});
	});

	describe('generator function', () => {
		it('should concatenate two generator functions', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.concat(simpleGenerator).asArray).toEqual([1, 2, 3, 1, 2, 3]);
		});

		it('should concatenate a generator function and an array', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.concat([1, 2, 3]).asArray).toEqual([1, 2, 3, 1, 2, 3]);
		});

		it('should concatenate a generator function and an iterable', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.concat(new Set([1, 2, 3])).asArray).toEqual([1, 2, 3, 1, 2, 3]);
		});

		it('should concatenate a generator function and an iterable object', () => {
			const iter = new ExtendedIterable<number>(simpleGenerator);
			expect(iter.concat(createIterableObject()).asArray).toEqual([1, 2, 3, 0, 1, 2, 3]);
		});

		it('should concatenate a generator function and an empty iterable object', () => {
			const iter = new ExtendedIterable<number>(simpleGenerator);
			expect(iter.concat(createEmptyIterableObject()).asArray).toEqual([1, 2, 3]);
		});

		it('should transform a generator function and concatenate it with a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.concat(simpleGenerator).asArray).toEqual([2, 4, 6, 1, 2, 3]);
		});

		it('should loop over the iterable', () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleGenerator);
			for (const item of iter.concat(simpleGenerator)) {
				items.push(item);
			}
			expect(items).toEqual([1, 2, 3, 1, 2, 3]);
		});
	});

	describe('async generator function', () => {
		it('should concatenate two async generator functions', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.concat(simpleAsyncGenerator).asArray).toEqual([1, 2, 3, 1, 2, 3]);
		});

		it('should concatenate an async generator function and an array', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.concat([1, 2, 3]).asArray).toEqual([1, 2, 3, 1, 2, 3]);
		});

		it('should concatenate an async generator function and an iterable', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.concat(new Set([1, 2, 3])).asArray).toEqual([1, 2, 3, 1, 2, 3]);
		});

		it('should concatenate an async generator function and an iterable object', async () => {
			const iter = new ExtendedIterable<number>(simpleAsyncGenerator);
			expect(await iter.concat(createIterableObject()).asArray).toEqual([1, 2, 3, 0, 1, 2, 3]);
		});

		it('should transform an async generator function and concatenate it with an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.concat(simpleAsyncGenerator).asArray).toEqual([2, 4, 6, 1, 2, 3]);
		});

		it('should async loop over the iterable', async () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			for await (const item of iter.concat(simpleAsyncGenerator)) {
				items.push(item);
			}
			expect(items).toEqual([1, 2, 3, 1, 2, 3]);
		});
	});
});
