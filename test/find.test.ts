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

describe('.find()', () => {
	describe('array', () => {
		it('should return the first item that satisfies the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.find(item => item === 2)).toEqual(2);
		});

		it('should return the transformed first item that satisfies the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			expect(iter.find(item => item === 6)).toEqual(6);
		});

		it('should return undefined if no item satisfies the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.find(item => item === 5)).toBeUndefined;
		});

		it('should return undefined if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.find(item => item === 1)).toBeUndefined;
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.find('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.find(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return false;
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
				iter.find(item => item === 3);
			}).toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.find(async item => {
				await delay(10);
				return item > 0;
			})).toEqual(1);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.map(async item => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});
	});

	describe('iterable', () => {
		it('should return the first item that satisfies the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.find(item => item === 2)).toEqual(2);
		});

		it('should return the transformed first item that satisfies the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			expect(iter.find(item => item === 6)).toEqual(6);
		});

		it('should return undefined if no item satisfies the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.find(item => item === 5)).toBeUndefined;
		});

		it('should return undefined if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.find(item => item === 1)).toBeUndefined;
		});
	});

	describe('iterable object', () => {
		it('should return the first item that satisfies the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.find(item => item === 2)).toEqual(2);
		});

		it('should return the transformed first item that satisfies the callback', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.find(item => item === 6)).toEqual(6);
		});

		it('should return undefined if no item satisfies the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.find(item => item === 5)).toBeUndefined;
		});

		it('should return undefined if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.find(item => item === 1)).toBeUndefined;
		});

		it('should return the first item that satisfies the callback in a mixed async and sync iterable', async () => {
			const iter = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iter.find(item => item > 3)).toEqual(4);
		});
	});

	describe('generator function', () => {
		it('should return the first item that satisfies the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.find(item => item === 2)).toEqual(2);
		});

		it('should return the transformed first item that satisfies the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.find(item => item === 6)).toEqual(6);
		});

		it('should return undefined if no item satisfies the callback', () => {
			const iter = new ExtendedIterable<number>(simpleGenerator);
			expect(iter.find(item => item === 5)).toBeUndefined;
		});
	});

	describe('async generator function', () => {
		it('should return the first item that satisfies the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.find(item => item === 2)).toEqual(2);
		});

		it('should return the transformed first item that satisfies the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.find(item => item === 6)).toEqual(6);
		});

		it('should return undefined if no item satisfies the callback', async () => {
			const iter = new ExtendedIterable<number>(simpleAsyncGenerator);
			expect(await iter.find(item => item === 5)).toBeUndefined;
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.find(async item => {
					if (item === 2) {
						throw new Error('error');
					}
					return false;
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
				await iter.find(item => item === 3);
			}).rejects.toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.find(async item => {
				await delay(10);
				return item > 0;
			})).toEqual(1);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.find(async item => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
