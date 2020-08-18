import { readFileSync, readFile } from 'fs';
import { join } from 'path';
import globby from 'globby';
import { Map } from './types';

export const CWD = process.cwd();

/**
 * Gets file paths of files or directories as promise.
 * 
 * @param patterns the patterns for retrieving files.
 * @param type gets only files or directories.
 * @param sync 
 */
export function getPaths(patterns: string | string[], type: 'files' | 'directories', sync: true): string[];

/**
 * Gets file paths of files or directories as promise.
 * 
 * @param patterns the patterns for retrieving files.
 * @param type gets only files or directories.
 */
export function getPaths(patterns: string | string[], type: 'files' | 'directories'): Promise<string[]>;

/**
 * Gets file paths using glob patterns synchronously.
 * 
 * @param patterns the patterns for retrieving files.
 * @param sync enables synchronous get.
 */
export function getPaths(patterns: string | string[], sync: true): string[];

/**
 * Gets file paths using glob patterns as promise.
 * 
 * @param patterns the patterns for retrieving files.
 */
export function getPaths(patterns: string | string[]): Promise<string[]>;

export function getPaths(patterns: string | string[], type?: 'files' | 'directories' | true, sync?: true) {
  const opts: any = {};
  if (typeof type === 'boolean') {
    sync = type as true;
    type = undefined;
  }
  if (type) {
    if (type === 'files')
      opts.onlyFiles = true;
    else
      opts.onlyDirectories = true;
  }
  if (sync)
    return globby.sync(patterns, opts);
  return globby(patterns, opts);
}

/**
 * Loads a JSON configuration and optionally merges a configuration synchronously.
 * 
 * @param path the path to the configuration file.
 * @param mergeWith optional config to merge with.
 * @param sync reads config as sync.
 */
export function readConfig<C extends Map = any, R extends Map = any>(path: string, mergeWith: R, sync: true): C & R;

/**
 * Loads a JSON configuration and optionally merges a configuration using promise.
 * 
 * @param path the path to the configuration file.
 * @param mergeWith optional config to merge with.
 */
export function readConfig<C extends Map = any, R extends Map = any>(path: string, mergeWith: R): C & R;

/**
 * Loads a JSON configuration synchronously.
 * 
 * @param path the path to the configuration file.
 * @param sync reads as sync.
 */
export function readConfig<C extends Map = any>(path: string, sync: true): C;

/**
 * Loads a JSON configuration using promise.
 * 
 * @param path the path to the configuration file.
 */
export function readConfig<C extends Map = any>(path: string): C;

export function readConfig<C extends Map = any, R extends Map = any>(path: string, mergeWith?: R | boolean, sync?: true) {
  if (typeof mergeWith === 'boolean') {
    sync = mergeWith as true;
    mergeWith = undefined;
  }
  if (sync) {
    const config = JSON.parse(readFileSync(path, 'utf-8').toString());
    if (mergeWith)
      return merge(mergeWith as R, config);
    return config;
  }
  return new Promise((res, rej) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err)
        return rej(err);
      let config = JSON.parse(data.toString()) as C;
      if (mergeWith)
        config = merge(mergeWith as R, config) as C & R;
      res(config);
    });
  });
}


/**
 * Reads a template and returns a string synchronously.
 * 
 * @param path the path to the template.
 * @param sync reads as sync.
 */
export function readHtml(path: string, sync: true): string;

/**
 * Reads a template and returns a string by promise.
 * 
 * @param path the path to the template.
 */
export function readHtml(path: string): Promise<string>;

export function readHtml(path: string, sync = false) {
  if (sync)
    return readFileSync(path, 'utf-8').toString();
  return new Promise((res, rej) => {
    readFile(path, 'utf-8', (err, data) => {
      if (err)
        return rej(err);
      res(data.toString());
    });
  });
}

/**
 * Simply joins paths with base path.
 * 
 * @param paths the paths to be mapped.
 * @param basePath the base path to join with if any.
 */
export function joinPaths(paths: string[], basePath = '') {
  return paths.map(p => join(basePath, p));
}

/**
 * Ensures an array is returned.
 * 
 * @param val the value to ensure.
 */
export function ensureArray(val: unknown) {
  if (typeof val === 'undefined')
    return [];
  if (!Array.isArray(val))
    return [val];
  return val;
}

