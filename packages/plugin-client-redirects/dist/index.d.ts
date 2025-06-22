import type { RspressPlugin } from '@rspress/shared';

/**
 * The plugin is used to add client redirect feature to the doc site.
 */
export declare function pluginClientRedirects(options?: RedirectsOptions): RspressPlugin;

declare type RedirectRule = {
    to: string;
    from: string | string[];
};

declare type RedirectsOptions = {
    redirects?: RedirectRule[];
};

export { }
