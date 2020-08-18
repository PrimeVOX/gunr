"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const utils_1 = require("./utils");
function initConfig() {
    // this should be relative to local package, this script runs in /dist!
    const defaultPath = path_1.join(__dirname, '../.gunrrc');
    const defaultPathExists = fs_1.existsSync(defaultPath);
    const rootConfigPath = defaultPathExists ? defaultPath : path_1.join(__dirname, '../.gunrrc.json');
    const rootConfig = utils_1.readConfig(rootConfigPath, true) || {};
    if (!rootConfig)
        throw new Error(`Could NOT find root configuration "${rootConfigPath}"`);
    // keeping templates in this package so it has everything and can be called from anywhere
    const templatesDir = path_1.join(__dirname, '../', rootConfig.templatesDir);
    if (!fs_1.existsSync(templatesDir))
        throw new Error(`Could NOT find templates directory "${templatesDir}"`);
    const templatesGlob = templatesDir + '/**/*';
    const excludeGlob = '!' + templatesDir + '/**/assets';
    const templatesMap = (utils_1.getPaths([templatesGlob, excludeGlob], 'directories', true) || [])
        .reduce((a, c) => {
        // Get namespace relative to templates.
        const ns = utils_1.toNamespace(path_1.relative(templatesDir, c));
        // Get assets if any for the template.
        const assetPaths = utils_1.getPaths(path_1.join(c, 'assets') + '/**/*.*', 'files', true);
        // Create key value map of asset paths.
        const assets = assetPaths.reduce((a, c) => {
            a[path_1.parse(c).base] = c;
            return a;
        }, {});
        a[ns] = {
            path: c,
            assets
        };
        return a;
    }, {});
    return {
        CWD: utils_1.CWD,
        rootConfigPath,
        rootConfig,
        templatesMap
    };
}
exports.default = initConfig;
//# sourceMappingURL=configure.js.map