import type { RspressPlugin } from '@rspress/shared';
interface Options {
    /**
     * Algolia meta tag for verification
     * - <meta name="algolia-site-verification" content="YOUR_VERIFICATION_CONTENT" />
     */
    verificationContent?: string;
}
export declare function pluginAlgolia(options?: Options): RspressPlugin;
export {};