/**
 * Converts file path to namespace.
 * 
 * @param path the path to convert to namespace.  
 */
export function toNamespace(path: string) {
  path = path.replace(/\/$/, '').replace(/^\//, '');
  return path.replace(/(\/|\\)/g, '.');
}

/**
 * Converts namespace to a path.
 * 
 * @param path the namespace to convert to path.
 * @param prefix a prefix to prepend to path if any.
 */
export function fromNamespace(path: string, prefix?: string) {
  path = path.split('.').join('/');
  if (prefix)
    return join(prefix, path);
  return path;
}

/**
 * Promise wrapper that returns an object when used
 * with `await` preventing the need for try/catch.
 * 
 * @example
 * const { err, data } = await promise(Promise);
 * 
 * @param promise the promise to be executed.
 */
export function promise<T = any, E = Error>(promise?: Promise<T>) {
  return promise
    .then(data => ({ err: null, data }))
    .catch(err => ({ err, data: null })) as { err?: E, data?: T; };
}


/**
 * Checks if object has own property.
 * 
 * @param obj the object to inspect.
 * @param prop the property to check for.
 */
export function hasOwn<T>(obj: T, prop: keyof T) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Merges two object.s
 * 
 * @param target the target to be merged.
 * @param source the source to merge from
 * @param defaults whether or not to preserve defaults.
 */
export function mergeBase<T, S>(target: T, source: S, defaults?: boolean | ((targetVal: T[keyof T], sourceVal: S[keyof S]) => any)) {
  let defaultsFunc = (defaults || false) as (targetVal: T[keyof T], sourceVal: S[keyof S]) => any;
  if (typeof defaultsFunc !== 'function')
    defaultsFunc = (t, s) => {
      if (defaults === true && typeof s === 'undefined')
        return t;
      return s;
    };
  target = target || {} as T;
  source = source || {} as S;
  for (const k in source) {
    if (!hasOwn(source, k)) continue;
    const val = source[k];
    if (Array.isArray(val) || typeof val === 'object') {
      if (Array.isArray(val))
        target[k as string] = val as any;
      else
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        target[k as string] = mergeBase(target[k as string], val as any, defaultsFunc) as any;
    }
    else {
      if (defaults)
        target[k as string] = defaultsFunc(target[k as string], val);
      else
        target[k as string] = val as any;
    }
  }
  return target as T & S;
}

/**
 * Merges objects overwriting target from source while
 * adding props from source when missing from target.
 * 
 * @param target the target object
 * @param source1 source 1
 * @param source2 source 2
 * @param source3 source 3
 * @param source4 source 4
 */
export function merge<T, S1, S2, S3, S4>(target: T, source1: S1, source2?: S2, source3?: S3, source4?: S4) {
  target = target || {} as T;
  const sources = [source1, source2, source3, source4,];
  return sources.reduce((a, c) => {
    return mergeBase(a, c);
  }, target) as T & S1 & S2 & S3 & S4;
}

/**
 * Generates a unique ID. 
 * 
 * @param radix the numberic value used to convert to strings.
 */
export function generateUID(radix = 16) {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(radix);
}

/**
 * Breaks array of items into chunks.
 * 
 * @param arr the array to chunkify.
 * @param chunk the chunk size (default: 1000)
 */
export function chunkify<T>(arr: T[], chunk = 1000): T[][] {
  let i;
  let j;
  let tmp;
  const chunks = [];
  for (i = 0, j = arr.length; i < j; i += chunk) {
    tmp = arr.slice(i, i + chunk);
    if (tmp && tmp.length)
      chunks.push(tmp);
  }
  return chunks;
}
/**
 * Simple pluck converting key/object to key/value.
 * 
 * @example
 * The below becomes { some_name: true }
 * {
 *    some_name: {
 *      description: 'some long text description.'
 *      value: true
 *    }
 * }
 * @param obj the object to parse.
 * @param key the nested key to pluck.
 */
export function toKeyValue<T>(obj: Record<keyof T, T[keyof T]>, key: string) {
  return Object.keys(obj).reduce((a, c) => {
    const item = obj[c];
    a[c] = typeof item === 'object' ? item[key] : item;
    return a;
  }, {} as Record<keyof T, any>);
}