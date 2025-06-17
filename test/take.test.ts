import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.take()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an iterable that takes the first `limit` items', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 1 });
						expect(takeIter.next()).toEqual({ done: false, value: 2 });
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an empty iterable if limit is 0', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(0)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return entire iterable if limit is greater than the length of the array', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(5)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 1 });
						expect(takeIter.next()).toEqual({ done: false, value: 2 });
						expect(takeIter.next()).toEqual({ done: false, value: 3 });
						expect(takeIter.next()).toEqual({ done: false, value: 4 });
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should throw an error if the limit is not a number', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.take('foo' as any)).toThrowError(new TypeError('Limit is not a number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the limit is negative', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.take(-1)).toThrowError(new RangeError('Limit must be a positive number'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.iterator]();
						expect(() => takeIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(3)[Symbol.iterator]();
						expect(takeIter.next()).toEqual({ done: false, value: 1 });
						expect(() => takeIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an iterable that takes the first `limit` items', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an empty iterable if the limit is 0', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(0)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return entire iterable if limit is greater than the length of the array', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(5)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: false, value: 3 });
						expect(await takeIter.next()).toEqual({ done: false, value: 4 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty iterable', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an iterable with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedThrows) {
					it('should reject if the mixed iterator next() throws an error', async () => {
						const data = testData.asyncMixedThrows!(2);
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(4)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncNextThrows!(2);
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(3)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						await expect(takeIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should return an iterable that takes the first `limit` items from a partial iterator', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an iterable that takes all of the items from a partial iterator', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(5)[Symbol.asyncIterator]();
						expect(await takeIter.next()).toEqual({ done: false, value: 1 });
						expect(await takeIter.next()).toEqual({ done: false, value: 2 });
						expect(await takeIter.next()).toEqual({ done: false, value: 3 });
						expect(await takeIter.next()).toEqual({ done: false, value: 4 });
						expect(await takeIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iter = new ExtendedIterable(data);
						const takeIter = iter.take(2)[Symbol.asyncIterator]();
						await expect(takeIter.next()).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
