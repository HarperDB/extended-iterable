import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.toArray()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an array', () => {
						const data = testData.syncData!();
						const iterator = new ExtendedIterable(data);
						expect(iterator.toArray()).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty array', () => {
						const data = testData.syncEmptyData!();
						const iterator = new ExtendedIterable(data);
						expect(iterator.toArray()).toEqual([]);
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iterator = new ExtendedIterable(data);
						expect(() => iterator.toArray()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iterator = new ExtendedIterable(data);
						expect(() => iterator.toArray()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an array', async () => {
						const data = testData.asyncData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.toArray()).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty array', async () => {
						const data = testData.asyncEmptyData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.toArray()).toEqual([]);
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an array with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.toArray()).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iterator = new ExtendedIterable(data);
						await expect(iterator.toArray()).rejects.toThrow('test');
					});
				}

				if (testData.asyncPartialData) {
					it('should return an array', async () => {
						const data = testData.asyncPartialData!();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.toArray()).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iterator = new ExtendedIterable(data);
						await expect(iterator.toArray()).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
