import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.at()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an item at a specific index', () => {
						const data = testData.syncData!();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if index out of range of empty iterator', () => {
						const data = testData.syncData!();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});

					it('should throw an error if the index is not a number', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.at('foo' as any)).toThrowError(new TypeError('index is not a number'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the index is negative', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.at(-1)).toThrowError(new RangeError('index must be a positive number'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return undefined if index out of range of empty iterator', () => {
						const data = testData.syncEmptyData!();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iterator = new ExtendedIterable(data);
						expect(() => iterator.at(2)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iterator = new ExtendedIterable(data);
						expect(() => iterator.at(2)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncPartialData) {
					it('should return an item at a specific index', () => {
						const data = testData.syncPartialData!();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(2)).toEqual(3);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an item at a specific index', async () => {
						const data = testData.asyncData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if index out of range', async () => {
						const data = testData.asyncData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return undefined if index out of range of empty iterator', async () => {
						const data = testData.asyncEmptyData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an item at a specific index', async () => {
						const data = testData.asyncMixedData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iterator = new ExtendedIterable(data);
						await expect(iterator.at(2)).rejects.toThrow('test');
					});
				}

				if (testData.asyncPartialData) {
					it('should return an item at a specific index', async () => {
						const data = testData.asyncPartialData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if index out of range of empty iterator', async () => {
						const data = testData.asyncPartialData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iterator = new ExtendedIterable(data);
						await expect(iterator.at(2)).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
