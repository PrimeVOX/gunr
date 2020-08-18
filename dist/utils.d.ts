import { Map } from './types';
export declare const CWD: string;
/**
 * Gets file paths of files or directories as promise.
 *
 * @param patterns the patterns for retrieving files.
 * @param type gets only files or directories.
 * @param sync
 */
export declare function getPaths(patterns: string | string[], type: 'files' | 'directories', sync: true): string[];
/**
 * Gets file paths of files or directories as promise.
 *
 * @param patterns the patterns for retrieving files.
 * @param type gets only files or directories.
 */
export declare function getPaths(patterns: string | string[], type: 'files' | 'directories'): Promise<string[]>;
/**
 * Gets file paths using glob patterns synchronously.
 *
 * @param patterns the patterns for retrieving files.
 * @param sync enables synchronous get.
 */
export declare function getPaths(patterns: string | string[], sync: true): string[];
/**
 * Gets file paths using glob patterns as promise.
 *
 * @param patterns the patterns for retrieving files.
 */
export declare function getPaths(patterns: string | string[]): Promise<string[]>;
/**
 * Loads a JSON configuration and optionally merges a configuration synchronously.
 *
 * @param path the path to the configuration file.
 * @param mergeWith optional config to merge with.
 * @param sync reads config as sync.
 */
export declare function readConfig<C extends Map = any, R extends Map = any>(path: string, mergeWith: R, sync: true): C & R;
/**
 * Loads a JSON configuration and optionally merges a configuration using promise.
 *
 * @param path the path to the configuration file.
 * @param mergeWith optional config to merge with.
 */
export declare function readConfig<C extends Map = any, R extends Map = any>(path: string, mergeWith: R): C & R;
/**
 * Loads a JSON configuration synchronously.
 *
 * @param path the path to the configuration file.
 * @param sync reads as sync.
 */
export declare function readConfig<C extends Map = any>(path: string, sync: true): C;
/**
 * Loads a JSON configuration using promise.
 *
 * @param path the path to the configuration file.
 */
export declare function readConfig<C extends Map = any>(path: string): C;
/**
 * Reads a template and returns a string synchronously.
 *
 * @param path the path to the template.
 * @param sync reads as sync.
 */
export declare function readHtml(path: string, sync: true): string;
/**
 * Reads a template and returns a string by promise.
 *
 * @param path the path to the template.
 */
export declare function readHtml(path: string): Promise<string>;
/**
 * Simply joins paths with base path.
 *
 * @param paths the paths to be mapped.
 * @param basePath the base path to join with if any.
 */
export declare function joinPaths(paths: string[], basePath?: string): string[];
/**
 * Ensures an array is returned.
 *
 * @param val the value to ensure.
 */
export declare function ensureArray(val: unknown): any[];
/**
 * Converts file path to namespace.
 *
 * @param path the path to convert to namespace.
 */
export declare function toNamespace(path: string): string;
/**
 * Converts namespace to a path.
 *
 * @param path the namespace to convert to path.
 * @param prefix a prefix to prepend to path if any.
 */
export declare function fromNamespace(path: string, prefix?: string): string;
/**
 * Promise wrapper that returns an object when used
 * with `await` preventing the need for try/catch.
 *
 * @example
 * const { err, data } = await promise(Promise);
 *
 * @param promise the promise to be executed.
 */
export declare function promise<T = any, E = Error>(promise?: Promise<T>): {
    err?: E;
    data?: T;
};
/**
 * Checks if object has own property.
 *
 * @param obj the object to inspect.
 * @param prop the property to check for.
 */
export declare function hasOwn<T>(obj: T, prop: keyof T): any;
/**
 * Merges two object.s
 *
 * @param target the target to be merged.
 * @param source the source to merge from
 * @param defaults whether or not to preserve defaults.
 */
export declare function mergeBase<T, S>(target: T, source: S, defaults?: boolean | ((targetVal: T[keyof T], sourceVal: S[keyof S]) => any)): T & S;
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
export declare function merge<T, S1, S2, S3, S4>(target: T, source1: S1, source2?: S2, source3?: S3, source4?: S4): T & S1 & S2 & S3 & S4;
/**
 * Generates a unique ID.
 *
 * @param radix the numberic value used to convert to strings.
 */
export declare function generateUID(radix?: number): string;
/**
 * Breaks array of items into chunks.
 *
 * @param arr the array to chunkify.
 * @param chunk the chunk size (default: 1000)
 */
export declare function chunkify<T>(arr: T[], chunk?: number): T[][];
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
export declare function toKeyValue<T>(obj: Record<keyof T, T[keyof T]>, key: string): Record<keyof T, any>;
