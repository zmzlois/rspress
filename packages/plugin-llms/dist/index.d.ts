import type { PageIndexInfo } from '@rspress/shared';
import type { RspressPlugin } from '@rspress/shared';

export declare interface LlmsTxt {
    onTitleGenerate?: (context: {
        title: string | undefined;
        description: string | undefined;
    }) => string;
    onLineGenerate?: (page: PageIndexInfo) => string;
    onAfterLlmsTxtGenerate?: (llmsTxtContent: string) => string;
}

export declare interface Options {
    /**
     * Whether to generate llms.txt.
     * @default true
     */
    llmsTxt?: boolean | LlmsTxt;
    /**
     * Whether to generate llms.txt related md files for each route.
     * @default true
     */
    mdFiles?: boolean;
    /**
     * Whether to generate llms-full.txt.
     * @default true
     */
    llmsFullTxt?: boolean;
    /**
     * Whether to include some routes from llms.txt.
     * @param context
     * @default (context) => context.page.lang === config.lang
     */
    include?: (context: {
        page: PageIndexInfo;
    }) => boolean;
    /**
     * Whether to exclude some routes from llms.txt.
     * exclude will trigger after include
     * @default undefined
     */
    exclude?: (context: {
        page: PageIndexInfo;
    }) => boolean;
}

/**
 * A plugin for rspress to generate llms.txt, llms-full.txt, md files to let llm understand your website.
 */
export declare function pluginLlms(options?: Options): RspressPlugin;

export { }
