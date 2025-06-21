[![license](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
[![npm version](https://img.shields.io/npm/v/@harperdb/extended-iterable.svg?style=flat-square)](https://www.npmjs.org/package/@harperdb/extended-iterable)
[![npm downloads](https://img.shields.io/npm/dw/@harperdb/extended-iterable)](https://www.npmjs.org/package/@harperdb/extended-iterable)

An iterable with array-like methods with lazy evaluation, both sync and async
iteration, and support for sync and async callbacks.

* [Example](#Example)
* [API](#api)
  * [`new ExtendedIterable()`](#new-extendediterableiterator)
    * [`asArray`](#asarray)
    * [`at()`](#atindex)
    * [`concat()`](#concatother)
    * [`drop()`](#dropcount)
    * [`every()`](#everycallback)
    * [`filter()`](#filtercallback)
    * [`find()`](#findcallback)
    * [`flatMap()`](#flatmapucallback)
    * [`map()`](#mapcallback)
    * [`mapError()`](#maperrorcatchcallback)
    * [`reduce()`](#reduceucallback-initialvalue)
    * [`slice()`](#slicestart-end)
    * [`some()`](#somecallback)
    * [`take()`](#takelimit)
* [Types](#types)
* [License](#license)

# Example

`ExtendedIterable` accepts any iterator, iterable, or generator:

```typescript
import ExtendedIterable from 'extended-iterable';

const extendedIterable = new ExtendedIterable([1, 2, 3]);
for (const value of extendedIterable) {
	console.log(value);
}
```

You can chain methods together:

```typescript
const listing = fs.readdirSync('.', { withFileTypes: true });
const directories = new ExtendedIterable(listing)
	.filter(file => file.isDirectory())
	.map(file => file.name);
for (const dir of directories) {
	console.log(dir);
}
```

To convert the results to an array:

```typescript
// sync only
const arr = Array.from(extendedIterable);

// both sync and async
const arr2 = await extendedIterable.asArray;
```

An async iterator with an async callback:

```typescript
import { readdir, readFile } from 'node:fs/promises';

async function* getDirectoryListing() {
	const entries = await readdir('.', { withFileTypes: true });
	for (const entry of entries) {
		yield entry;
	}
}

const sourceFiles = new ExtendedIterable(getDirectoryListing)
	.filter(file => file.isFile() && file.name.endsWith('.js'))
	.map(async file => ({
		name: file.name,
		contents: await readFile(file.name, 'utf-8')
	}));
for await (const src of sourceFiles) {
	console.log(`${src.name} is ${src.contents.length} bytes`);
}
```

## API

### Constuctor

#### `new ExtendedIterable<T>(iterator)`

Creates an iterable from an array-like object, iterator, async iterator,
iterable, generator, or async generator.

##### Parameters

* `iterator`: [`IterableLike<T>`](#iterablelike) - An array-like object,
  iterator, async iterator, iterable, generator or async generator.

##### Example

```typescript
// array
new ExtendedIterable([1, 2, 3])

// string
new ExtendedIterable('Hello World!');

// Set
new ExtendedIterable(new Set([1, 2, 3]));

// iterable object
new ExtendedIterable({
	index: 0,
	next() {
		if (this.index > 3) {
			return { done: true, value: undefined };
		}
		return { done: false, value: this.index++ };
	}
});

// generator
new ExtendedIterable(function* () {
	yield 1;
	yield 2;
	yield 3;
});

// async generator
new ExtendedIterable(async function* () {
	yield 1;
	yield 2;
	yield 3;
});
```

The `ExtendedIterable` is a generic class and the data type can be explicitly
specified:

```typescript
new ExtendedIterable([1, 2, 3]);
```

### Methods

#### `.asArray`

##### Return value

* `Array<T>` | `Promise<Array<T>>` - An array or a promise that resolves an
  array.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const arr = iterator.asArray;
```

If the iterator is async or any array-like functions have an async callback,
it will return a promise.

```typescript
const iter = new ExtendedIterable(async function* () {
	yield 1;
	yield 2;
	yield 3;
});
const arr = await iter.map(async value => value).asArray;
```

#### `.at(index)`

Returns the item or a promise that resolves an item at the given index. If the
index is less than 0, an error is thrown. If the index is greater than the
number of items in the iterator, `undefined` is returned.

##### Parameters

* `index`: `number` - The index of the item to return.

##### Return value

* `T | Promise<T> | undefined | Promise<undefined>` - The item at the
  specified index. Value

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const value = iterator.at(2); // 3
```

#### `.concat(other)`

Concatenates the iterable with another iterable.

##### Parameters

* `iterator`: [`IterableLike<T>`](#iterablelike) - An array-like object,
  iterator, async iterator, iterable, generator or async generator.

##### Return value

* `ExtendedIterable<T>` The concatenated iterable.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const concatenated = iterator.concat([4, 5, 6]);
console.log(concatenated.asArray); // [1, 2, 3, 4, 5, 6]
```

#### `.drop(count)`

Returns a new iterable skipping the first `count` items.

##### Parameters

* `count: number` - The number of items to skip.

##### Return value

* `ExtendedIterable<T>` - The new iterable.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3, 4]).drop(2);
console.log(iterator.asArray); // [3, 4]
```

#### `.every(callback)`

Returns `true` if the callback returns `true` for every item of the iterable.

##### Parameters

* `callback: (value: T, index: number) => boolean | Promise<boolean>` - The
  callback function to call for each result.

##### Return value

* `boolean | Promise<boolean>` - Returns or resolves `true` if the callback
  returns `true` for every item of the iterable.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const isAllValid = iterator.every(item => item > 0);
```

Async callbacks are supported, but you must await the iterator:

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const isAllValid = await iterator.every(async item => item > 0);
```

#### `.filter(callback)`

Returns a new iterable containing only the values for which the callback
returns `true`.

##### Parameters

* `callback: (value: T, index: number) => boolean | Promise<boolean>` - The
  callback function to call for each result.

##### Return value

* `ExtendedIterable<T>` - The new iterable.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const evenIterator = iterator.filter((item) => {
	return item % 2 === 0;
});
console.log(evenIterator.asArray); // [2]
```

#### `.find(callback)`

Returns the first item of the iterable for which the callback returns `true`.

##### Parameters

* `callback`: `(value: T, index: number) => boolean | Promise<boolean>` - The
  callback function to call for each result.

##### Return value

* `T | Promise<T> | undefined | Promise<undefined>` - The first item of the
  iterable for which the callback returns  `true`, or `undefined` if no such
  item is found.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const found = iterator.find(item => item === 2);
```

#### `.flatMap<U>(callback)`

Returns a new iterable with the flattened results of a callback function.

##### Parameters

* `callback`: `(value: T, index: number) => U | U[] | Iterable<U> | Promise<U | U[] | Iterable<U>>` -
  The callback function to call for each result.

##### Return value

* `ExtendedIterable<U>` - The new iterable with the values flattened.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const flattened = iterator.flatMap(item => [item, item]);
console.log(flattened.asArray); // [1, 1, 2, 2, 3, 3]
```

#### `.forEach(callback)`

Calls a function for each item of the iterable.

##### Parameters

* `callback`: `(value: T, index: number) => boolean | Promise<boolean>` - The
  callback function to call for each result.

##### Return value

* `void | Promise<void>` - Returns nothing or a promise that resolves nothing.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
iterator.forEach(item => console.log(item)); // 1, 2, 3
```

#### `.map(callback)`

Returns a new iterable with the results of calling a callback function.

##### Parameters

* `callback`: `(value: T, index: number) => boolean | Promise<boolean>` - The
  callback function to call for each result.

##### Return value

* `ExtendedIterable<T>` - The new iterable with the mapped values.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const mapped = iterator.map(item => item * 2);
console.log(mapped.asArray); // [2, 4, 6]
```

#### `.mapError(catchCallback)`

Catch errors thrown during iteration and allow iteration to continue. This
method is most useful for methods that return an iterable such as `drop()`,
`filter()`, `flatMap()`, `map()`, `reduce()`, and `take()`.

##### Parameters

* `catchCallback`: `(error: Error) => Error | Promise<Error>` - The callback to
  handle errors. The returned error is logged/handled but iteration continues.

##### Return value

* `ExtendedIterable<T | Error>` - The new iterable.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const mapped = iterator
	.map(item => {
		if (item % 2 === 0) {
			throw new Error('Even');
		}
		return 'odd';
	})
	.mapError();
console.log(mapped.asArray); // ['odd', Error('Even'), 'odd']
```

#### `.reduce<U>(callback, [initialValue])`

Reduces the iterable to a single value.

##### Parameters

* `callback`: `(previousValue: U, currentValue: T, currentIndex: number) => U | Promise<U>` -
  The callback function to call for each result.
* `initialValue`: `U` [optional] - The initial value to use for the accumulator.

##### Return value

* `U | Promise<U>` - Returns or resolves the reduced value.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const sum = iterator.reduce((acc, item) => acc + item, 0);
console.log(sum); // 6
```

#### `.slice([start, [end]])`

Returns a new iterable with the items between the start and end indices. If
`start` or `end` are less than zero, an error is thrown. If `start` is greater
than `end`, an empty iterator is returned.

##### Parameters

* `start`: `number | undefined` [optional] - The index to start at. Defaults to
  `0`, the first item.
* `end`: `number | undefined` [optional] - The index to end at. Defaults to the
  last item.

##### Return value

* `ExtendedIterable<T>` - The new iterable with the sliced range.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3, 4, 5]);
const sliced = iterator.slice(2, 4);
console.log(sliced.asArray); // [3, 4]
```

#### `.some(callback)`

Returns `true` if the callback returns `true` for any item of the iterable.

##### Parameters

* `callback`: `(value: T, index: number) => boolean | Promise<boolean>` - The
  callback function to call for each result.

##### Return value

* `boolean | Promise<boolean>` - `true` if the callback returns `true` for any
  item of the iterable, `false` otherwise.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const hasEven = iterator.some(item => item % 2 === 0);
console.log(hasEven); // true
```

#### `.take(limit)`

Returns a new iterable with the first `limit` items. If `limit` is less than
zero, an error is thrown. If the limit is greater than the number of items in
the iterable, all items are returned.

##### Parameters

* `limit`: `number` - The number of items to take.

##### Return value

* `ExtendedIterable<T>` - The new iterable with the first `limit` items.

##### Example

```typescript
const iterator = new ExtendedIterable([1, 2, 3]);
const taken = iterator.take(2);
console.log(taken.asArray); // [1, 2]
```

#### `ExtendedIterable.from(iterator)`

A static method for convenience that returns an array or a promise that
resolves an array.

##### Parameters

* `iterator`: [`IterableLike<T>`](#iterablelike) - An array-like object,
  iterator, async iterator, iterable, generator or async generator.

##### Return value

* `Array<T> | Promise<Array<T>>` - An array of all items in the iterator.

```typescript
const arr = ExtendedIterable.from(new Set([1, 2, 3]));
console.log(arr); // [1, 2, 3]
```

## Types

### `IterableLike`

Anything that can be iterated. This includes types such as `Map` and `Set` as
well as plain strings.

```typescript
type IterableLike<T> =
	| Iterator<T>
	| AsyncIterator<T>
	| Iterable<T>
	| (() => Generator<T>)
	| (() => AsyncGenerator<T>);
```

This type

## License

This library is licensed under the terms of the MIT license.
