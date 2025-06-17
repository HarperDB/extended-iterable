import { BaseIterator } from './base-iterator.js';

export class FilterIterator<T> extends BaseIterator<T> {
	#index = 0;
	#callback: (value: T, index: number) => boolean | Promise<boolean>;

	constructor(
		iterator: Iterator<T> | AsyncIterator<T>,
		callback: (value: T, index: number) => boolean | Promise<boolean>
	) {
		super(iterator);

		if (typeof callback !== 'function') {
			super.throw(new TypeError('Callback is not a function'));
		}

		this.#callback = callback;
	}

	next(): IteratorResult<T> | Promise<IteratorResult<T>> | any {
		debugger;
		let result = super.next();

		// async handling
		if (result instanceof Promise) {
			return this.#asyncFilter(result);
		}

		// sync handling
		while (!result.done) {
			const rval = this.#processResult(result);
			if (rval instanceof Promise) {
				return this.#asyncFilter(rval);
			}
			if (rval) {
				return rval;
			}

			result = super.next();

			// handle sync-to-async transition
			if (result instanceof Promise) {
				return this.#asyncFilter(result);
			}
		}

		return result;
	}

	async #asyncFilter(result: Promise<IteratorResult<T>>): Promise<IteratorResult<T>> {
		let currentResult = await result;

		while (!currentResult.done) {
			const rval = this.#processResult(currentResult);
			if (rval) {
				return rval;
			}
			currentResult = await super.next();
		}

		return currentResult;
	}

	#processResult(result: IteratorYieldResult<T>): IteratorResult<T> | Promise<IteratorResult<T>> | undefined {
		const { value } = result;
		let keep: boolean | Promise<boolean>;
		try {
			keep = this.#callback(value, this.#index++);
		} catch (err) {
			return super.throw(err);
		}

		if (keep instanceof Promise) {
			return keep
				.then(keep => {
					if (keep) {
						return {
							done: false,
							value
						};
					}
					return this.next();
				})
				.catch(err => super.throw(err));
		}

		if (keep) {
			return {
				done: false,
				value
			};
		}
	}
}
