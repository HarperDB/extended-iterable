import { expect } from 'vitest';

/**
 * Creates a generator function that produces the numbers 1, 2, 3, 4.
 *
 * @returns The generator function.
 */
export function* simpleGenerator(throwErrors = true) {
	try {
		yield 1;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
	try {
		yield 2;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
	try {
		yield 3;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
	try {
		yield 4;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
}

/**
 * Creates an empty generator function.
 *
 * @returns The empty generator function.
 */
export function* emptyGenerator() {
}

/**
 * Creates an async generator function that produces the numbers 1, 2, 3.
 *
 * @returns The async generator function.
 */
export async function* simpleAsyncGenerator(throwErrors = true) {
	try {
		yield 1;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
	try {
		yield 2;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
	try {
		yield 3;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
	try {
		yield 4;
	} catch (err) {
		if (throwErrors) {
			throw err;
		}
		yield err;
	}
}

/**
 * Creates an empty async generator function.
 *
 * @returns The empty async generator function.
 */
// eslint-disable-next-line require-yield
export async function* emptyAsyncGenerator() {
}

/**
 * Creates an iterable object that produces the numbers 1, 2, 3, 4.
 *
 * @returns The iterable object.
 */
export function createIterableObject({
	count = 4,
	partial = false,
	throwOnValue = -1
}: {
	count?: number;
	partial?: boolean;
	throwOnValue?: number;
} = {}): Iterator<number> & Iterable<number> & {
	index: number;
	returned: number;
	thrown: number;
} {
	if (partial) {
		return {
			index: 1,
			returned: 0,
			thrown: 0,
			[Symbol.iterator]() {
				return this;
			},
			next() {
				const value = this.index++;

				if (value === throwOnValue) {
					throw new Error('test');
				}

				if (this.index > count) {
					return {
						done: true,
						value: undefined
					};
				}

				return {
					done: false,
					value
				};
			}
		};
	}

	return {
		index: 1,
		returned: 0,
		thrown: 0,
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const value = this.index++;

			if (value === throwOnValue) {
				throw new Error('test');
			}

			if (value > count) {
				return {
					done: true,
					value: undefined
				};
			}

			return {
				done: false,
				value
			};
		},
		return(value) {
			this.returned++;
			return { done: true, value };
		},
		throw(err) {
			this.thrown++;
			throw err;
		}
	};
}

/**
 * Creates an empty iterable object.
 *
 * @returns The empty iterable object.
 */
export function createEmptyIterableObject(): Iterator<number> & Iterable<number> {
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			return { done: true, value: undefined };
		}
	};
}

/**
 * Creates an async iterable object that produces the numbers 1, 2, 3, 4.
 *
 * @returns The iterable object.
 */
export function createPartialAsyncIterableObject(throwOnValue = -1): AsyncIterator<number> & AsyncIterable<number> & {
	index: number;
} {
	return {
		index: 1,
		[Symbol.asyncIterator]() {
			return this;
		},
		async next() {
			const value = this.index++;

			if (value === throwOnValue) {
				throw new Error('test');
			}

			if (value > 4) {
				return {
					done: true,
					value: undefined
				};
			}

			return {
				done: false,
				value
			};
		}
	};
}

/**
 * Creates an async iterable object that produces the numbers 1, 2, 3, 4.
 *
 * @returns The iterable object.
 */
export function createAsyncIterableObject(): AsyncIterator<number> & AsyncIterable<number> & {
	index: number;
	returned: number;
	thrown: number;
} {
	return {
		index: 1,
		returned: 0,
		thrown: 0,
		[Symbol.asyncIterator]() {
			return this;
		},
		async next() {
			if (this.index > 4) {
				return {
					done: true,
					value: undefined
				};
			}

			return {
				done: false,
				value: this.index++
			};
		},
		async return(value) {
			this.returned++;
			return { done: true, value };
		},
		async throw(err) {
			this.thrown++;
			throw err;
		}
	};
}

/**
 * Creates an async iterable object that throws an error.
 *
 * @returns The async iterable object.
 */
export function createAsyncIterableObjectNextThrows(throwOnValue = 1): AsyncIterator<number> & AsyncIterable<number> & {
	index: number;
	returned: number;
	thrown: number;
} {
	return {
		index: 1,
		returned: 0,
		thrown: 0,
		[Symbol.asyncIterator]() {
			return this;
		},
		async next() {
			const value = this.index++;

			if (value === throwOnValue) {
				throw new Error('test');
			}

			if (value > 4) {
				return {
					done: true,
					value: undefined
				};
			}

			return {
				done: false,
				value
			};
		},
		async return(value) {
			this.returned++;
			return { done: true, value };
		},
		async throw(err) {
			this.thrown++;
			throw err;
		}
	};
}

/**
 * Creates an iterable object that produces the numbers 1, 2, 3, 4.
 *
 * @returns The iterable object.
 */
export function createMixedAsyncIterableObject(throwOnValue = -1): (Iterator<number> & Iterable<number> & {
	index: number;
	returned: number;
	thrown: number;
}) {
	return {
		index: 1,
		returned: 0,
		thrown: 0,
		[Symbol.iterator]() {
			return this;
		},
		next(): IteratorResult<number> | Promise<IteratorResult<number>> | any {
			const value = this.index++;

			if (value > 4) {
				return Promise.resolve({
					done: true,
					value: undefined
				});
			}

			if (value % 2 === 1) {
				if (value === throwOnValue) {
					throw new Error('test');
				}
				return {
					done: false,
					value
				};
			}

			if (value === throwOnValue) {
				return Promise.reject(new Error('test'));
			}
			return Promise.resolve({
				done: false,
				value
			});
		},
		return(value) {
			this.returned++;
			return { done: true, value };
		},
		throw(err) {
			this.thrown++;
			throw err;
		}
	};
}

/**
 * Asserts that the returned and thrown properties of the data object are equal to the expected values.
 *
 * @param data - The data object to assert.
 * @param returned - The expected returned value.
 * @param thrown - The expected thrown value.
 */
export function assertReturnedThrown(data: any, returned: number, thrown: number) {
	if (Object.hasOwn(data, 'returned')) {
		expect(data.returned).toBe(returned);
	}
	if (Object.hasOwn(data, 'thrown')) {
		expect(data.thrown).toBe(thrown);
	}
}

/**
 * The matrix of test data.
 */
export const dataMatrix: Record<string, {
	asyncData?: (throwErrors?: boolean) => any;
	asyncEmptyData?: () => any;
	asyncMixedData?: () => (Iterator<number> | AsyncIterator<number>) & {
		index: number;
		returned: number;
		thrown: number;
	};
	asyncMixedThrows?: (throwOnValue?: number) => (Iterator<number> | AsyncIterator<number>) & {
		index: number;
		returned: number;
		thrown: number;
	};
	asyncNextThrows?: (throwOnValue?: number) => any;
	asyncPartialData?: () => any;
	asyncPartialNextThrows?: (throwOnValue?: number) => any;
	syncData?: (throwErrors?: boolean) => any;
	syncEmptyData?: () => any;
	syncNextThrows?: (throwOnValue?: number) => any;
	syncPartialData?: () => any;
}> = {
	'iterable object': {
		asyncData: () => createAsyncIterableObject(),
		asyncEmptyData: () => createEmptyIterableObject(),
		asyncMixedData: () => createMixedAsyncIterableObject(),
		asyncMixedThrows: (throwOnValue = 1) => createMixedAsyncIterableObject(throwOnValue),
		asyncNextThrows: (throwOnValue = 1) => createAsyncIterableObjectNextThrows(throwOnValue),
		asyncPartialData: () => createPartialAsyncIterableObject(),
		asyncPartialNextThrows: (throwOnValue = 1) => createPartialAsyncIterableObject(throwOnValue),
		syncData: () => createIterableObject(),
		syncEmptyData: () => createIterableObject({ count: 0 }),
		syncNextThrows: (throwOnValue = 1) => createIterableObject({ throwOnValue }),
		syncPartialData: () => createIterableObject({ partial: true })
	},
	'array': {
		syncData: () => [1, 2, 3, 4],
		syncEmptyData: () => []
	},
	'generator function': {
		asyncData: (throwErrors = true) => simpleAsyncGenerator(throwErrors),
		asyncEmptyData: () => emptyAsyncGenerator,
		syncData: (throwErrors = true) => simpleGenerator(throwErrors),
		syncEmptyData: () => emptyGenerator,
	},
	'iterable': {
		syncData: () => new Set([1, 2, 3, 4]),
		syncEmptyData: () => new Set()
	}
};

export function hasSyncTestData(testData: any) {
	return testData.syncData || testData.syncEmptyData || testData.syncNextThrows || testData.syncPartialData;
}

export function hasAsyncTestData(testData: any) {
	return testData.asyncData || testData.asyncEmptyData || testData.asyncMixedData || testData.asyncMixedThrows || testData.asyncNextThrows || testData.asyncPartialData || testData.asyncPartialNextThrows;
}
