
import Mailgun, { AttachmentData } from 'mailgun-js';
import initTemplates from './template';
import { SendData, IMailgunConfig, TemplateData } from './types';
import { ensureArray, generateUID, chunkify } from './utils';
import { promise } from './utils';

const API_KEY = process.env.MAILGUN_API_KEY;
const API_DOMAIN = process.env.MAILGUN_API_DOMAIN;

const template = initTemplates();

function initMailgun<K extends string>(apiKey?: string | IMailgunConfig, apiDomain?: string) {

  let config = (apiKey || {}) as IMailgunConfig;

  if (typeof apiKey === 'string') {
    config = {
      apiKey,
      apiDomain
    };
  }

  // If not defined try to get api key, url, domain
  // from loaded ENV variables.
  config.apiKey = config.apiKey || API_KEY;
  config.apiDomain = config.apiDomain || API_DOMAIN;

  const configKeys = Object.keys(config);
  const requiredKeys = ['apiKey', 'apiDomain'];

  requiredKeys.forEach(k => {
    if (!configKeys.includes(k))
      throw new Error(`Mailgun requires key "${k}" but was not found.`);
  });

  const mailgun = Mailgun({ apiKey: config.apiKey, domain: config.apiDomain });

  /**
   * Gets a Mailgun list.
   * 
   * @param name the name of the list to get.
   */
  function list(name: string) {
    return mailgun.lists(`${name}@${config.apiDomain}`);
  }

  /**
   * Adds an attachment to the mail payload.
   * 
   * @param payload the payload to add the attchment to.
   * @param attachment the attachment to be added.
   * @param asInline whether to add to attachment or inline property.
   */
  function addAttachment(payload: SendData, attachment: AttachmentData | AttachmentData[], asInline = false) {
    if (asInline)
      payload.inline = [...ensureArray(payload.inline), ...ensureArray(attachment)];
    else
      payload.attachment = [...ensureArray(payload.attachment), ...ensureArray(attachment)];
    return payload;
  }

  /**
   * Adds inline attachment data such as an image.
   * 
   * @param payload the payload to add the attchment to.
   * @param inline the inline value to be added.
   */
  function addInline(payload: SendData, inline: AttachmentData | AttachmentData[]) {
    return addAttachment(payload, inline, true);
  }

  /**
   * Sends a message using mailgun.
   * 
   * @param payload the data payload to be sent.
   * @param cb the callback on completed.
   */
  function send(payload: SendData, cb?) {
    return mailgun.messages().send(payload, cb);
  }

  /**
   * Sends message after loading/rendering template.
   * 
   * @param ns the namespace of the template.
   * @param payload the send data payload.
   * @param templateData the template context data to be rendered.
   * @param cb the callback on completed.
   */
  async function sendWithTemplate<T>(ns: K, payload: SendData, templateData?: TemplateData<T>, cb?) {

    const { err, data } = await promise(template.load(ns));

    if (err)
      throw err;

    data.sendData = data.sendData || {} as any;

    // Allow template data to be passed with payload for convenience.
    const { templateData: altTemplateData, ...clean } = payload;
    templateData = { ...altTemplateData, ...templateData };
    payload = clean;

    // Merge in default "sendData" from template config defined in config.json.
    payload = { ...data.sendData, ...payload };

    // Add in inline assets and attachments.
    payload = addInline(payload, data.inline);
    payload = addAttachment(payload, data.attachments);

    // check if config.json "properties" key should be rendered.
    if (data.renderProps) {
      const str = JSON.stringify(data.properties);
      data.properties = JSON.parse(template.render(str, templateData));
    }

    // All properties rendered and merged.
    templateData = { ...data.properties, ...templateData };

    payload.html = template.render(data.html, templateData);

    if (payload.text)
      payload.text = template.render(payload.text, templateData);

    return send(payload, cb);
  }

  /**
   * Converts a send data payload into a batch payload.
   * 
   * @example
   * payload = {
   *  subject: '%recipient.subject%'
   * }
   * 
   * @example
   * extend = {
   *  'user@email.com': { subject: 'unique subject line', name: 'Recipient Name' }
   * }
   * 
   * @param payload the send data payload to convert.
   * @param recipients an array of recipients otherwise "to" field is used.
   * @param extend an object to extend mapped by recipient addresss.
   */
  function payloadToBatch<T extends { [key: string]: Record<string, unknown>; }>(payload: SendData, recipients: string[], extend: T): SendData[];

  /**
 * Converts a send data payload into a batch payload.
 * 
 * @example
 * payload = {
 *  subject: '%recipient.subject%'
 * }
 * 
 * @example
 * extend = {
 *  'user@email.com': { subject: 'unique subject line', name: 'Recipient Name' }
 * }
 * 
 * @param payload the send data payload to convert.
 * @param extend an object to extend mapped by recipient addresss.
 */
  function payloadToBatch<T extends { [key: string]: Record<string, unknown>; }>(payload: SendData, extend: T): SendData[];

  /**
 * Converts a send data payload into a batch payload.
 * 
 * @param payload the send data payload to convert.
 * @param recipients an array of recipients otherwise "to" field is used.
 */
  function payloadToBatch(payload: SendData, recipients?: string[]): SendData[];

  function payloadToBatch<T extends { [key: string]: Record<string, unknown>; }>(payload: SendData, recipients?: string[], extend?: T): SendData[] {

    if (!Array.isArray(recipients) && typeof recipients === 'object') {
      extend = recipients as T;
      recipients = undefined;
    }

    recipients = recipients || ensureArray(payload.to);
    extend = extend || {} as T;

    // Mailgun requires no more than
    // 1000 recipients at a time.
    const chunks = chunkify(recipients);

    return chunks.reduce((a, c) => {

      const clone = { ...payload };

      clone['recipient-variables'] = c.reduce((a, c) => {
        const ext = extend[c] || {};
        a[c] = {
          ...ext,
          uid: generateUID()
        };
        return a;
      }, {});

      clone.to = c;

      a = [...a, clone];

      return a;

    }, [] as SendData[]);

  }

  return {
    template,
    addAttachment,
    addInline,
    payloadToBatch,
    list,
    send,
    sendWithTemplate,
    mailgun
  };


}

export default initMailgun;


