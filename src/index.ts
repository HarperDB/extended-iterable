export type ValueTransformer<TInput, TOutput> = (value: TInput) => TOutput;

export type IterableKind<T> = Iterator<T> | AsyncIterator<T> | Iterable<T> | (() => Generator<T>) | (() => AsyncGenerator<T>);

const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;
const AsyncGeneratorFunction = Object.getPrototypeOf(async function*(){}).constructor;

function resolveIterator<T>(iterator: IterableKind<T>): Iterator<T> | AsyncIterator<T> {
	if (iterator && typeof iterator[Symbol.iterator] === 'function') { // Iterable
		return iterator[Symbol.iterator]();
	} else if (
		typeof iterator === 'function' &&
		(iterator instanceof GeneratorFunction || iterator instanceof AsyncGeneratorFunction)
	) { // Generator or AsyncGenerator
		return iterator();
	} else if (
		iterator &&
		typeof iterator === 'object' &&
		'next' in iterator &&
		typeof iterator.next === 'function'
	) { // Iterator
		return iterator;
	} else {
		throw new TypeError('Invalid iterator');
	}
}

/**
 * An iterable that provides a rich set of methods for working with ranges of
 * items.
 */
export class ExtendedIterable<T> {
	#iterator: (Iterator<T> | AsyncIterator<T>) & { async?: boolean };
	#transformer?: ValueTransformer<any, T>;

	constructor(
		iterator: IterableKind<T>,
		transformer?: ValueTransformer<any, T>
	) {
		this.#iterator = resolveIterator(iterator);

		if (transformer && typeof transformer !== 'function') {
			throw new TypeError('Transformer must be a function');
		}
		this.#transformer = transformer;
	}

	/**
	 * Returns an iterator in synchronous mode.
	 *
	 * @returns The iterator.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * for (const item of iterator) {
	 *   console.log(item);
	 * }
	 * ```
	 */
	[Symbol.iterator](): Iterator<T> {
		return this.#iterator as Iterator<T>;
	}

	/**
	 * Returns an iterator in asynchronous mode.
	 *
	 * @returns The iterator in async mode.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * for await (const item of iterator) {
	 *   console.log(item);
	 * }
	 * ```
	 */
	[Symbol.asyncIterator](): AsyncIterator<T> {
		this.#iterator.async = true;
		return this.#iterator as AsyncIterator<T>;
	}

	/**
	 * Collects the iterator results in an array and returns it.
	 *
	 * @returns The iterator results as an array.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const array = iterator.asArray;
	 * ```
	 */
	get asArray(): Array<T> | Promise<Array<T>> {
		let rval: Array<T> | undefined;

		const promise = new Promise<Array<T>>(resolve => {
			const iterator = this.#iterator;
			const transformer = this.#transformer;

			const array: T[] = [];
			
			const processResult = (result: IteratorResult<T>) => {
				if (result.done) {
					resolve(rval = array);
				} else {
					const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
					array.push(value);
					next(iterator.next());
				}
			};

			const next = (result: IteratorResult<T> | Promise<IteratorResult<T>>) => {
				if (result instanceof Promise) {
					return result.then(processResult);
				}
				processResult(result);
			};

			next(iterator.next());
		});

		return rval || promise;
	}

	/**
	 * Returns the item at the given index.
	 *
	 * @param index - The index of the item to return.
	 * @returns The item at the given index.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const item = iterator.at(0);
	 * ```
	 */
	at(index: number): T | Promise<T | undefined> | undefined {
		let rval: T | undefined;

		const promise = new Promise<T | undefined>(resolve => {
			const iterator = this.#iterator;
			const transformer = this.#transformer;

			const processResult = (result: IteratorResult<T>) => {
				if (result.done) {
					resolve(undefined);
				} else if (index-- === 0) {
					rval = typeof transformer === 'function' ? transformer(result.value) : result.value
					resolve(rval);
				} else {
					next(iterator.next());
				}
			};

			const next = (result: IteratorResult<T> | Promise<IteratorResult<T>>) => {
				if (result instanceof Promise) {
					return result.then(processResult);
				}
				processResult(result);
			};

			next(iterator.next());
		});

		return rval || promise;
	}

