import { messages, Error } from 'mailgun-js';
import initMailgun from './mailgun';
import initConfig from './configure';

export type Map<T = any> = Record<keyof T, T[keyof T]>;

export type Properties<K extends string = string> = Record<K, IProperty>;

export type MailgunCallback = (err?: Error, body?: messages.SendResponse) => void;

export type TemplateData<T> = Record<keyof T, T[keyof T]>;

export type GunrConfigure = ReturnType<typeof initConfig>;

export type Gunr<K extends string> = ReturnType<typeof initMailgun & K> 

export interface IProperty {
  description?: string;
  value: string;
}

export type SendData<T = any> = messages.SendData & { templateData?: TemplateData<T> }

export interface IMailgunConfig {
  apiKey: string;
  apiDomain: string;
}

export interface IConfig<P extends Properties = Properties> {
  renderProps?: boolean; // when true properties render config properties as text then again as data againt hbs template.
  inline?: string[];
  attachments?: string[],
  properties?: P;
  sendData?: SendData;
}

export interface IRootConfig<P extends Properties = Properties> {
  templatesDir: string;
  renderProps?: boolean; // when true properties are run rendered before rendering to html.
  sendData?: SendData;
  properties?: P;
}
