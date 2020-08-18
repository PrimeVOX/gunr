import { TemplateData, IRootConfig } from './types';
declare function initTemplates(): {
    config: {
        CWD: string;
        rootConfigPath: string;
        rootConfig: IRootConfig<Record<string, import("./types").IProperty>>;
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
export default initTemplates;