	/**
	 * Concatenates the iterable with another iterable.
	 *
	 * @param other - The iterable to concatenate with.
	 * @returns The concatenated iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const concatenated = iterator.concat([4, 5, 6]);
	 * ```
	 */
	concat(other: IterableKind<T>): ExtendedIterable<T> {
		const iterator = this.#iterator;
		const processResult = this.#processResult;
		const transformResult = this.#processResult.bind(this);

		class ConcatIterator implements Iterator<T>, AsyncIterator<T> {
			#firstIteratorDone = false;
			#secondIterator: Iterator<T> | AsyncIterator<T> | null = null;

			next(): IteratorResult<T> | Promise<IteratorResult<T>> | any {
				// iterate through the original iterator first
				if (!this.#firstIteratorDone) {
					const result = iterator.next();
					if (result instanceof Promise) {
						return result.then((result) => this.#processFirstResult(result));
					}
					return this.#processFirstResult(result);
				}

				// then iterate through the second iterator
				return this.#getNextFromOther();
			}

			#processFirstResult(result: IteratorResult<T>): IteratorResult<T> | Promise<IteratorResult<T>> {
				if (result.done) {
					this.#firstIteratorDone = true;
					this.#secondIterator = resolveIterator(other);
					return this.#getNextFromOther();
				}
				return transformResult(result);
			}

			#getNextFromOther(): IteratorResult<T> | Promise<IteratorResult<T>> {
				if (this.#secondIterator) {
					const result = this.#secondIterator.next();
					if (result instanceof Promise) {
						return result.then(processResult);
					}
					return processResult(result);
				}

				return { value: undefined, done: true };
			}
		}

