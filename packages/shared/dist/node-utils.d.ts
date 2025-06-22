import type { MdxJsxAttribute } from 'mdast-util-mdx-jsx';
import type { MdxJsxAttributeValueExpression } from 'mdast-util-mdx-jsx';
import type { MdxJsxExpressionAttribute } from 'mdast-util-mdx-jsx';
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx';
import type { MdxJsxTextElement } from 'mdast-util-mdx-jsx';
import type { PluggableList } from 'unified';
import type { RehypeShikiOptions } from '@shikijs/rehype';
import type { RsbuildConfig } from '@rsbuild/core';
import type { RsbuildPlugin } from '@rsbuild/core';

/**
 * There are two ways to define what addition routes represent.
 * 1. Define filepath, then the content will be read from the file.
 * 2. Define content, then then content will be written to temp file and read from it.
 */
declare interface AdditionalPage {
    routePath: string;
    content?: string;
    filepath?: string;
}

declare interface Config {
    /**
     * Whether to enable dark mode.
     * @default true
     */
    darkMode?: boolean;
    /**
     * Custom outline title in the aside component.
     *
     * @default 'ON THIS PAGE'
     */
    outlineTitle?: string;
    /**
     * Whether to show the sidebar in right position.
     */
    outline?: boolean;
    /**
     * The nav items. When it's an object, the key is the version of current doc.
     */
    nav?: NavItem[] | {
        [key: string]: NavItem[];
    };
    /**
     * The sidebar items.
     */
    sidebar?: Sidebar;
    /**
     * Info for the edit link. If it's undefined, the edit link feature will
     * be disabled.
     */
    editLink?: EditLink;
    /**
     * Set custom last updated text.
     *
     * @default 'Last updated'
     */
    lastUpdatedText?: string;
    /**
     * Set custom last updated text.
     *
     * @default false
     */
    lastUpdated?: boolean;
    /**
     * Set custom prev/next labels.
     */
    docFooter?: DocFooter;
    /**
     * The social links to be displayed at the end of the nav bar. Perfect for
     * placing links to social services such as GitHub, X, Facebook, etc.
     */
    socialLinks?: SocialLink[];
    /**
     * The footer configuration.
     */
    footer?: Footer;
    /**
     * The prev page text.
     */
    prevPageText?: string;
    /**
     * The next page text.
     */
    nextPageText?: string;
    /**
     * The source code text.
     */
    sourceCodeText?: string;
    /**
     * Locale config
     */
    locales?: LocaleConfig[];
    /**
     * Whether to open the full text search
     */
    search?: boolean;
    /**
     * The placeholder of search input
     */
    searchPlaceholderText?: string;
    /**
     * The text of no search result
     */
    searchNoResultsText?: string;
    /**
     * The text of suggested query text when no search result
     */
    searchSuggestedQueryText?: string;
    /**
     * The text of overview filter
     */
    overview?: FilterConfig;
    /**
     * The behavior of hiding navbar
     */
    hideNavbar?: 'always' | 'auto' | 'never';
    /**
     * Whether to enable view transition animation for pages switching
     */
    enableContentAnimation?: boolean;
    /**
     * Whether to enable view transition animation for the theme
     */
    enableAppearanceAnimation?: boolean;
    /**
     * Enable scroll to top button on documentation
     * @default false
     */
    enableScrollToTop?: boolean;
    /**
     * Whether to redirect to the closest locale when the user visits the site
     * @default 'auto'
     */
    localeRedirect?: 'auto' | 'never' | 'only-default-lang';
    /**
     * Whether to show the fallback heading title when the heading title is not presented but `frontmatter.title` exists
     * @default true
     */
    fallbackHeadingTitle?: boolean;
}

declare interface DocFooter {
    /**
     * Custom label for previous page button.
     */
    prev?: SidebarItem;
    /**
     * Custom label for next page button.
     */
    next?: SidebarItem;
}

declare interface EditLink {
    /**
     * Custom repository url for edit link.
     */
    docRepoBaseUrl: string;
    /**
     * Custom text for edit link.
     *
     * @default 'Edit this page'
     */
    text?: string;
}

/**
 * hello world {#custom-id} -> { text: 'hello world', id: 'custom-id' }
 */
export declare const extractTextAndId: (title?: string) => [text: string, customId: string];

declare interface Feature {
    icon: string;
    title: string;
    details: string;
    span?: number;
    link?: string;
}

/**
 * The config of filter component
 */
declare interface FilterConfig {
    filterNameText?: string;
    filterPlaceholderText?: string;
    filterNoResultText?: string;
}

declare interface Footer {
    message?: string;
}

