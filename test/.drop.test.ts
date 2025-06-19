import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.drop()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an iterable that skips the first `count` items', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.iterator]();
						expect(dropIter.next()).toEqual({ done: false, value: 3 });
						expect(dropIter.next()).toEqual({ done: false, value: 4 });
						expect(dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an empty iterable if the count is greater than the length of the array', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(5)[Symbol.iterator]();
						expect(dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return entire iterable if skip count is 0', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(0)[Symbol.iterator]();
						expect(dropIter.next()).toEqual({ done: false, value: 1 });
						expect(dropIter.next()).toEqual({ done: false, value: 2 });
						expect(dropIter.next()).toEqual({ done: false, value: 3 });
						expect(dropIter.next()).toEqual({ done: false, value: 4 });
						expect(dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should throw an error if the count is not a number', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.drop('foo' as any)).toThrowError(new TypeError('Count is not a number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the count is negative', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.drop(-1)).toThrowError(new RangeError('Count must be a positive number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should end iterator on return()', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const dropIter = iter.drop(2)[Symbol.iterator]();
						expect(dropIter.next()).toEqual({ done: false, value: 3 });
						assert(dropIter.return);
						expect(dropIter.return()).toEqual({ value: undefined, done: true });
						expect(dropIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.iterator]();
						expect(dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.iterator]();
						expect(() => dropIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(3);
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.iterator]();
						expect(() => dropIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an iterable that skips the first `count` items', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: false, value: 3 });
						expect(await dropIter.next()).toEqual({ done: false, value: 4 });
						expect(await dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an empty iterable if the count is greater than the length of the array', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(5)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return entire iterable if skip count is 0', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(0)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: false, value: 1 });
						expect(await dropIter.next()).toEqual({ done: false, value: 2 });
						expect(await dropIter.next()).toEqual({ done: false, value: 3 });
						expect(await dropIter.next()).toEqual({ done: false, value: 4 });
						expect(await dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should end async iterator on return()', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: false, value: 3 });
						assert(dropIter.return);
						expect(await dropIter.return()).toEqual({ value: undefined, done: true });
						expect(await dropIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty iterable', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an iterable with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: false, value: 3 });
						expect(await dropIter.next()).toEqual({ done: false, value: 4 });
						expect(await dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedThrows) {
					it('should reject if the mixed iterator next() throws an error', async () => {
						const data = testData.asyncMixedThrows!(3);
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						await expect(dropIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						await expect(dropIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncNextThrows!(4);
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: false, value: 3 });
						await expect(dropIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should return an iterable that skips the first `count` items', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						expect(await dropIter.next()).toEqual({ done: false, value: 3 });
						expect(await dropIter.next()).toEqual({ done: false, value: 4 });
						expect(await dropIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iter = new ExtendedIterable(data);
						const dropIter = iter.drop(2)[Symbol.asyncIterator]();
						await expect(dropIter.next()).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
