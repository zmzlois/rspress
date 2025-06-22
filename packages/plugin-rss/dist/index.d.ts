import type { Author } from 'feed';
import type { Feed } from 'feed';
import type { FeedOptions } from 'feed';
import type { Item } from 'feed';
import type { PageIndexInfo } from '@rspress/shared';
import type { RspressPlugin } from '@rspress/shared';
import type { UserConfig } from '@rspress/shared';

export declare function createFeed(options: Omit<FeedChannel, 'test' | 'item' | 'output'> & {
    item?: unknown;
    test?: unknown;
    output: ResolvedOutput;
}, config: UserConfig): FeedOptions;

export declare interface FeedChannel extends PartialPartial<FeedOptions, 'title' | 'copyright'> {
    /**
     * used as the basename of rss file, should be unique
     **/
    id: string;
    /**
     * to match pages that should be listed in this feed
     * if RegExp is given, it will match against the route path of each page
     **/
    test: RegExp | string | (RegExp | string)[] | ((item: PageIndexInfo, base: string) => boolean);
    /**
     * a function to modify feed item
     * @param item pre-generated feed item
     * @param page page data
     * @param base base path of the rspress site
     * @returns modified feed item
     */
    item?: (item: FeedItem, page: PageIndexInfo, base: string) => FeedItem | PromiseLike<FeedItem>;
    /**
     * feed level output config
     */
    output?: FeedOutputOptions;
}

export declare type FeedItem = Item;

/**
 * output config of a feed.
 * a feed will be written into path `${rspress.outDir || 'doc_build'}/${dir}/${filename}`
 */
export declare interface FeedOutputOptions {
    /**
     * output dir of feed files, relative to rspress's outDir
     */
    dir?: string;
    /**
     * type of feed files
     */
    type?: FeedOutputType;
    /**
     * base filename of feed files. `${id}.${extension by type}` by default.
     */
    filename?: string;
    /**
     * public path of feed files. siteUrl by default
     */
    publicPath?: string;
    /**
     * sort feed items
     */
    sorting?: (left: FeedItem, right: FeedItem) => number;
}

/**
 * output feed file type
 */
export declare type FeedOutputType = /** Atom 1.0 Feed */ 'atom' | /** RSS 2.0 Feed */ 'rss' | /** JSON1 Feed */ 'json';

/**
 * @public
 * @param page Rspress Page Data
 * @param siteUrl
 */
export declare function generateFeedItem(page: PageIndexInfo, siteUrl: string): {
    id: string;
    title: string;
    author: Author[] | undefined;
    link: string;
    description: string;
    content: string;
    date: Date;
    category: {
        name: string;
    }[];
};

export declare function getDefaultFeedOption(): {
    id: string;
    test: string;
};

export declare function getFeedFileType(type: FeedOutputType): {
    extension: string;
    mime: string;
    getContent: (feed: Feed) => string;
};

export declare function getOutputInfo({ id, output }: Pick<FeedChannel, 'id' | 'output'>, { siteUrl, output: globalOutput, }: Pick<PluginRssOptions, 'output' | 'siteUrl'>): ResolvedOutput;

/**
 * feed information attached in `PageIndexInfo['feeds']` array
 */
export declare interface PageFeedData {
    url: string;
    language: string;
    mime: string;
}

declare type PartialPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

export declare const PluginComponents: {
    readonly FeedsAnnotations: "@rspress/plugin-rss/FeedsAnnotations";
};

export declare const PluginName = "@rspress/plugin-rss";

export declare function pluginRss(pluginRssOptions: PluginRssOptions): RspressPlugin;

/**
 * plugin options for `pluginRss`
 */
export declare interface PluginRssOptions {
    /**
     * site url of this rspress site. it will be used in feed files and feed link.
     * @requires
     */
    siteUrl: string;
    /**
     * Feed options for each rss. If array is given, this plugin will produce multiple feed files.
     * @default {{ id: 'blog', test: /^\/blog\// }}
     */
    feed?: PartialPartial<FeedChannel, 'id' | 'test'> | FeedChannel[];
    /**
     * output config for all feed files
     */
    output?: Omit<FeedOutputOptions, 'filename'>;
}

declare interface ResolvedOutput {
    type: FeedOutputType;
    mime: string;
    filename: string;
    getContent: (feed: Feed) => string;
    dir: string;
    publicPath: string;
    url: string;
    sorting: (left: FeedItem, right: FeedItem) => number;
}

export declare function testPage(test: FeedChannel['test'], page: PageIndexInfo, base?: string): boolean;

export { }