declare interface FrontMatterMeta {
    title?: string;
    description?: string;
    overview?: boolean;
    pageType?: PageType;
    features?: Feature[];
    hero?: Hero;
    sidebar?: boolean;
    outline?: boolean;
    lineNumbers?: boolean;
    overviewHeaders?: number[];
    titleSuffix?: string;
    head?: [string, Record<string, string>][];
    context?: string;
    footer?: boolean;
    [key: string]: unknown;
}

/**
 * Transform `config.icon` into final url path in the web app
 *
 * @param icon original icon in config
 * @returns final url path in the web app
 */
export declare function getIconUrlPath(icon: '' | undefined): undefined;

export declare function getIconUrlPath(icon: string | URL): string;

export declare function getIconUrlPath(icon: string | URL | undefined): string | undefined;

export declare function getNodeAttribute(node: MdxJsxFlowElement | MdxJsxTextElement, attrName: string, attribute?: false): string | MdxJsxAttributeValueExpression | null | undefined;

export declare function getNodeAttribute(node: MdxJsxFlowElement | MdxJsxTextElement, attrName: string, attribute: true): MdxJsxAttribute | MdxJsxExpressionAttribute | undefined;

declare interface Header {
    id: string;
    text: string;
    depth: number;
    charIndex: number;
}

declare interface Hero {
    name: string;
    text: string;
    tagline: string;
    image?: {
        src: string | {
            dark: string;
            light: string;
        };
        alt: string;
        /**
         * `srcset` and `sizes` are attributes of `<img>` tag. Please refer to https://mdn.io/srcset for the usage.
         * When the value is an array, rspress will join array members with commas.
         **/
        sizes?: string | string[];
        srcset?: string | string[];
    };
    actions: {
        text: string;
        link: string;
        theme: 'brand' | 'alt';
    }[];
}

export declare function loadFrontMatter<TFrontmatter extends Record<string, unknown> = FrontMatterMeta>(source: string, filepath: string, root: string, outputWarning?: boolean): {
    frontmatter: TFrontmatter;
    content: string;
    emptyLinesSource: string;
};

declare interface Locale {
    lang: string;
    label: string;
    title?: string;
    description?: string;
}

/**
 * locale config
 */
declare interface LocaleConfig {
    /**
     * Site i18n config, which will recover the locales config in the site level.
     */
    lang: string;
    title?: string;
    description?: string;
    label: string;
    /**
     * Theme i18n config
     */
    nav?: Nav;
    sidebar?: Sidebar;
    outlineTitle?: string;
    lastUpdatedText?: string;
    lastUpdated?: boolean;
    editLink?: EditLink;
    prevPageText?: string;
    nextPageText?: string;
    sourceCodeText?: string;
    langRoutePrefix?: string;
    searchPlaceholderText?: string;
    searchNoResultsText?: string;
    searchSuggestedQueryText?: string;
    overview?: FilterConfig;
}

declare type LocalSearchOptions = SearchHooks & {
    mode?: 'local';
    /**
     * Whether to generate separate search index for each version
     */
    versioned?: boolean;
    /**
     * If enabled, the search index will include code block content, which allows users to search code blocks.
     * @default true
     */
    codeBlocks?: boolean;
};

declare interface MarkdownOptions {
    remarkPlugins?: PluggableList;
    rehypePlugins?: PluggableList;
    /**
     * Whether to enable check dead links, default is false
     */
    checkDeadLinks?: boolean;
    showLineNumbers?: boolean;
    /**
     * Whether to wrap code by default, default is false
     */
    defaultWrapCode?: boolean;
    /**
     * Register global components in mdx files
     */
    globalComponents?: string[];
    /**
     * @type import('@shikijs/rehype').RehypeShikiOptions
     */
    shiki?: Partial<PluginShikiOptions>;
    /**
     * Speed up build time by caching mdx parsing result in `rspress build`
     * @default true
     */
    crossCompilerCache?: boolean;
}

export declare const mergeDocConfig: (...configs: UserConfig[]) => Promise<UserConfig>;

declare type Nav = NavItem[] | {
    [key: string]: NavItem[];
};

declare type NavItem = NavItemWithLink | NavItemWithChildren | NavItemWithLinkAndChildren;

declare interface NavItemWithChildren {
    text?: string;
    tag?: string;
    items: NavItemWithLink[];
    position?: 'left' | 'right';
}

declare type NavItemWithLink = {
    text: string;
    link: string;
    tag?: string;
    activeMatch?: string;
    position?: 'left' | 'right';
};

declare interface NavItemWithLinkAndChildren {
    text: string;
    link: string;
    items: NavItemWithLink[];
    tag?: string;
    activeMatch?: string;
    position?: 'left' | 'right';
}

