import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import {
	createIterableObject,
	createEmptyIterableObject,
	createMixedAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator,
	createAsyncIterableObject,
} from './lib/util.js';

describe('.filter()', () => {
	describe('array', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an empty iterable if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			const filtered = iter.filter(_item => true);
			expect(filtered.asArray).toEqual([]);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.filter('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.filter(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return true;
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
				iter.filter(_item => true).asArray;
			}).toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(await iter.filter(async item => item < 3).asArray).toEqual([1, 2]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.filter(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});

		it('should call return() on source iterable', () => {
			const filtered = new ExtendedIterable([1, 2, 3]).filter(item => item < 3);
			const iterator = filtered[Symbol.iterator]();
			expect(iterator.next()).toEqual({ done: false, value: 1 });
			expect(iterator.next()).toEqual({ done: false, value: 2 });
			assert(iterator.return);
			const rval = iterator.return();
			expect(rval).toEqual({ done: true, value: undefined });
		});

		it('should call return() on source async iterable', async () => {
			const filtered = new ExtendedIterable([1, 2, 3]).filter(async item => item < 3);
			const iterator = filtered[Symbol.asyncIterator]();
			expect(await iterator.next()).toEqual({ done: false, value: 1 });
			expect(await iterator.next()).toEqual({ done: false, value: 2 });
			assert(iterator.return);
			const rval = await iterator.return();
			expect(rval).toEqual({ done: true, value: undefined });
		});
	});

	describe('iterable', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an empty iterable if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			const filtered = iter.filter(_item => true);
			expect(filtered.asArray).toEqual([]);
		});

		it('should call throw() on source iterable', () => {
			const obj = new Set([1, 2, 3]);
			const filtered = new ExtendedIterable(obj).filter(item => item < 3);
			const iterator = filtered[Symbol.iterator]();
			expect(iterator.next()).toEqual({ done: false, value: 1 });
			expect(() => {
				assert(iterator.throw);
				iterator.throw(new Error('error'));
			}).toThrowError(new Error('error'));
		});
	});

	describe('iterable object', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable(createIterableObject());
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([0, 1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([0, 2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable(createIterableObject());
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			const filtered = iter.filter(_item => true);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.filter(item => item < 4).asArray).toEqual([0, 1, 2, 3]);
		});

		it('should call return() on source iterable', () => {
			const obj = createIterableObject();
			const filtered = new ExtendedIterable(obj).filter(item => item < 3);
			const iterator = filtered[Symbol.iterator]();
			expect(iterator.next()).toEqual({ done: false, value: 0 });
			expect(iterator.next()).toEqual({ done: false, value: 1 });
			assert(iterator.return);
			const rval = iterator.return();
			expect(rval).toEqual({ done: true, value: undefined });
			expect(obj.returned).toBe(1);
		});

		it('should call throw() on source iterable if the callback throws an error', () => {
			const obj = createIterableObject();
			const iterator = new ExtendedIterable(obj);
			expect(() => {
				iterator.filter(() => {
					throw new Error('error');
				}).asArray;
			}).toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});

		it('should call throw() on source iterable if the async callback throws an error', async () => {
			const obj = createIterableObject();
			const iterator = new ExtendedIterable(obj);
			await expect(async () => {
				await iterator.filter(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});

		it('should call throw() on source iterable if the callback throws an error', async () => {
			const obj = createAsyncIterableObject();
			const iterator = new ExtendedIterable(obj);
			await expect(async () => {
				await iterator.filter(() => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});

		it('should call throw() on source iterable if the async callback throws an error', async () => {
			const obj = createAsyncIterableObject();
			const iterator = new ExtendedIterable(obj);
			await expect(async () => {
				await iterator.filter(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});
	});

	describe('generator function', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should loop over the iterable', () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleGenerator);
			for (const item of iter.filter(item => item < 3)) {
				items.push(item);
			}
			expect(items).toEqual([1, 2]);
		});
	});

	describe('async generator function', () => {
		it('should return a filtered iterable', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			const filtered = iter.filter(item => item < 3);
			expect(await filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(await filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			const filtered = iter.filter(item => item < 0);
			expect(await filtered.asArray).toEqual([]);
		});

		it('should async loop over the iterable', async () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			for await (const item of iter.filter(item => item < 3)) {
				items.push(item);
			}
			expect(items).toEqual([1, 2]);
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.filter(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return true;
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
				await iter.filter(() => true).asArray;
			}).rejects.toThrowError(new Error('error'));
		});

		it('should handle async callback function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.filter(async item => item < 3).asArray).toEqual([1, 2]);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.filter(async () => {
					throw new Error('error');
				}).asArray;
			}).rejects.toThrowError(new Error('error'));
		});
	});
});