import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { setTimeout as delay } from 'node:timers/promises';
import {
	createEmptyIterableObject,
	createIterableObject,
	createMixedAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.some()', () => {
	describe('array', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.some(item => item > 4)).toBe(false);
		});

		it('should return true if some items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.some(item => item > 10)).toBe(false);
		});

		it('should return false if the iterable is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.some(item => item < 5)).toBe(false);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.some('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.some(item => {
					throw new Error('error');
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
				iter.some(item => false);
			}).toThrowError(new Error('error'));
		});

		it('should return true if some items satisfy the async callback', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.some(async item => {
				await delay(10);
				return true;
			})).toEqual(true);
		});

		it('should return false if any item does not satisfy the async callback', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.some(async item => {
				await delay(10);
				return item > 3;
			})).toEqual(false);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.some(async _item => {
					await delay(10);
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});
	});

	describe('iterable', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.some(item => item > 4)).toBe(false);
		});

		it('should return false if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.some(item => item < 5)).toBe(false);
		});
	});

	describe('iterable object', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.some(item => item > 4)).toBe(false);
		});

		it('should return false if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.some(item => item < 5)).toBe(false);
		});

		it('should return a transformed iterable with mixed async and sync values', async () => {
			const iter = new ExtendedIterable(createMixedAsyncIterableObject(), item => item * 2);
			expect(await iter.some(item => item > 0 && item % 2 === 0)).toBe(true);
		});
	});

	describe('generator function', () => {
		it('should return true if some items satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.some(item => item > 4)).toBe(false);
		});
	});

	describe('async generator function', () => {
		it('should return true if some items satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.some(item => item % 2 === 0)).toBe(true);
		});

		it('should return false if none of the items satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.some(item => item > 4)).toBe(false);
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.some(item => {
					throw new Error('error');
				});
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
				await iter.some(() => false);
			}).rejects.toThrowError(new Error('error'));
		});

		it('should return true if some items satisfy the async callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.some(async item => {
				await delay(10);
				return item > 1;
			})).toEqual(true);
		});

		it('should return false if any item does not satisfy the async callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.some(async item => {
				await delay(10);
				return item > 3;
			})).toEqual(false);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.some(async _item => {
					await delay(10);
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