/**
 * @description search-index.json file
 * "_foo" is the private field that won't be written to search-index.json file
 * and should not be used in the runtime (usePageData).
 */
declare interface PageIndexInfo {
    routePath: string;
    title: string;
    toc: Header[];
    content: string;
    _flattenContent?: string;
    _html: string;
    frontmatter: FrontMatterMeta;
    lang: string;
    version: string;
    domain: string;
    _filepath: string;
    _relativePath: string;
}

declare type PageType = 'home' | 'doc' | 'custom' | '404' | 'blank';

declare type PluginShikiOptions = RehypeShikiOptions;

declare type RemoteSearchIndexInfo = string | {
    value: string;
    label: string;
};

declare type RemoteSearchOptions = SearchHooks & {
    mode: 'remote';
    apiUrl: string;
    domain?: string;
    indexName: string;
    searchIndexes?: RemoteSearchIndexInfo[];
    searchLoading?: boolean;
};

declare interface ReplaceRule {
    search: string | RegExp;
    replace: string;
}

declare interface RouteMeta {
    routePath: string;
    absolutePath: string;
    relativePath: string;
    pageName: string;
    lang: string;
    version: string;
}

declare interface RouteOptions {
    /**
     * The extension name of the filepath that will be converted to a route
     * @default ['js','jsx','ts','tsx','md','mdx']
     */
    extensions?: string[];
    /**
     * Include extra files from being converted to routes
     */
    include?: string[];
    /**
     * Exclude files from being converted to routes
     */
    exclude?: string[];
    /**
     * use links without .html files
     */
    cleanUrls?: boolean;
}

declare interface RspressPlugin {
    /**
     * Name of the plugin.
     */
    name: string;
    /**
     * Global style
     */
    globalStyles?: string;
    /**
     * Markdown options.
     */
    markdown?: {
        remarkPlugins?: PluggableList;
        rehypePlugins?: PluggableList;
        globalComponents?: string[];
    };
    /**
     * Rsbuild config.
     */
    builderConfig?: RsbuildConfig;
    /**
     * Inject global components.
     */
    globalUIComponents?: (string | [string, object])[];
    /**
     * Modify doc config.
     */
    config?: (config: UserConfig, utils: {
        addPlugin: (plugin: RspressPlugin) => void;
        removePlugin: (pluginName: string) => void;
    }, isProd: boolean) => UserConfig | Promise<UserConfig>;
    /**
     * Callback before build
     */
    beforeBuild?: (config: UserConfig, isProd: boolean) => void | Promise<void>;
    /**
     * Callback after build
     */
    afterBuild?: (config: UserConfig, isProd: boolean) => void | Promise<void>;
    /**
     * Extend every page's data
     */
    extendPageData?: (pageData: PageIndexInfo, isProd: boolean) => void | Promise<void>;
    /**
     * Add custom route
     */
    addPages?: (config: UserConfig, isProd: boolean) => AdditionalPage[] | Promise<AdditionalPage[]>;
    /**
     * Add runtime modules
     * @deprecated use [rsbuild-plugin-virtual-module](https://github.com/rspack-contrib/rsbuild-plugin-virtual-module) instead.
     */
    addRuntimeModules?: (config: UserConfig, isProd: boolean) => Record<string, string> | Promise<Record<string, string>>;
    /**
     * Callback after route generated
     */
    routeGenerated?: (routes: RouteMeta[], isProd: boolean) => Promise<void> | void;
    /**
     * Callback after routeService generated
     */
    routeServiceGenerated?: (routeService: any, isProd: boolean) => Promise<void> | void;
    /**
     * Add addition ssg routes, for dynamic routes.
     */
    addSSGRoutes?: (config: UserConfig, isProd: boolean) => {
        path: string;
    }[] | Promise<{
        path: string;
    }[]>;
    /**
     * @private
     * Modify search index data.
     */
    modifySearchIndexData?: (data: PageIndexInfo[], isProd: boolean) => void | Promise<void>;
}

declare interface SearchHooks {
    /**
     * The search hook function path. The corresponding file should export a function named `onSearch`.
     */
    searchHooks?: string;
}

declare type SearchOptions = LocalSearchOptions | RemoteSearchOptions | false;

declare interface Sidebar {
    [path: string]: (SidebarGroup | SidebarItem | SidebarDivider | SidebarSectionHeader)[];
}

declare type SidebarDivider = {
    dividerType: 'dashed' | 'solid';
};

