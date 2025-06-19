import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.flatMap()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should flatten an iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should flatten an iterable with async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(async item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an iterable that didn\'t need flattening', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(item => item)[Symbol.iterator]();
						expect(flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return empty iterable if the callback returns an empty iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(() => [])[Symbol.iterator]();
						expect(flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should propagate error in callback function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(() => {
							throw new Error('error');
						})[Symbol.iterator]();
						expect(() => flatMapIter.next()).toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(async () => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(flatMapIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.flatMap('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should end iterator on return()', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(flatMapIter.next()).toEqual({ value: 1, done: false });
						assert(flatMapIter.return);
						expect(flatMapIter.return()).toEqual({ value: undefined, done: true });
						expect(flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable if the iterable is empty', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(() => flatMapIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(() => flatMapIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should flatten an async iterable', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(async item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should flatten an async iterable with async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(async item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return an iterable that didn\'t need flattening', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable(data);
						const flatMapIter = iter.flatMap(item => item)[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should propagate error in callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(() => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(flatMapIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(async () => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(flatMapIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should end async iterator on return()', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.asyncIterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						assert(flatMapIter.return);
						expect(await flatMapIter.return()).toEqual({ value: undefined, done: true });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty iterable if the iterable is empty', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an iterable with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						await expect(flatMapIter.next()).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should iterate over a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 2, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 3, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 4, done: false });
						expect(await flatMapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should throw an error if the partial iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncPartialNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						const flatMapIter = iter.flatMap(item => [item, item])[Symbol.iterator]();
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						expect(await flatMapIter.next()).toEqual({ value: 1, done: false });
						await expect(flatMapIter.next()).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}
	}
});
