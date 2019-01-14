<p align="center">
    <img alt="virtual-file" src="https://raw.githubusercontent.com/composerjs/virtual-file/master/logo.png" width="256">
    <h1 align="center">VirtualFile</h1>
</p>

<p align="center">
  VirtualFile is an object that represents a Buffer and it's metadata. Though this object is comparable to a <a href="https://github.com/gulpjs/vinyl">Vinyl</a> object, the intention is that instances of <code>VirtualFile</code> are truly simple, and flat metadata objects. It does not provide output helpers. It's just metadata and the Buffer content.
</p>

<p align="center">
  <img alt="Typescript 3.2" src="https://img.shields.io/badge/typescript-3.2-blue.svg">
  <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="Node 10.x.x" src="https://img.shields.io/badge/node-10.x.x-blue.svg">
</p>

## Installation

```bash
  npm i -S @composerjs/virtual-file
```

## Usage

```typescript
  import fs from 'fs';
  import { VirtualFile } from '@composerjs/virtual-file';
  
  const file = VirtualFile.Factory({
    path: './package.json',
    content: fs.readFileSync('./package.json'),
    encoding: 'utf8',
    tags: ['npm-package']
  });
  
  console.info(file.toString());  // '{"name":"@composerjs/virtual-file"...
  console.info(file.mediaType);   // 'application/json'
  console.info(file.byteLength)   // 341 
```

## API

### `VirtualFile.Factory({options})`

Constructs a new instance of a `VirtualFile` where an instance represents
a single file. All attributes of a VirtualFile are readonly so once
constructed the properties cannot be changed.

#### `options`

#### `options.path: string` **Required**

Relative or absolute path location of the file.

#### `options.content: Buffer` **Required**

Buffer of the file.

#### `options.encoding: string` **Optional**

Encoding of the buffer.

*Default: __`utf8`__*

#### `options.tags: string[]`

An array of strings useful for adding additional metadata descriptions
to an instance of `VirtualFile`.

---

### Static Methods

#### `VirtualFile.IsVirtualFile(file: VirtualFile): boolean`

Returns true if the provided value is an instance of `VirtualFile`.

---

### Instance Methods

#### `file.toString(): string`

Returns the Buffer as a string. Internally this uses `StringDecoder`, but
only when `encoding` is set to `utf8` or `utf16`

#### `file.toJSON(): object`

Called when an instance of `VirtualFile` has been [`JSON.stringify()`'d][4].
This returns a flat object of picked properties from the instance.
Use `file.toObject()` instead as semantically it's more appropriate.

#### `file.toObject(): object`

Alias of `file.toJSON()`.

#### `file.extend(file: VirtualFile): void`

Extends the instance with values from the provided `VirtualFile`
instance.

#### `file.clone(): VirtualFile`

Returns a clone of the `VirtualFile` instance.

---

### Instance Properties

#### `file.content: Buffer`

`Buffer` representation of the file content.

#### `file.byteLength: number`

Alias of `this.content.byteLength`. Returns the Buffer size in bytes.

*Example: `341`*

#### `file.encoding: string `

file encoding `string`

*Example: `utf8`, `utf16`, `buffer`*

#### `file.tags: string[]`

An array of strings useful for adding additional context about the file
the instance of `VirtualFile` is representing.

At the moment tags are just an array of strings to provide additional
context for the file.

*Example: `['package-json']`*

#### `file.path: string`

Complete file path supplied via constructor.

*Example: `dir/file.txt`*

#### `file.name: string`

Name of the file via via [`path.parse()`][2].

If path is a URL `name` will be a SLD i.e. `google` in `google.com`

*Example: `file`*

#### `file.isURL: boolean`

If the provided path is a valid URL this will be true.

*Default: __`false`__*

#### `file.ext: string`

File extension via [`path.parse()`][2].

If path is a URL `ext` will be TLD i.e. `.com` in `google.com`

*Example: `.txt`*

#### `file.absolute: string`

Absolute path via [`path.resolve()`][3].

*Example: `/home/user/dir/file.txt`*

#### `file.dir: string`

Directory of file via [`path.parse()`][2]

*Example: `/home/user/dir`*

#### `file.base: string`

Base name of file via [`path.parse()`][2]

*Example: `file.txt`*

#### `file.root: string`

Root path via [`path.parse()`][2]

*Example: `/`*

#### `file.mediaType: string | undefined`

[Media Type][1] (formerly called Mime Type) of the file.

This value may not be set.

*Example: `application/json`*

#### `file.contentType: string | undefined`

The `Content-Type` entity header value used in HTTP transactions.

This value may not be set.

*Example: `application/json`*

#### [`[Symbol.toStringTag]: string`][5]

Set by default in all instances. Calls to `Object.prototype.toString.call(file)` for
instances of `VirtualFile` will return the constant string value.

*Default: __`VirtualFile`__*

#### [`nodejs.util.inspect.custom: string`][6]
Comparable to `[Symbol.toStringTag]` this symbol is used by node's
`util.inspect`.

---

## Changelog
* `1.0.0` - initial release
* `1.0.2` - added documentation

## Roadmap
* virtual file collections
  * leveraging tags to create virtual groupings of VirtualFiles

[1]: https://www.iana.org/assignments/media-types/media-types.xhtml
[2]: https://nodejs.org/docs/latest-v10.x/api/path.html#path_path_parse_path
[3]: https://nodejs.org/docs/latest-v10.x/api/path.html#path_path_resolve_paths
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
[6]: https://nodejs.org/docs/latest-v10.x/api/util.html#util_custom_promisified_functions
