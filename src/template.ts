import hbs from 'handlebars';
import { join } from 'path';
import { readConfig, readHtml, promise, toKeyValue } from './utils';
import initConfig from './configure';
import { IConfig, TemplateData, IRootConfig } from './types';

function initTemplates() {

  const loadedConfig = initConfig();

  const { rootConfig, templatesMap, CWD } = loadedConfig;

  /**
   * Loads a template by namespace.
   * 
   * @param ns the namespace of the template to load.
   */
  async function load(ns: string) {

    const templateConfig = await promise<IConfig & IRootConfig>(readConfig<IConfig>(join(templatesMap[ns].path, 'config.json'), rootConfig));

    if (templateConfig.err)
      throw templateConfig.err;

    const config = templateConfig.data;

    const { err, data: html } = await promise(readHtml(join(templatesMap[ns].path, 'html.hbs')));

    if (err)
      throw err;

    const assetsMap = templatesMap[ns].assets;

    let inline: string[] = [];
    let attachments: string[] = [];

    if (config.inline)
      inline = config.inline.map(k => {
        const val = assetsMap[k];
        if (!val)
          throw new Error(`Failed to resolve inline asset for key ${k}.`);
        // return absolute path.
        return join(CWD, val);
      }) as string[];

    if (config.attachments)
      attachments = config.attachments.map(k => {
        const val = assetsMap[k];
        if (!val)
          throw new Error(`Failed to resolve attachment for key ${k}.`);
        // return absolute path.
        return join(CWD, val);
      }) as string[];

    const { templatesDir, ...clean } = config;

    // Map to key value, properties may be in form of key object with nested "value" key.
    clean.properties = toKeyValue(clean.properties, 'value');

    const loaded = { ...clean, html };

    loaded.inline = inline;
    loaded.attachments = attachments;

    return loaded;

  }

  /**
   * Renders a template using html and context data.
   * 
   * @param html the html to be rendered.
   * @param data the data passed to compiled template
   */
  function render<T = any>(html: string, data: TemplateData<T>) {
    const compiled = hbs.compile<TemplateData<T>>(html);
    return compiled(data);
  }

  return {
    config: loadedConfig,
    load,
    render
  };

}

export default initTemplates;