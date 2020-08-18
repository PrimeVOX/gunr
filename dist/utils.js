"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKeyValue = exports.chunkify = exports.generateUID = exports.merge = exports.mergeBase = exports.hasOwn = exports.promise = exports.fromNamespace = exports.toNamespace = exports.ensureArray = exports.joinPaths = exports.readHtml = exports.readConfig = exports.getPaths = exports.CWD = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const globby_1 = __importDefault(require("globby"));
exports.CWD = process.cwd();
function getPaths(patterns, type, sync) {
    const opts = {};
    if (typeof type === 'boolean') {
        sync = type;
        type = undefined;
    }
    if (type) {
        if (type === 'files')
            opts.onlyFiles = true;
        else
            opts.onlyDirectories = true;
    }
    if (sync)
        return globby_1.default.sync(patterns, opts);
    return globby_1.default(patterns, opts);
}
exports.getPaths = getPaths;
function readConfig(path, mergeWith, sync) {
    if (typeof mergeWith === 'boolean') {
        sync = mergeWith;
        mergeWith = undefined;
    }
    if (sync) {
        const config = JSON.parse(fs_1.readFileSync(path, 'utf-8').toString());
        if (mergeWith)
            return merge(mergeWith, config);
        return config;
    }
    return new Promise((res, rej) => {
        fs_1.readFile(path, 'utf-8', (err, data) => {
            if (err)
                return rej(err);
            let config = JSON.parse(data.toString());
            if (mergeWith)
                config = merge(mergeWith, config);
            res(config);
        });
    });
}
exports.readConfig = readConfig;
function readHtml(path, sync = false) {
    if (sync)
        return fs_1.readFileSync(path, 'utf-8').toString();
    return new Promise((res, rej) => {
        fs_1.readFile(path, 'utf-8', (err, data) => {
            if (err)
                return rej(err);
            res(data.toString());
        });
    });
}
exports.readHtml = readHtml;
/**
 * Simply joins paths with base path.
 *
 * @param paths the paths to be mapped.
 * @param basePath the base path to join with if any.
 */
function joinPaths(paths, basePath = '') {
    return paths.map(p => path_1.join(basePath, p));
}
exports.joinPaths = joinPaths;
/**
 * Ensures an array is returned.
 *
 * @param val the value to ensure.
 */
function ensureArray(val) {
    if (typeof val === 'undefined')
        return [];
    if (!Array.isArray(val))
        return [val];
    return val;
}
exports.ensureArray = ensureArray;
/**
 * Converts file path to namespace.
 *
 * @param path the path to convert to namespace.
 */
function toNamespace(path) {
    path = path.replace(/\/$/, '').replace(/^\//, '');
    return path.replace(/(\/|\\)/g, '.');
}
exports.toNamespace = toNamespace;
/**
 * Converts namespace to a path.
 *
 * @param path the namespace to convert to path.
 * @param prefix a prefix to prepend to path if any.
 */
function fromNamespace(path, prefix) {
    path = path.split('.').join('/');
    if (prefix)
        return path_1.join(prefix, path);
    return path;
}
exports.fromNamespace = fromNamespace;
/**
 * Promise wrapper that returns an object when used
 * with `await` preventing the need for try/catch.
 *
 * @example
 * const { err, data } = await promise(Promise);
 *
 * @param promise the promise to be executed.
 */
function promise(promise) {
    return promise
        .then(data => ({ err: null, data }))
        .catch(err => ({ err, data: null }));
}
exports.promise = promise;
/**
 * Checks if object has own property.
 *
 * @param obj the object to inspect.
 * @param prop the property to check for.
 */
function hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
exports.hasOwn = hasOwn;
/**
 * Merges two object.s
 *
 * @param target the target to be merged.
 * @param source the source to merge from
 * @param defaults whether or not to preserve defaults.
 */
function mergeBase(target, source, defaults) {
    let defaultsFunc = (defaults || false);
    if (typeof defaultsFunc !== 'function')
        defaultsFunc = (t, s) => {
            if (defaults === true && typeof s === 'undefined')
                return t;
            return s;
        };
    target = target || {};
    source = source || {};
    for (const k in source) {
        if (!hasOwn(source, k))
            continue;
        const val = source[k];
        if (Array.isArray(val) || typeof val === 'object') {
            if (Array.isArray(val))
                target[k] = val;
            else
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                target[k] = mergeBase(target[k], val, defaultsFunc);
        }
        else {
            if (defaults)
                target[k] = defaultsFunc(target[k], val);
            else
                target[k] = val;
        }
    }
    return target;
}
exports.mergeBase = mergeBase;
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
function merge(target, source1, source2, source3, source4) {
    target = target || {};
    const sources = [source1, source2, source3, source4,];
    return sources.reduce((a, c) => {
        return mergeBase(a, c);
    }, target);
}
exports.merge = merge;
/**
 * Generates a unique ID.
 *
 * @param radix the numberic value used to convert to strings.
 */
function generateUID(radix = 16) {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(radix);
}
exports.generateUID = generateUID;
/**
 * Breaks array of items into chunks.
 *
 * @param arr the array to chunkify.
 * @param chunk the chunk size (default: 1000)
 */
function chunkify(arr, chunk = 1000) {
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
exports.chunkify = chunkify;
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
function toKeyValue(obj, key) {
    return Object.keys(obj).reduce((a, c) => {
        const item = obj[c];
        a[c] = typeof item === 'object' ? item[key] : item;
        return a;
    }, {});
}
exports.toKeyValue = toKeyValue;
//# sourceMappingURL=utils.js.map