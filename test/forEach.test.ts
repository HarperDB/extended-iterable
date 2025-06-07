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

		it('should throw an error if the transformer throws an error', () => {
			const iter = new ExtendedIterable([1, 2, 3], () => {
				throw new Error('test');
			});
			expect(() => iter.forEach(item => item)).toThrowError(new Error('test'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.forEach(item => {
					if (item === 2) {
						throw new Error('error');
					}
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
				iter.forEach(item => item * 2);
			}).toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			const result: number[] = [];
			await iter.forEach(async item => {
				await delay(10);
				result.push(item);
			});
			expect(result).toEqual([1, 2, 3]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.forEach(async () => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
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

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			const result: number[] = [];
			await iterator.forEach(item => result.push(item));
			expect(result).toEqual([0, 1, 2, 3, 4, 5]);
		});

		it('should reject if the transformer throws an error', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject(), item => {
				if (item === 3) {
					throw new Error('test');
				}
				return item;
			});
			await expect(iterator.forEach(item => item)).rejects.toThrow('test');
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

		it('should reject if the transformer throws an error', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => {
				if (value === 3) {
					throw new Error('test');
				}
				return value;
			});
			await expect(iter.forEach(item => item)).rejects.toThrow('test');
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.forEach(item => {
					if (item === 2) {
						throw new Error('error');
					}
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
				await iter.forEach(() => {});
			}).rejects.toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			const result: number[] = [];
			await iter.forEach(async item => {
				await delay(10);
				result.push(item * 2);
			});
			expect(result).toEqual([2, 4, 6]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.forEach(async () => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
