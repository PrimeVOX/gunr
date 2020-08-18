import { IRootConfig } from './types';
export default function initConfig(): {
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
