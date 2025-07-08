import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, createAsyncIterableObject, createIterableObject, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.concat()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should concatenate an iterable and an array', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: 1, done: false });
						expect(concatIter.next()).toEqual({ value: 2, done: false });
						expect(concatIter.next()).toEqual({ value: 3, done: false });
						expect(concatIter.next()).toEqual({ value: 4, done: false });
						expect(concatIter.next()).toEqual({ value: 5, done: false });
						expect(concatIter.next()).toEqual({ value: 6, done: false });
						expect(concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should error if value to concatenate is not iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.concat(null as any)).toThrowError(new TypeError('Argument is not iterable'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should concatenate an iterable with another iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat(new Set([5, 6]))[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: 1, done: false });
						expect(concatIter.next()).toEqual({ value: 2, done: false });
						expect(concatIter.next()).toEqual({ value: 3, done: false });
						expect(concatIter.next()).toEqual({ value: 4, done: false });
						expect(concatIter.next()).toEqual({ value: 5, done: false });
						expect(concatIter.next()).toEqual({ value: 6, done: false });
						expect(concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should end iterator on return()', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: 1, done: false });
						assert(concatIter.return);
						expect(concatIter.return()).toEqual({ value: undefined, done: true });
						expect(concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});

					it('should end both iterators on return()', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat(createIterableObject())[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: 1, done: false });
						assert(concatIter.return);
						expect(concatIter.return()).toEqual({ value: undefined, done: true });
						expect(concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncEmptyData) {
					it('should concatenate an empty iterable and an array', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: 5, done: false });
						expect(concatIter.next()).toEqual({ value: 6, done: false });
						expect(concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should concatenate an empty iterable and an empty array', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([])[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(() => concatIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(concatIter.next()).toEqual({ value: 1, done: false });
						expect(() => concatIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should concatenate an async iterable with an array', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						expect(await concatIter.next()).toEqual({ value: 2, done: false });
						expect(await concatIter.next()).toEqual({ value: 3, done: false });
						expect(await concatIter.next()).toEqual({ value: 4, done: false });
						expect(await concatIter.next()).toEqual({ value: 5, done: false });
						expect(await concatIter.next()).toEqual({ value: 6, done: false });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should concatenate an async iterable with another async iterable', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat(testData.asyncData!())[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						expect(await concatIter.next()).toEqual({ value: 2, done: false });
						expect(await concatIter.next()).toEqual({ value: 3, done: false });
						expect(await concatIter.next()).toEqual({ value: 4, done: false });
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						expect(await concatIter.next()).toEqual({ value: 2, done: false });
						expect(await concatIter.next()).toEqual({ value: 3, done: false });
						expect(await concatIter.next()).toEqual({ value: 4, done: false });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should end async iterator on return()', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						assert(concatIter.return);
						expect(await concatIter.return()).toEqual({ value: undefined, done: true });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});

					it('should end both async iterators on return()', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat(createAsyncIterableObject())[Symbol.asyncIterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						assert(concatIter.return);
						expect(await concatIter.return()).toEqual({ value: undefined, done: true });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty array', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 5, done: false });
						expect(await concatIter.next()).toEqual({ value: 6, done: false });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an array with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						expect(await concatIter.next()).toEqual({ value: 2, done: false });
						expect(await concatIter.next()).toEqual({ value: 3, done: false });
						expect(await concatIter.next()).toEqual({ value: 4, done: false });
						expect(await concatIter.next()).toEqual({ value: 5, done: false });
						expect(await concatIter.next()).toEqual({ value: 6, done: false });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						await expect(concatIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should reject if the iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncNextThrows!(2);
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						await expect(concatIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should concatenate an iterable and an array', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						expect(await concatIter.next()).toEqual({ value: 2, done: false });
						expect(await concatIter.next()).toEqual({ value: 3, done: false });
						expect(await concatIter.next()).toEqual({ value: 4, done: false });
						expect(await concatIter.next()).toEqual({ value: 5, done: false });
						expect(await concatIter.next()).toEqual({ value: 6, done: false });
						expect(await concatIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!(2);
						const iter = new ExtendedIterable(data);
						const concatIter = iter.concat([5, 6])[Symbol.iterator]();
						expect(await concatIter.next()).toEqual({ value: 1, done: false });
						await expect(concatIter.next()).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}
	}
});
