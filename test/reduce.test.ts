import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { setTimeout as delay } from 'node:timers/promises';
import {
	createEmptyIterableObject,
	createIterableObject,
	createMixedAsyncIterableObject,
	emptyAsyncGenerator,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.reduce()', () => {
	describe('array', () => {
		it('should reduce the iterable to a single value', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(10);
		});

		it('should reduce the iterable to a single value with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(20);
		});

		it('should return zero if the iterable is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(0);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.reduce('foo' as any, 0)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should reduce the iterable to a single value without an initial value', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.reduce((acc, item) => acc ? acc + item : item)).toBe(10);
		});

		it('should reduce the iterable to a single value with a transformer and without an initial value', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.reduce((acc, item) => acc ? acc + item : item)).toBe(20);
		});

		it('should throw an error if the iterable is empty and no initial value is provided', () => {
			const iter = new ExtendedIterable([]);
			expect(() => iter.reduce((_acc, item) => item)).toThrowError(new TypeError('Reduce of empty iterable with no initial value'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.reduce((acc, item) => {
					if (item === 2) {
						throw new Error('error');
					}
					return acc + item;
				});
			}).toThrowError(new Error('error'));
		});

		it('should propagate error in transformer function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3], value => {
					if (value === 2) {
						throw new Error('error');
					}
					return value * 2;
				});
				iter.reduce((acc, item) => acc + item);
			}).toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.reduce(async (acc, item) => {
				await delay(10);
				return acc + item;
			}, 0)).toEqual(6);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.map(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});
	});

	describe('iterable', () => {
		it('should reduce the iterable to a single value', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(10);
		});

		it('should reduce the iterable to a single value with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), item => item * 2);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(20);
		});

		it('should return zero if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(0);
		});
	});

	describe('iterable object', () => {
		it('should reduce the iterable to a single value', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(6);
		});

		it('should reduce the iterable to a single value with a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject(), item => item * 2);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(12);
		});

		it('should return zero if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(0);
		});

		it('should reduce a mixed async and sync iterable to a single value', async () => {
			const iter = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(15);
		});
	});

	describe('generator function', () => {
		it('should reduce the iterable to a single value', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(6);
		});

		it('should reduce the iterable to a single value with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.reduce((acc, item) => acc + item, 0)).toBe(12);
		});
	});

	describe('async generator function', () => {
		it('should reduce the iterable to a single value', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(6);
		});

		it('should reduce the iterable to a single value with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(12);
		});

		it('should reduce the iterable to a single value without an initial value', async () => {
			const iter = new ExtendedIterable<number>(simpleAsyncGenerator);
			expect(await iter.reduce((acc, item) => acc ? acc + item : item)).toBe(6);
		});

		it('should reduce the iterable to a single value with a transformer and without an initial value', async () => {
			const iter = new ExtendedIterable<number>(simpleAsyncGenerator, item => item * 2);
			expect(await iter.reduce((acc, item) => acc ? acc + item : item)).toBe(12);
		});

		it('should reduce the iterable to a single value without an initial value', async () => {
			const iter = new ExtendedIterable<number>(emptyAsyncGenerator);
			await expect(iter.reduce((acc, item) => acc ? acc + item : item)).rejects.toThrowError(new TypeError('Reduce of empty iterable with no initial value'));
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.reduce(async (acc, item) => {
					if (item === 2) {
						throw new Error('error');
					}
					return acc + item;
				}, 0);
			}).rejects.toThrowError(new Error('error'));
		});

		it('should propagate error in transformer function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator, value => {
					if (value === 2) {
						throw new Error('error');
					}
					return value * 2;
				});
				await iter.reduce(async (acc, item) => acc + item, 0);
			}).rejects.toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.reduce(async (acc, item) => {
				await delay(10);
				return acc + item;
			}, 0)).toEqual(6);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.reduce(async (_acc, _item) => {
					throw new Error('error');
				}, 0);
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
