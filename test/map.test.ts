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

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
				}).asArray;
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
				iter.map(item => item * 2).asArray;
			}).toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.map(async item => {
				await delay(10);
				return item * 2;
			}).asArray).toEqual([2, 4, 6]);
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
		it('should call return() on source iterable', async () => {
			let finished = false;
			const iter = new ExtendedIterable({
				[Symbol.iterator]() {
					let i = 2;
					return {
						next() {
							return {
								value: i++,
								done: i === 6,
							}
						},
						return() {
							finished = true;
						},
						throw() {
							finished = true;
						}
					}
				}
			});
			expect(await iter
				.map(item => {
					return item * 2;
				})
				.asArray
			).toEqual([4, 6, 8]);
			expect(finished).toEqual(true);
		})

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

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.map(item => item * 2).asArray).toEqual([0, 2, 4, 6, 8, 10]);
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

		it('should loop over the iterable', () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleGenerator);
			for (const item of iter.map(item => item * 2)) {
				items.push(item);
			}
			expect(items).toEqual([2, 4, 6]);
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

		it('should async loop over the iterable', async () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			for await (const item of iter.map(item => item * 2)) {
				items.push(item);
			}
			expect(items).toEqual([2, 4, 6]);
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
				}).asArray;
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
				await iter.map(item => item * 2).asArray;
			}).rejects.toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.map(async item => {
				await delay(10);
				return item * 2;
			}).asArray).toEqual([2, 4, 6]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.map(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
