import { AttachmentData } from 'mailgun-js';
import { SendData, IMailgunConfig, TemplateData } from './types';
declare function initMailgun<K extends string>(apiKey?: string | IMailgunConfig, apiDomain?: string): {
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
    addAttachment: (payload: SendData, attachment: AttachmentData | AttachmentData[], asInline?: boolean) => any;
    addInline: (payload: SendData, inline: AttachmentData | AttachmentData[]) => any;
    payloadToBatch: {
        <T_1 extends {
            [key: string]: Record<string, unknown>;
        }>(payload: SendData, recipients: string[], extend: T_1): SendData[];
        <T_2 extends {
            [key: string]: Record<string, unknown>;
        }>(payload: SendData, extend: T_2): SendData[];
        (payload: SendData, recipients?: string[]): SendData[];
    };
    list: (name: string) => any;
    send: (payload: SendData, cb?: any) => any;
    sendWithTemplate: <T_3>(ns: K, payload: SendData, templateData?: Record<keyof T_3, T_3[keyof T_3]>, cb?: any) => Promise<any>;
    mailgun: any;
};
export default initMailgun;
