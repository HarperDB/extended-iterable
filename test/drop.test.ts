import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import {
	createAsyncIterableObject,
	createEmptyIterableObject,
	createIterableObject,
	createMixedAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.drop()', () => {
	describe('array', () => {
		it('should return an iterable skipping the first `count` items', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(2).asArray).toEqual([3, 4]);
		});

		it('should drop nothing if the count is 0', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(0).asArray).toEqual([1, 2, 3, 4]);
		});

		it('should return a transformed array skipping the first `count` items', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6, 8]);
		});

		it('should return an empty iterable if the count is greater than the length of the array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.drop(5).asArray).toEqual([]);
		});

		it('should throw an error if the count is not a number', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.drop('foo' as any)).toThrowError(new TypeError('Count is not a number'));
		});

		it('should throw an error if the count is negative', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.drop(-1)).toThrowError(new RangeError('Count must be a positive number'));
		});

		it('should call return() on source iterable', () => {
			const arr = [1, 2, 3, 4];
			const arrIter = arr[Symbol.iterator]();
			let returned = 0;
			arrIter.return = () => {
				returned++;
				return { done: true, value: undefined };
			};
			const dropped = new ExtendedIterable(arrIter, value => value * 2).drop(2);
			const iterator = dropped[Symbol.iterator]();
			expect(iterator.next()).toEqual({ done: false, value: 6 });
			expect(iterator.next()).toEqual({ done: false, value: 8 });
			assert(iterator.return);
			const rval = iterator.return();
			expect(rval).toEqual({ done: true, value: undefined });
			expect(returned).toBe(1);
		});

		it('should call return() on source async iterable', async () => {
			const arr = [1, 2, 3, 4];
			const arrIter = arr[Symbol.iterator]();
			let returned = 0;
			arrIter.return = () => {
				returned++;
				return { done: true, value: undefined };
			};
			const dropped = new ExtendedIterable(arrIter, value => value * 2).drop(2);
			const iterator = dropped[Symbol.asyncIterator]();
			expect(await iterator.next()).toEqual({ done: false, value: 6 });
			expect(await iterator.next()).toEqual({ done: false, value: 8 });
			assert(iterator.return);
			const rval = await iterator.return();
			expect(rval).toEqual({ done: true, value: undefined });
			expect(returned).toBe(1);
		});
	});

	describe('iterable', () => {
		it('should return an array skipping the first `count` items', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.drop(2).asArray).toEqual([3, 4]);
		});

		it('should return a transformed array skipping the first `count` items', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6, 8]);
		});

		it('should return an empty array if the count is greater than the length of the array', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.drop(5).asArray).toEqual([]);
		});

		it('should call throw() on source iterable', () => {
			const obj = new Set([1, 2, 3, 4]);
			const iterable = new ExtendedIterable(obj).drop(2);
			const iterator = iterable[Symbol.iterator]();
			expect(iterator.next()).toEqual({ done: false, value: 3 });
			expect(() => {
				assert(iterator.throw);
				iterator.throw(new Error('error'));
			}).toThrowError(new Error('error'));
		});
	});

	describe('iterable object', () => {
		it('should return an array skipping the first `count` items from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.drop(2).asArray).toEqual([2, 3]);
		});

		it('should return a transformed array skipping the first `count` items from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([4, 6]);
		});

		it('should return an empty array if the count is greater than the length of the array from an iterable object', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.drop(5).asArray).toEqual([]);
		});

		it('should return an iterable with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.drop(2).asArray).toEqual([2, 3, 4, 5]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.drop(2).asArray).toEqual([]);
		});

		it('should call throw() on source iterable', () => {
			const obj = createIterableObject();
			const iterable = new ExtendedIterable(obj).drop(2);
			const iterator = iterable[Symbol.iterator]();
			expect(iterator.next()).toEqual({ done: false, value: 2 });
			expect(iterator.next()).toEqual({ done: false, value: 3 });
			expect(() => {
				assert(iterator.throw);
				iterator.throw(new Error('error'));
			}).toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});

		it('should call throw() on source async iterable', async () => {
			const obj = createAsyncIterableObject();
			const iterable = new ExtendedIterable(obj).drop(2);
			const iterator = iterable[Symbol.asyncIterator]();
			expect(await iterator.next()).toEqual({ done: false, value: 2 });
			expect(await iterator.next()).toEqual({ done: false, value: 3 });
			expect(async () => {
				assert(iterator.throw);
				await iterator.throw(new Error('error'));
			}).rejects.toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});
	});

	describe('generator function', () => {
		it('should return an array skipping the first `count` items from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.drop(2).asArray).toEqual([3]);
		});

		it('should return a transformed array skipping the first `count` items from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.drop(2).asArray).toEqual([6]);
		});

		it('should loop over the iterable', () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleGenerator);
			for (const item of iter.drop(2)) {
				items.push(item);
			}
			expect(items).toEqual([3]);
		});
	});

	describe('async generator function', () => {
		it('should return an array skipping the first `count` items from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.drop(2).asArray).toEqual([3]);
		});

		it('should return a transformed array skipping the first `count` items from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.drop(2).asArray).toEqual([6]);
		});

		it('should async loop over the iterable skipping the first `count` items', async () => {
			const items: number[] = [];
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			for await (const item of iter.drop(2)) {
				items.push(item);
			}
			expect(items).toEqual([3]);
		});
	});
});
