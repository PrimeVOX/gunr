import { IMailgunConfig } from './types';
export declare function getInstance(apiKey?: string | IMailgunConfig, apiDomain?: string): {
    template: {
        config: {
            CWD: string;
            rootConfigPath: string;
            rootConfig: import("./types").IRootConfig<Record<string, import("./types").IProperty>>;
            templatesMap: {
                [ns: string]: {
                    path: string;
                    assets: {
                        [key: string]: string;
                    };
                };
            };
        };
        load: (ns: string) => Promise<{
            html: string;
            renderProps?: boolean;
            inline?: string[];
            attachments?: string[];
            properties?: Record<string, import("./types").IProperty>;
            sendData?: any;
        }>;
        render: <T = any>(html: string, data: Record<keyof T, T[keyof T]>) => string;
    };
    addAttachment: (payload: any, attachment: any, asInline?: boolean) => any;
    addInline: (payload: any, inline: any) => any;
    payloadToBatch: {
        <T_1 extends {
            [key: string]: Record<string, unknown>;
        }>(payload: any, recipients: string[], extend: T_1): any[];
        <T_2 extends {
            [key: string]: Record<string, unknown>;
        }>(payload: any, extend: T_2): any[];
        (payload: any, recipients?: string[]): any[];
    };
    list: (name: string) => any;
    send: (payload: any, cb?: any) => any;
    sendWithTemplate: <T_3>(ns: string, payload: any, templateData?: Record<keyof T_3, T_3[keyof T_3]>, cb?: any) => Promise<any>;
    mailgun: any;
};
declare const _default: {
    template: {
        config: {
            CWD: string;
            rootConfigPath: string;
            rootConfig: import("./types").IRootConfig<Record<string, import("./types").IProperty>>;
            templatesMap: {
                [ns: string]: {
                    path: string;
                    assets: {
                        [key: string]: string;
                    };
                };
            };
        };
        load: (ns: string) => Promise<{
            html: string;
            renderProps?: boolean;
            inline?: string[];
            attachments?: string[];
            properties?: Record<string, import("./types").IProperty>;
            sendData?: any;
        }>;
        render: <T = any>(html: string, data: Record<keyof T, T[keyof T]>) => string;
    };
    addAttachment: (payload: any, attachment: any, asInline?: boolean) => any;
    addInline: (payload: any, inline: any) => any;
    payloadToBatch: {
        <T_1 extends {
            [key: string]: Record<string, unknown>;
        }>(payload: any, recipients: string[], extend: T_1): any[];
        <T_2 extends {
            [key: string]: Record<string, unknown>;
        }>(payload: any, extend: T_2): any[];
        (payload: any, recipients?: string[]): any[];
    };
    list: (name: string) => any;
    send: (payload: any, cb?: any) => any;
    sendWithTemplate: <T_3>(ns: string, payload: any, templateData?: Record<keyof T_3, T_3[keyof T_3]>, cb?: any) => Promise<any>;
    mailgun: any;
};
export default _default;
