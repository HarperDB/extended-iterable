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

describe('.mapError()', () => {
	describe('array', () => {
		it('should return a mapped iterable with an error', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should return a mapped iterable without an error', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([2, 4, 6]);
		});

		it('should return a iterable without an error', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter.mapError().asArray).toEqual([1, 2, 3]);
		});

		it('should return a iterable with a transformer and without an error', () => {
			const iter = new ExtendedIterable([1, 2, 3], item => item * 2);
			expect(iter.mapError().asArray).toEqual([2, 4, 6]);
		});

		it('should return a mapped iterable with an error and a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3], item => item * 2);
			expect(iter
				.map(item => {
					if (item === 4) {
						throw new Error('error');
					}
					return item;
				})
				.mapError(error => error)
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should return an empty iterable if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([]);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(() => iter.map(item => item * 2).mapError(123 as any)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should return a mapped iterable with an error without a callback', () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError()
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(
				await iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(async error => {
					await delay(10);
					return error;
				})
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should propagate error in transformer function', () => {
			const iter = new ExtendedIterable([1, 2, 3], value => {
				if (value === 2) {
					throw new Error('error');
				}
				return value * 2;
			});
			expect(iter
				.map(item => item)
				.mapError()
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});
	});

	describe('iterable', () => {
		it('should return a mapped iterable with an error', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should return a mapped iterable without an error', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([2, 4, 6]);
		});

		it('should return a mapped iterable with an error and a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]));
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should return an empty iterable if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([]);
		});

		it('should return a iterable with a transformer and without an error', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3]), item => item * 2);
			expect(iter.mapError().asArray).toEqual([2, 4, 6]);
		});
	});

	describe('iterable object', () => {
		it('should return a mapped iterable with an error', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([0, 2, new Error('error'), 6]);
		});

		it('should return a mapped iterable without an error', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([0, 2, 4, 6]);
		});

		it('should return a mapped iterable with an error and a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([0, 2, new Error('error'), 6]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter
				.map(() => {
					throw new Error('error');
				})
				.mapError(error => error)
				.asArray
			).toEqual([]);
		});

		it('should return a iterable with a transformer and without an error', () => {
			const iter = new ExtendedIterable(createIterableObject(), item => item * 2);
			expect(iter.mapError().asArray).toEqual([0, 2, 4, 6]);
		});

		it('should return an iterabel from a mixed sync and async iterable', async () => {
			const iter = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iter.mapError().asArray).toEqual([0, 1, 2, 3, 4, 5]);
		});
	});

	describe('generator function', () => {
		it('should return a mapped iterable with an error', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should return a mapped iterable without an error', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([2, 4, 6]);
		});

		it('should return a iterable with a transformer and without an error', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.mapError().asArray).toEqual([2, 4, 6]);
		});

		it('should loop over the iterable', () => {
			const items: (number | Error)[] = [];
			const iter = new ExtendedIterable<number>(simpleGenerator)
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error);
			for (const item of iter) {
				items.push(item);
			}
			expect(items).toEqual([2, new Error('error'), 6]);
		});
	});

	describe('async generator function', () => {
		it('should return a mapped iterable with an error', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter
				.map(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(error => error)
				.asArray
			).toEqual([2, new Error('error'), 6]);
		});

		it('should return a mapped iterable without an error', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter
				.map(item => item * 2)
				.mapError(error => error)
				.asArray
			).toEqual([2, 4, 6]);
		});

		it('should return a iterable with a transformer and without an error', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.mapError().asArray).toEqual([2, 4, 6]);
		});

		it('should reject if the transformer throws an error', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, () => {
				throw new Error('test');
			});
			expect(await iter.mapError().asArray).toEqual([new Error('test'), new Error('test'), new Error('test')]);
		});

		it('should async loop over the iterable', async () => {
			const items: (number | Error)[] = [];
			const iter = new ExtendedIterable<number>(simpleAsyncGenerator)
				.map(async item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item * 2;
				})
				.mapError(async error => error);
			for await (const item of iter) {
				items.push(item);
			}
			expect(items).toEqual([2, new Error('error'), 6]);
		});
	});
});
