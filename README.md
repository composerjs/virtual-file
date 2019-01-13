<p align="center">
    <img alt="virtual-file" src="https://raw.githubusercontent.com/composerjs/virtual-file/master/logo.png" width="256">
    <h1 align="center">Virtual-File</h1>
</p>

<p align="center">
  VirtualFile is an object that represents a Buffer and it's metadata.
  Though this object is comparable to a <a href="https://github.com/gulpjs/vinyl">Vinyl</a>
  object, the intention is that instances of `VirtualFile` are truly simple, and flat metadata
  objects.
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

### Static Methods

#### `VirtualFile.IsVirtualFile(file: VirtualFile): boolean`

Returns true if the provided value is an instance of `VirtualFile`.

```typescript

  import { readFileSync } from 'fs';
  import { VirtualFile } from '@composerjs/virtual-file';
  
  const path = './package.json';
  const content = readFileSync(path);
  const file = VirtualFile.Factory({
    path,
    content
  });
  
  VirtualFile.IsVirtualFile(file);  // true
  VirtualFile.IsVirtualFile({});    // false
  
```

### Instance Methods

#### `file.toString(): string`

Returns the Buffer as a string. Internally this uses `StringDecoder`, but
only when `encoding` is set to `utf8` or `utf16`

```typescript

  import { readFileSync } from 'fs';
  import { VirtualFile } from '@composerjs/virtual-file';
  
  const path = './package.json';
  const content = readFileSync(path);
  const file = VirtualFile.Factory({
    path,
    content
  });
  
```

#### `file.toJSON(): object`

Called when an instance of `VirtualFile` has been `JSON.stringify()`'d.
This returns a flat object of picked properties from the instance.



#### `file.toObject(): object`

Alias of `file.toJSON()`.

```typescript

  import { readFileSync } from 'fs';
  import { VirtualFile } from '@composerjs/virtual-file';
  
  const path = './package.json';
  const content = Buffer.from(`{
    name: 'my-package',
    version: '1.0.0'   
  }`);
  const file = VirtualFile.Factory({
    path,
    content
  });
  
  file.toJSON(); // {  path: './package', content: < Buffer ... >, ext: '.json', mediaType: 'application/json' ...
  
```

#### `file.extend(file: VirtualFile): void`

Extends the instance with property values from the provided instance.

#### `file.clone(): VirtualFile`

returns a new cloned instance of `VirtualFile`

### Instance Properties

#### `file.content: Buffer`

`Buffer` representation of the file contents

#### `file.byteLength: number`

Alias of `this.content.byteLength`. Returns the Buffer size in bytes.

#### `file.encoding: string `

file encoding `string` i.e. `utf8`, `utf16`, `buffer`

#### `file.tags: string[]`

An array of strings useful for adding additional context about the file
the instance of `VirtualFile` is representing.

At the moment tags are just an array of strings to provide additional
context for the file.

#### `file.path: string`

complete file path

#### `file.name: string`

name of the file via [path.parse](https://nodejs.org/docs/latest-v10.x/api/path.html#path_path_parse_path)

#### `file.isURL: boolean`

If the provided path is a valid URL this will be true.

*Default: `false`*

#### `file.ext: string`

file extension via [path.parse](https://nodejs.org/docs/latest-v10.x/api/path.html#path_path_parse_path).
If path is a URL `ext` will be TLD.

#### `file.mediaType: string | undefined`

[Media Type](https://www.iana.org/assignments/media-types/media-types.xhtml) (formerly called Mime Type) of the file.

*Default: `undefined`*

#### `file.contentType: string | undefined`

The `Content-Type` entity header value used in HTTP transactions.
This value may not be set.

#### `[Symbol.toStringTag]: string`

Set by default in all instances. Calls to `Object.prototype.toString.call(file)` for
instances of `VirtualFile` will return the constant string value.

*Default: `VirtualFile`*

#### `nodejs.util.inspect.custom: string`

Comparable to `[Symbol.toStringTag]` this symbol is used by nodes
`util.inspect`.