		return new ExtendedIterable(new ConcatIterator());
	}

	/**
	 * Returns a new iterable with the first `limit` items removed.
	 *
	 * @param limit - The number of items to remove.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const items = iterator.drop(1);
	 * ```
	 */
	drop(limit: number): ExtendedIterable<T> {
		const iterator = this.#iterator;
		const transformResult = this.#processResult.bind(this);

		class DropIterator implements Iterator<T>, AsyncIterator<T> {
			#index = 0;

			next(): IteratorResult<T> | Promise<IteratorResult<T>> | any {
				let result = iterator.next();		

				// async skip		
				if (result instanceof Promise) {
					return this.#asyncSkip(result);
				}

				// sync skip
				while (!result.done && this.#index < limit) {
					this.#index++;
					result = iterator.next() as IteratorResult<T>;
				}
				
				return transformResult(result);
			}

			async #asyncSkip(result: IteratorResult<T> | Promise<IteratorResult<T>>): Promise<IteratorResult<T>> {
				let currentResult = await result;
				while (!currentResult.done && this.#index < limit) {
					this.#index++;
					currentResult = await iterator.next();
				}

				return transformResult(currentResult);
			}
		}

		return new ExtendedIterable(new DropIterator());
	}

	/**
	 * Returns `true` if the callback returns `true` for every item of the
	 * iterable.
	 *
	 * @param callback - The callback function to call for each result.
	 * @returns `true` if the callback returns `true` for every item of the
	 * iterable, `false` otherwise.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const isAllValid = iterator.every(item => item < 5);
	 * ```
	 */
	every(callback: (value: T, index: number) => boolean): boolean {
		const iterator = this.#iterator;
		const transformer = this.#transformer;
		let index = 0;
		let result;
		while ((result = iterator.next()).done !== true) {
			const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
			if (!callback(value, index++)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Returns a new iterable containing only the values for which the callback
	 * returns `true`.
	 *
	 * @param callback - The callback function to call for each result.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const filtered = iterator.filter(item => item < 3);
	 * ```
	 */
	filter(callback: (value: T, index: number) => boolean): ExtendedIterable<T> {
		const iterator = this.#iterator;
		const transformer = this.#transformer;

		class FilterIterator implements Iterator<T> {
			#index = 0;

			next(): IteratorResult<T> {
				let result = iterator.next();

				while (!result.done) {
					const value = typeof transformer === 'function' ? transformer(result.value) : result.value;

					if (callback(value, this.#index++)) {
						return {
							value: value,
							done: false
						};
					}

					result = iterator.next();
				}

				return result;
			}
		}

		return new ExtendedIterable(new FilterIterator());
	}

	/**
	 * Returns the first item of the iterable for which the callback returns
	 * `true`.
	 *
	 * @param callback - The callback function to call for each result.
	 * @returns The first item of the iterable for which the callback returns
	 * `true`, or `undefined` if no such item is found.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const found = iterator.find(item => item === 2);
	 * ```
	 */
	find(callback: (value: T, index: number) => boolean): T | undefined {
		const iterator = this.#iterator;
		const transformer = this.#transformer;
		let index = 0;
		let result;
		while ((result = iterator.next()).done !== true) {
			const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
			if (callback(value, index++)) {
				return value;
			}
		}
		return undefined;
	}

	/**
	 * Returns a new iterable with the results of a callback function, then
	 * flattens the results.
	 *
	 * @param callback - The callback function to call for each result.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const flattened = iterator.flatMap(item => [item, item]);
	 * ```
	 */
	flatMap<U>(callback: (value: T, index: number) => U[] | Iterable<U>): ExtendedIterable<U> {
		const iterator = this.#iterator;
		const transformer = this.#transformer;

		class FlatMapIterator implements Iterator<U> {
			#index = 0;
			#currentSubIterator: Iterator<U> | null = null;
			#mainIteratorDone = false;

			next(): IteratorResult<U> {
				while (true) {
					// If we have a current sub-iterator, try to get the next value from it
					if (this.#currentSubIterator) {
						const subResult = this.#currentSubIterator.next();
						if (!subResult.done) {
							return subResult;
						}
						// Sub-iterator is done, clear it and continue
						this.#currentSubIterator = null;
					}

					// If main iterator is done, we're completely done
					if (this.#mainIteratorDone) {
						return { value: undefined as any, done: true };
					}

					// Get next value from main iterator
					const mainResult = iterator.next();
					if (mainResult.done) {
						this.#mainIteratorDone = true;
						return { value: undefined as any, done: true };
					}

					// Transform the value and apply callback
					const value = typeof transformer === 'function' ? transformer(mainResult.value) : mainResult.value;
					const callbackResult = callback(value, this.#index++);

					// Create sub-iterator from callback result
					if (Array.isArray(callbackResult)) {
						this.#currentSubIterator = callbackResult[Symbol.iterator]();
					} else if (callbackResult && typeof callbackResult[Symbol.iterator] === 'function') {
						this.#currentSubIterator = callbackResult[Symbol.iterator]();
					} else {
						// If callback result is not iterable, skip this iteration
						continue;
					}
				}
			}
		}

		return new ExtendedIterable(new FlatMapIterator());
	}

	/**
	 * Calls a function for each item of the iterable.
	 *
	 * @param callback - The callback function to call for each result.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * iterator.forEach(item => console.log(item));
	 * ```
	 */
	forEach(callback: (value: T, index: number) => void): void {
		const iterator = this.#iterator;
		const transformer = this.#transformer;
		let index = 0;
		let result;
		while ((result = iterator.next()).done !== true) {
			const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
			callback(value, index++);
		}
	}

	/**
	 * Returns a new iterable with the results of calling a callback function.
	 *
	 * @param callback - The callback function to call for each result.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const mapped = iterator.map(item => item * 2);
	 * ```
	 */
	map<U>(callback: (value: T, index: number) => U): ExtendedIterable<U> {
		const iterator = this.#iterator;
		const transformer = this.#transformer;

		class MapIterator implements Iterator<U> {
			#index = 0;

			next(): IteratorResult<U> {
				const result = iterator.next();
				if (result.done) {
					return result;
				}

				const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
				const mappedValue = callback(value, this.#index++);

				return {
					value: mappedValue,
					done: false
				};
			}
		}

		return new ExtendedIterable(new MapIterator());
	}

	/**
	 * Catch errors thrown during iteration and allow iteration to continue.
	 *
	 * @param catchCallback - The callback to handle errors. The returned error is logged/handled but iteration continues.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const mapped = iterator.mapError(error => new Error('Error: ' + error.message));
	 * ```
	 */
	mapError(catchCallback: (error: Error) => Error): ExtendedIterable<T> {
		const iterator = this.#iterator;
		const transformer = this.#transformer;

		class ErrorMappingIterator implements Iterator<T> {
			next(): IteratorResult<T> {
				while (true) {
					try {
						const result = iterator.next();
						if (result.done) {
							return result;
						}

						// apply transformer if present
						const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
						return {
							value: value,
							done: false
						};
					} catch (error) {
						// call the catch callback with the error to allow transformation/logging
						const err = catchCallback(error instanceof Error ? error : new Error(String(error)));
						return {
							value: err as any
						};
					}
				}
			}
		}

		return new ExtendedIterable(new ErrorMappingIterator());
	}

	/**
	 * Reduces the iterable to a single value.
	 *
	 * @param callback - The callback function to call for each result.
	 * @param initialValue - The initial value to use for the accumulator.
	 * @returns The reduced value.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const sum = iterator.reduce((acc, item) => acc + item, 0);
	 * ````
	 */
	reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue: U): U;
	reduce(callback: (previousValue: T, currentValue: T, currentIndex: number) => T): T;
	reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number) => U, initialValue?: U): U {
		const iterator = this.#iterator;
		const transformer = this.#transformer;
		let index = 0;
		let accumulator: U;
		let hasInitialValue = arguments.length >= 2;

		// if no initial value provided, use first element as accumulator
		if (!hasInitialValue) {
			const firstResult = iterator.next();
			if (firstResult.done) {
				throw new TypeError('Reduce of empty iterable with no initial value');
			}
			const firstValue = typeof transformer === 'function' ? transformer(firstResult.value) : firstResult.value;
			accumulator = firstValue as unknown as U;
			index = 1;
		} else {
			accumulator = initialValue!;
		}

		// process remaining elements
		let result;
		while ((result = iterator.next()).done !== true) {
			const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
			accumulator = callback(accumulator, value, index++);
		}

		return accumulator;
	}

	/**
	 * Returns a new iterable with the items between the start and end indices.
	 *
	 * @param start - The index to start at.
	 * @param end - The index to end at.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const sliced = iterator.slice(1, 2);
	 * ```
	 */
	slice(start?: number, end?: number): ExtendedIterable<T> {
		const iterator = this.#iterator;
		const transformer = this.#transformer;

		class SliceIterator implements Iterator<T> {
			#index = 0;
			#startIndex = start ?? 0;
			#endIndex = end;

			next(): IteratorResult<T> {
				// skip elements before start index
				while (this.#index < this.#startIndex) {
					const result = iterator.next();
					if (result.done) {
						return result;
					}
					this.#index++;
				}

				if (this.#endIndex !== undefined && this.#index >= this.#endIndex) {
					return { value: undefined, done: true };
				}

				// get the next element
				const result = iterator.next();
				if (result.done) {
					return result;
				}

				this.#index++;
				const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
				return {
					value: value,
					done: false
				};
			}
		}

		return new ExtendedIterable(new SliceIterator());
	}

	/**
	 * Returns `true` if the callback returns `true` for any item of the
	 * iterable.
	 *
	 * @param callback - The callback function to call for each result.
	 * @returns `true` if the callback returns `true` for any item of the
	 * iterable, `false` otherwise.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const hasEven = iterator.some(item => item % 2 === 0);
	 * ```
	 */
	some(callback: (value: T, index: number) => boolean): boolean {
		const iterator = this.#iterator;
		const transformer = this.#transformer;
		let index = 0;
		let result;
		while ((result = iterator.next()).done !== true) {
			const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
			if (callback(value, index++)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns a new iterable with the first `limit` items.
	 *
	 * @param limit - The number of items to take.
	 * @returns The new iterable.
	 *
	 * @example
	 * ```typescript
	 * const iterator = new ExtendedIterable([1, 2, 3]);
	 * const taken = iterator.take(2);
	 * ```
	 */
	take(limit: number): ExtendedIterable<T> {
		const iterator = this.#iterator;
		const transformer = this.#transformer;

		class TakeIterator implements Iterator<T> {
			#count = 0;

			next(): IteratorResult<T> {
				if (this.#count >= limit) {
					return { value: undefined, done: true };
				}

				const result = iterator.next();
				if (result.done) {
					return result;
				}

				this.#count++;
				const value = typeof transformer === 'function' ? transformer(result.value) : result.value;
				return {
					value: value,
					done: false
				};
			}
		}

		return new ExtendedIterable(new TakeIterator());
	}

	/**
	 * Helper function to process the result of an iterator and apply the
	 * transformer if applicable.
	 *
	 * @param result - The result of an iterator.
	 * @returns The transformed iterator result.
	 */
	#processResult(result: IteratorResult<T>): IteratorResult<T> {
		if (result.done) {
			return result;
		}

		return {
			// note: we need to check if `this` is defined because this
			// function may be called without a this argument
			value: this && typeof this.#transformer === 'function' ? this.#transformer(result.value) : result.value,
			done: false
		};
	}
}

export default ExtendedIterable;
