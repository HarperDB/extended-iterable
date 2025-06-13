/**
 * Creates a generator function that produces the numbers 1, 2, 3.
 *
 * @returns The generator function.
 */
export function* simpleGenerator() {
	yield 1;
	yield 2;
	yield 3;
}

/**
 * Creates an async generator function that produces the numbers 1, 2, 3.
 *
 * @returns The async generator function.
 */
export async function* simpleAsyncGenerator() {
	yield 1;
	yield 2;
	yield 3;
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
 * Creates an iterable object that produces the numbers 0, 1, 2, 3.
 *
 * @returns The iterable object.
 */
export function createIterableObject(): Iterator<number> & {
	index: number;
	returned: boolean;
	thrown: boolean;
} {
	return {
		index: 0,
		returned: false,
		thrown: false,
		next() {
			if (this.index > 3) {
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
		return() {
			this.returned = true;
			return { done: true, value: undefined };
		},
		throw(err) {
			this.thrown = true;
			throw err;
		}
	};
}

/**
 * Creates an async iterable object that produces the numbers 0, 1, 2, 3.
 *
 * @returns The iterable object.
 */
export function createPartialAsyncIterableObject(): AsyncIterator<number> & {
	index: number;
	returned: boolean;
	thrown: boolean;
} {
	return {
		index: 0,
		returned: false,
		thrown: false,
		async next() {
			if (this.index > 3) {
				return {
					done: true,
					value: undefined
				};
			}

			return {
				done: false,
				value: this.index++
			};
		}
	};
}

/**
 * Creates an async iterable object that produces the numbers 0, 1, 2, 3.
 *
 * @returns The iterable object.
 */
export function createAsyncIterableObject(): AsyncIterator<number> & {
	index: number;
	returned: boolean;
	thrown: boolean;
} {
	return {
		index: 0,
		returned: false,
		thrown: false,
		async next() {
			if (this.index > 3) {
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
		async return() {
			this.returned = true;
			return { done: true, value: undefined };
		},
		async throw(err) {
			this.thrown = true;
			throw err;
		}
	};
}

/**
 * Creates an empty iterable object.
 *
 * @returns The empty iterable object.
 */
export function createEmptyIterableObject(): Iterator<number> {
	return {
		next() {
			return { done: true, value: undefined };
		}
	};
}

/**
 * Creates an iterable object that produces the numbers 0, 1, 2, 3, 4, 5.
 *
 * @returns The iterable object.
 */
export function createMixedAsyncIterableObject(): (Iterator<number> | AsyncIterator<number>) & { index: number } {
	return {
		index: 0,
		next(): IteratorResult<number> | Promise<IteratorResult<number>> | any {
			if (this.index > 5) {
				return Promise.resolve({
					done: true,
					value: undefined
				});
			}

			if (this.index % 2 === 0) {
				return {
					done: false,
					value: this.index++
				};
			}

			return Promise.resolve({
				done: false,
				value: this.index++
			});
		}
	};
}
