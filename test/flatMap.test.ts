import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import {
	createEmptyIterableObject,
	createIterableObject,
	createMixedAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.flatMap()', () => {
	describe('array', () => {
		it('should return a flattened iterable', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should return a flattened iterable that didn\'t need flattening', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.flatMap(item => item).asArray).toEqual([1, 2, 3]);
		});

		it('should return an empty iterable if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([]);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.flatMap('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.flatMap(item => {
					if (item === 2) {
						throw new Error('error');
					}
				}).asArray;
			}).toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.flatMap(async item => [item, item]).asArray).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.flatMap(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});
	});

	describe('iterable', () => {
		it('should return a flattened iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should return an empty iterable if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return a flattened iterable', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([]);
		});

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.flatMap(item => [item, item]).asArray).toEqual([0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
		});
	});

	describe('generator function', () => {
		it('should return a flattened iterable', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.flatMap(item => [item, item]).asArray).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should loop over the iterable', () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleGenerator);
			for (const item of iter.flatMap(item => [item, item])) {
				items.push(item);
			}
			expect(items).toEqual([1, 1, 2, 2, 3, 3]);
		});
	});

	describe('async generator function', () => {
		it('should return a flattened iterable', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.flatMap(item => [item, item]).asArray).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should async loop over the iterable', async () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			for await (const item of iter.flatMap(item => [item, item])) {
				items.push(item);
			}
			expect(items).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.flatMap(item => {
					if (item === 2) {
						throw new Error('error');
					}
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.flatMap(async item => [item, item]).asArray).toEqual([1, 1, 2, 2, 3, 3]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.flatMap(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
