import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.filter()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return a filtered iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						expect(filterIter.next()).toEqual({ done: false, value: 1 });
						expect(filterIter.next()).toEqual({ done: false, value: 2 });
						expect(filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should return an empty iterable if the callback returns false for all items', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 0)[Symbol.iterator]();
						expect(filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should propagate error in callback function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(() => {
							throw new Error('error');
						})[Symbol.iterator]();
						expect(() => filterIter.next()).toThrowError(new Error('error'));
						assertReturnedThrown(iter, 0, 1);
					});

					it('should return a filtered iterable with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async item => item < 3)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: false, value: 1 });
						expect(await filterIter.next()).toEqual({ done: false, value: 2 });
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should return an empty iterable if the callback returns false for all items with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async item => item < 0)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should propagate error in callback function with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(async () => {
							await iter.filter(async () => {
								throw new Error('error');
							}).asArray;
						}).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(iter, 0, 1);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.filter('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable if the iterable is empty', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 0)[Symbol.iterator]();
						expect(filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						expect(() => filterIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(iter, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						expect(filterIter.next()).toEqual({ done: false, value: 1 });
						expect(() => filterIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(iter, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return a filtered iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						expect(filterIter.next()).toEqual({ done: false, value: 1 });
						expect(filterIter.next()).toEqual({ done: false, value: 2 });
						expect(filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should return an empty iterable if the callback returns false for all items', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 0)[Symbol.iterator]();
						expect(filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should propagate error in callback function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(() => {
							throw new Error('error');
						})[Symbol.iterator]();
						expect(() => filterIter.next()).toThrowError(new Error('error'));
						assertReturnedThrown(iter, 0, 1);
					});

					it('should return a filtered iterable with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async item => item < 3)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: false, value: 1 });
						expect(await filterIter.next()).toEqual({ done: false, value: 2 });
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should return an empty iterable if the callback returns false for all items with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async item => item < 0)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should propagate error in callback function with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async () => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(async () => filterIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(iter, 0, 1);
					});
				}

				if (testData.asyncMixedData) {
					it('should return a filtered iterable with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: false, value: 1 });
						expect(await filterIter.next()).toEqual({ done: false, value: 2 });
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should return a filtered iterable skipping first item with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async item => item > 1 && item < 3)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: false, value: 2 });
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});

					it('should return an empty iterable if the callback returns false for all items with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(async item => item < 0)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: true, value: undefined });
						assertReturnedThrown(iter, 1, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						await expect(async () => filterIter.next()).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(iter, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should loop over a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.filter(item => item < 5).asArray).toEqual([1, 2, 3, 4]);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should throw an error if the partial iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncPartialNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						const filterIter = iter.filter(item => item < 3)[Symbol.iterator]();
						expect(await filterIter.next()).toEqual({ done: false, value: 1 });
						await expect(async () => filterIter.next()).rejects.toThrowError(new Error('test'));
					});
				}
			});
		}
	}
});
