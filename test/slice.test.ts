import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.slice()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an iterable with no start or end', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice()[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: false, value: 1 });
						expect(sliceIter.next()).toEqual({ done: false, value: 2 });
						expect(sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(sliceIter.next()).toEqual({ done: false, value: 4 });
						expect(sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an iterable with start, no end', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2)[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(sliceIter.next()).toEqual({ done: false, value: 4 });
						expect(sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an iterable with both start and end', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2, 3)[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an empty iterable if start is greater than the iteratable length', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(5)[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an empty iterable if start is greater than or equal to the end', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(3, 2)[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should throw an error if start is not a number', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.slice('foo' as any)).toThrowError(new TypeError('Start is not a number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if start is negative', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.slice(-1)).toThrowError(new RangeError('Start must be a positive number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if end is not a number', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.slice(2, 'foo' as any)).toThrowError(new TypeError('End is not a number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if end is negative', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.slice(2, -1)).toThrowError(new RangeError('End must be a positive number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should end iterator on return()', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const sliceIter = iter.slice()[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: false, value: 1 });
						assert(sliceIter.return);
						expect(sliceIter.return()).toEqual({ value: undefined, done: true });
						expect(sliceIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable if the iterable is empty', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice()[Symbol.iterator]();
						expect(sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2)[Symbol.iterator]();
						expect(() => sliceIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(3);
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2)[Symbol.iterator]();
						expect(() => sliceIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an iterable with no start or end', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice()[Symbol.iterator]();
						expect(await sliceIter.next()).toEqual({ done: false, value: 1 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 2 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 4 });
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an iterable with start, no end', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2)[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 4 });
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an iterable with both start and end', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2, 3)[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an empty iterable if start is greater than the iteratable length', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(5)[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an empty iterable if start is greater than or equal to the end', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(3, 2)[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 1, 0);
					});

					it('should end async iterator on return()', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const sliceIter = iter.slice()[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: false, value: 1 });
						assert(sliceIter.return);
						expect(await sliceIter.return()).toEqual({ value: undefined, done: true });
						expect(await sliceIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty iterable if the iterable is empty', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice()[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an iterable with a mixed iterable with async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(1)[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: false, value: 2 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 4 });
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2)[Symbol.asyncIterator]();
						await expect(sliceIter.next()).rejects.toThrow('test');
					});
				}

				if (testData.asyncPartialData) {
					it('should return an iterable with a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(1)[Symbol.asyncIterator]();
						expect(await sliceIter.next()).toEqual({ done: false, value: 2 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 3 });
						expect(await sliceIter.next()).toEqual({ done: false, value: 4 });
						expect(await sliceIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iter = new ExtendedIterable(data);
						const sliceIter = iter.slice(2)[Symbol.asyncIterator]();
						await expect(sliceIter.next()).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
