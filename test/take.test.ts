import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, hasAsyncTestData, hasSyncTests, testMatrix } from './lib/util.js';

describe('.take()', () => {
	for (const [name, testData] of Object.entries(testMatrix)) {
		if (hasSyncTests(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an iterable that takes the first `limit` items', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 1 });
						expect(takeIter.next()).toEqual({ done: false, value: 2 });
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an iterable that takes the first `limit` items with a transformer', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data, (value) => value * 2);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 2 });
						expect(takeIter.next()).toEqual({ done: false, value: 4 });
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an iterable that takes the first `limit` items with an async transformer', async () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data, async (value) => value * 2);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: false, value: 4 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an empty iterable if limit is 0', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(0)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return entire iterable if limit is greater than the length of the array', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(5)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 1 });
						expect(takeIter.next()).toEqual({ done: false, value: 2 });
						expect(takeIter.next()).toEqual({ done: false, value: 3 });
						expect(takeIter.next()).toEqual({ done: false, value: 4 });
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should error if the transformer throws an error', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data, () => {
							throw new Error('test');
						});
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(() => takeIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the async transformer throws an error', async () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data, async () => {
							throw new Error('test');
						});
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the limit is not a number', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data);
						expect(() => iter.take('foo' as any)).toThrowError(new TypeError('Limit is not a number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the limit is negative', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iter = new ExtendedIterable(data);
						expect(() => iter.take(-1)).toThrowError(new RangeError('Limit must be a positive number'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable', () => {
						assert(testData.syncEmptyData);
						const data = testData.syncEmptyData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						assert(testData.syncNextThrows);
						const data = testData.syncNextThrows();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(() => takeIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error with async transformer', () => {
						assert(testData.syncNextThrows);
						const data = testData.syncNextThrows();
						const iter = new ExtendedIterable(data, async (value) => value * 2);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(() => takeIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						assert(testData.syncNextThrows);
						const data = testData.syncNextThrows(2);
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(3)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 1 });
						expect(() => takeIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the iterator next() throws an error at a specific index with async transformer', async () => {
						assert(testData.syncNextThrows);
						const data = testData.syncNextThrows(2);
						const iter = new ExtendedIterable(data, async (value) => value * 2);
						const takeIter = iter.take(3)[Symbol.iterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						await expect(takeIter.next()).rejects.toThrow(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an iterable that takes the first `limit` items', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an iterable that takes the first `limit` items with a transformer', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data, value => value * 2);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: false, value: 4 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an iterable that takes the first `limit` items with an async transformer', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data, async (value) => value * 2);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: false, value: 4 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an empty iterable if the limit is 0', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(0)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return entire iterable if limit is greater than the length of the array', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(5)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: false, value: 3 });
						expect(await takeIter.next()).toEqual({ done: false, value: 4 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should reject if the transformer throws an error', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data, () => {
							throw new Error('test');
						});
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the async transformer throws an error', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iter = new ExtendedIterable(data, async () => {
							throw new Error('test');
						});
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty iterable', async () => {
						assert(testData.asyncEmptyData);
						const data = testData.asyncEmptyData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an iterable with mixed async and sync values', async () => {
						assert(testData.asyncMixedData);
						const data = testData.asyncMixedData();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						assert(testData.asyncNextThrows);
						const data = testData.asyncNextThrows();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the iterator next() throws an error at a specific index', async () => {
						assert(testData.asyncNextThrows);
						const data = testData.asyncNextThrows(2);
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(3)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should reject if the transformer throws an error', async () => {
						assert(testData.asyncPartialData);
						const data = testData.asyncPartialData();
						const iter = new ExtendedIterable(data, () => {
							throw new Error('test');
						});
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the partial iterator next() throws an error', async () => {
						assert(testData.asyncPartialNextThrows);
						const data = testData.asyncPartialNextThrows();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						await expect(takeIter.next()).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
