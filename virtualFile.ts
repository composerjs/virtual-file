import { parse, resolve } from 'path';
import { URL } from 'url';
import { NodeStringDecoder, StringDecoder } from 'string_decoder';
import getFileType from 'file-type';
import isSVG from 'is-svg';
import mime from 'mime-types';

const inspect = Symbol.for('nodejs.util.inspect.custom');

export const VIRTUAL_FILE_TAG = 'VirtualFile';

interface VirtualFileFactoryParams {
  path: string;
  content: Buffer;
  encoding?: string;
  tags?: string[];
}

interface VirtualFileToObject {
  path: string;
  content: string;
  encoding?: string;
  ext: string;
  name: string;
  isURL: boolean;
  absolute?: string;
  dir?: string;
  base?: string;
  root?: string;
  tags?: string[];
  mediaType?: string;
  contentType?: string;
}

interface VirtualFileClone  {
  path: string;
  content: Buffer;
  encoding?: string;
  ext: string;
  name: string;
  isURL: boolean;
  absolute?: string;
  dir?: string;
  base?: string;
  root?: string;
  tags?: string[];
  mediaType?: string;
  contentType?: string;
}

export class VirtualFile {
  private readonly decoder?: NodeStringDecoder;
  readonly content: Buffer;
  readonly path: string;
  readonly name: string;
  readonly isURL: boolean;
  readonly absolute?: string;
  readonly dir?: string;
  readonly base?: string;
  readonly root?: string;
  readonly encoding?: string;
  readonly tags?: string[];
  readonly ext: string;
  readonly mediaType?: string;
  readonly contentType?: string;
  readonly [Symbol.toStringTag] = VIRTUAL_FILE_TAG;
  protected constructor(path: string, content: Buffer, encoding?: string, tags?: string[]) {
    let isURL = false;
    try { new URL(path); isURL = true; } catch {}
    const {name, ext, dir, base, root} = parse(path);
		let fileType = getFileType(content);
		let mediaType = mime.lookup(ext);
		let contentType = mime.contentType(ext);

		this.isURL = isURL;
		this.ext = ext;
		this.name = name;
    this.path = path;
    this.content = content;
    this.encoding = encoding;
    this.tags = tags;

    if (!isURL) {
      this.absolute = resolve(path);
      this.dir = dir;
      this.base = base;
      this.root = root;
    }

    // preserve multi-byte characters
    if (encoding && ['utf8', 'utf16'].indexOf(encoding) > -1) {
      this.decoder = new StringDecoder(encoding);
    }
    // check the magic number in the buffer
    if (fileType) {
      this.mediaType = fileType.mime;
      // check if it's an SVG manually
    } else if (isSVG(content)) {
      this.mediaType = 'image/svg+xml';
    } else if (mediaType) {
      // just use the file extensions media type
      this.mediaType = mediaType;
    }
    if (contentType) {
      this.contentType = contentType;
    }
  }
  static Factory({
    path,
    content,
    encoding='utf8',
    tags
  }: VirtualFileFactoryParams): VirtualFile {
    return new VirtualFile(path, content, encoding, tags);
  }
  static IsVirtualFile(file: VirtualFile): boolean {
    return Object.prototype.toString.call(file) === VIRTUAL_FILE_TAG;
  }
  [inspect](): string {
    const {path, mediaType, byteLength} = this;
    const prettyBytes = `${Math.floor(byteLength / 1024)} bytes`;
    return `${VIRTUAL_FILE_TAG} < @${path} | ${mediaType} | ${prettyBytes} >`
  }
  get byteLength(): number {
		return this.content.byteLength;
  }
  toString(): string {
    if (this.decoder) {
      this.decoder.write(this.content);
      return this.decoder.end();
    }
    return this.content.toString();
  }
  toJSON(): VirtualFileToObject {
    const {
      path,
      encoding,
      ext,
      name,
      isURL,
      absolute,
      base,
      dir,
      root,
      tags,
      mediaType,
      contentType
    } = this;
    const content = this.toString();
    return {
      path,
      content,
      encoding,
      ext,
      name,
      isURL,
      absolute,
      base,
      dir,
      root,
      tags,
      mediaType,
      contentType
    };
  }
  toObject(): VirtualFileToObject {
    return this.toJSON();
  }
  extend(file: VirtualFile): void{
    Object.assign(this, file);
  }
  clone(): VirtualFile {
    let cloned = <VirtualFileClone><unknown>this.toJSON();
    cloned.content = Buffer.from(cloned.content);
    return VirtualFile.Factory(<VirtualFileFactoryParams>{...cloned});
  }
}
