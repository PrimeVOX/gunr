import { messages, Error } from 'mailgun-js';
import initMailgun from './mailgun';
import initConfig from './configure';
export declare type Map<T = any> = Record<keyof T, T[keyof T]>;
export declare type Properties<K extends string = string> = Record<K, IProperty>;
export declare type MailgunCallback = (err?: Error, body?: messages.SendResponse) => void;
export declare type TemplateData<T> = Record<keyof T, T[keyof T]>;
export declare type GunrConfigure = ReturnType<typeof initConfig>;
export declare type Gunr<K extends string> = ReturnType<typeof initMailgun & K>;
export interface IProperty {
    description?: string;
    value: string;
}
export declare type SendData<T = any> = messages.SendData & {
    templateData?: TemplateData<T>;
};
export interface IMailgunConfig {
    apiKey: string;
    apiDomain: string;
}
export interface IConfig<P extends Properties = Properties> {
    renderProps?: boolean;
    inline?: string[];
    attachments?: string[];
    properties?: P;
    sendData?: SendData;
}
export interface IRootConfig<P extends Properties = Properties> {
    templatesDir: string;
    renderProps?: boolean;
    sendData?: SendData;
    properties?: P;
}
