import type { RspressPlugin } from '@rspress/shared';

export declare function pluginTypeDoc(options: PluginTypeDocOptions): RspressPlugin;

export declare interface PluginTypeDocOptions {
    /**
     * The entry points of modules.
     * @default []
     */
    entryPoints: string[];
    /**
     * The output directory.
     * @default 'api'
     */
    outDir?: string;
}

export { }
