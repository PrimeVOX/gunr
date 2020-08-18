import { join, parse, relative } from 'path';
import { existsSync } from 'fs';
import { getPaths, readConfig, CWD, toNamespace } from './utils';
import { IRootConfig } from './types';

export default function initConfig() {

  // this should be relative to local package, this script runs in /dist!
  const defaultPath = join(__dirname, '../.gunrrc');

  const defaultPathExists = existsSync(defaultPath);

  const rootConfigPath = defaultPathExists ? defaultPath : join(__dirname, '../.gunrrc.json');

  const rootConfig = readConfig<IRootConfig>(rootConfigPath, true) || {} as IRootConfig;

  if (!rootConfig)
    throw new Error(`Could NOT find root configuration "${rootConfigPath}"`);

  // keeping templates in this package so it has everything and can be called from anywhere
  const templatesDir = join(__dirname, '../', rootConfig.templatesDir);

  if (!existsSync(templatesDir))
    throw new Error(`Could NOT find templates directory "${templatesDir}"`);

  const templatesGlob = templatesDir + '/**/*';

  const excludeGlob = '!' + templatesDir + '/**/assets';

  const templatesMap =
    (getPaths([templatesGlob, excludeGlob], 'directories', true) || [])
      .reduce((a, c) => {

        // Get namespace relative to templates.
        const ns = toNamespace(relative(templatesDir, c));

        // Get assets if any for the template.
        const assetPaths = getPaths(join(c, 'assets') + '/**/*.*', 'files', true);

        // Create key value map of asset paths.
        const assets = assetPaths.reduce((a, c) => {
          a[parse(c).base] = c;
          return a;
        }, {});

        a[ns] = {
          path: c, // full path to template dir.
          assets
        };

        return a;

      }, {}) as { [ns: string]: { path: string, assets: { [key: string]: string; }; }; };

  return {
    CWD,
    rootConfigPath,
    rootConfig,
    templatesMap
  };

}