declare interface SidebarGroup {
    text: string;
    link?: string;
    tag?: string;
    items: (SidebarGroup | SidebarItem | SidebarDivider | SidebarSectionHeader)[];
    collapsible?: boolean;
    collapsed?: boolean;
    /**
     * For hmr usage in development
     */
    _fileKey?: string;
    overviewHeaders?: number[];
    context?: string;
}

declare type SidebarItem = {
    text: string;
    link: string;
    tag?: string;
    /**
     * For hmr usage in development
     */
    _fileKey?: string;
    overviewHeaders?: number[];
    context?: string;
};

declare type SidebarSectionHeader = {
    sectionHeaderText: string;
    tag?: string;
};

declare interface SocialLink {
    icon: SocialLinkIcon;
    mode: 'link' | 'text' | 'img' | 'dom';
    content: string;
}

declare type SocialLinkIcon = 'lark' | 'discord' | 'facebook' | 'github' | 'instagram' | 'linkedin' | 'slack' | 'x' | 'youtube' | 'wechat' | 'qq' | 'juejin' | 'zhihu' | 'bilibili' | 'weibo' | 'gitlab' | 'X' | 'bluesky' | {
    svg: string;
};

declare interface UserConfig<ThemeConfig = Config> {
    /**
     * The root directory of the site.
     * @default 'docs'
     */
    root?: string;
    /**
     * Path to the logo file in nav bar.
     */
    logo?: string | {
        dark: string;
        light: string;
    };
    /**
     * The text of the logo in nav bar.
     * @default ''
     */
    logoText?: string;
    /**
     * Base path of the site.
     * @default '/'
     */
    base?: string;
    /**
     * Path to html icon file.
     */
    icon?: string | URL;
    /**
     * Default language of the site.
     */
    lang?: string;
    /**
     * Title of the site.
     * @default 'Rspress'
     */
    title?: string;
    /**
     * Description of the site.
     * @default ''
     */
    description?: string;
    /**
     * Head tags.
     */
    head?: (string | [string, Record<string, string>] | ((route: RouteMeta) => string | [string, Record<string, string>] | undefined))[];
    /**
     * I18n config of the site.
     */
    locales?: Locale[];
    /**
     * The i18n text data source path. Default is `i18n.json` in cwd.
     */
    i18nSourcePath?: string;
    /**
     * Theme config.
     */
    themeConfig?: ThemeConfig;
    /**
     * Rsbuild Configuration
     */
    builderConfig?: RsbuildConfig;
    /**
     * The custom config of vite-plugin-route
     */
    route?: RouteOptions;
    /**
     * The custom config of markdown compile
     */
    markdown?: MarkdownOptions;
    /**
     * Doc plugins
     */
    plugins?: RspressPlugin[];
    /**
     * Replace rule, will replace the content of the page.
     */
    replaceRules?: ReplaceRule[];
    /**
     * Output directory
     */
    outDir?: string;
    /**
     * Custom theme directory
     */
    themeDir?: string;
    /**
     * Global components
     */
    globalUIComponents?: (string | [string, object])[];
    /**
     * Global styles, is a Absolute path
     */
    globalStyles?: string;
    /**
     * Search options
     */
    search?: SearchOptions;
    /**
     * Whether to enable ssg, default is true
     */
    ssg?: boolean;
    /**
     * Whether to enable medium-zoom, default is true
     */
    mediumZoom?: boolean | {
        selector?: string;
        options?: ZoomOptions;
    };
    /**
     * Add some extra builder plugins
     */
    builderPlugins?: RsbuildPlugin[];
    /**
     * Multi version config
     */
    multiVersion?: {
        /**
         * The default version
         */
        default?: string;
        /**
         * The version list, such as ['v1', 'v2']
         */
        versions: string[];
    };
    /**
     * Language parity checking config
     */
    languageParity?: {
        /**
         * Whether to enable language parity checking
         */
        enabled?: boolean;
        /**
         * Directories to include in the parity check
         */
        include?: string[];
        /**
         * Directories to exclude from the parity check
         */
        exclude?: string[];
    };
}

declare interface ZoomContainer {
    width?: number
    height?: number
    top?: number
    bottom?: number
    right?: number
    left?: number
}

declare interface ZoomOptions {
    /**
     * The space outside the zoomed image.
     *
     * @default 0
     */
    margin?: number

    /**
     * The background of the overlay.
     *
     * @default '#fff'
     */
    background?: string

    /**
     * The number of pixels to scroll to close the zoom.
     *
     * @default 40
     */
    scrollOffset?: number

    /**
     * The viewport to render the zoom in.
     *
     * @default null
     */
    container?: string | HTMLElement | ZoomContainer

    /**
     * The template element to display on zoom.
     *
     * @default null
     */
    template?: string | HTMLTemplateElement
}

export { }
