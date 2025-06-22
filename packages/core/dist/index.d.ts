import { AdditionalPage } from '@rspress/shared';
import type { Data as Data_2 } from 'unist';
import { DefaultThemeConfig } from '@rspress/shared';
import { mergeDocConfig } from '@rspress/shared/node-utils';
import type { Node as Node_3 } from 'unist';
import type { PageIndexInfo } from '@rspress/shared';
import type { Plugin as Plugin_2 } from 'unified';
import type { RouteMeta } from '@rspress/shared';
import type { RsbuildConfig } from '@rsbuild/core';
import { RsbuildInstance } from '@rsbuild/core';
import type { RspressPlugin } from '@rspress/shared';
import type { UserConfig } from '@rspress/shared';

export declare function build(options: BuildOptions): Promise<void>;

declare interface BuildOptions {
    docDirectory: string;
    config: UserConfig;
}

/**
 * Info associated with mdast nodes by the ecosystem.
 *
 * This space is guaranteed to never be specified by unist or mdast.
 * But you can use it in utilities and plugins to store data.
 *
 * This type can be augmented to register custom data.
 * For example:
 *
 * ```ts
 * declare module 'mdast' {
 *   interface Data {
 *     // `someNode.data.myId` is typed as `number | undefined`
 *     myId?: number | undefined
 *   }
 * }
 * ```
 */
declare interface Data extends Data_2 {}

export declare function dev(options: DevOptions): Promise<ServerInstance>;

declare interface DevOptions {
    appDirectory: string;
    docDirectory: string;
    config: UserConfig;
    extraBuilderConfig?: RsbuildConfig;
}

declare interface InitOptions {
    scanDir: string;
    config: UserConfig;
    runtimeTempDir: string;
    pluginDriver: PluginDriver;
}

export { mergeDocConfig }

/**
 * Abstract mdast node.
 *
 * This interface is supposed to be extended.
 * If you can use {@link Literal} or {@link Parent}, you should.
 * But for example in markdown, a thematic break (`***`) is neither literal nor
 * parent, but still a node.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap} and other
 * places where relevant (such as {@link ElementContentMap}).
 *
 * For a union of all registered mdast nodes, see {@link Nodes}.
 */
declare interface Node_2 extends Node_3 {
    /**
     * Info from the ecosystem.
     */
    data?: Data | undefined;
}

/**
 * Abstract mdast node that contains other mdast nodes (*children*).
 *
 * This interface is supposed to be extended if you make custom mdast nodes.
 *
 * For a union of all registered mdast parents, see {@link Parents}.
 */
declare interface Parent extends Node_2 {
    /**
     * List of children.
     */
    children: RootContent[];
}

declare class PluginDriver {
    #private;
    constructor(config: UserConfig, isProd: boolean);
    init(): Promise<void>;
    addPlugin(plugin: RspressPlugin): void;
    getPlugins(): RspressPlugin[];
    clearPlugins(): void;
    removePlugin(pluginName: string): void;
    modifyConfig(): Promise<UserConfig<DefaultThemeConfig>>;
    beforeBuild(): Promise<void[]>;
    afterBuild(): Promise<void[]>;
    modifySearchIndexData(pages: PageIndexInfo[]): Promise<void[]>;
    extendPageData(pageData: PageIndexInfo): Promise<void[]>;
    addPages(): Promise<AdditionalPage[]>;
    routeGenerated(routes: RouteMeta[]): Promise<void[]>;
    routeServiceGenerated(routeService: RouteService): Promise<void[]>;
    addRuntimeModules(): Promise<Record<string, string>>;
    addSSGRoutes(): Promise<({
        path: string;
    } | {
        path: string;
    })[]>;
    globalUIComponents(): (string | [string, object])[];
    globalStyles(): string[];
    _runParallelAsyncHook<H extends RspressPluginHookKeys>(hookName: H, ...args: Parameters<Required<RspressPlugin>[H]>): Promise<Awaited<ReturnType<Required<RspressPlugin>[H]>>[]>;
    _runSerialAsyncHook<H extends RspressPluginHookKeys>(hookName: H, ...args: Parameters<Required<RspressPlugin>[H]>): RspressPlugin;
}

/**
 * Remark plugin to normalize a link href
 */
export declare const remarkPluginNormalizeLink: Plugin_2<[
    {
    root: string;
    cleanUrls: boolean | string;
    routeService?: RouteService;
}
], Root>;

/**
 * Document fragment or a whole document.
 *
 * Should be used as the root of a tree and must not be used as a child.
 */
declare interface Root extends Parent {
    /**
     * Node type of mdast root.
     */
    type: "root";
    /**
     * Data associated with the mdast root.
     */
    data?: RootData | undefined;
}

/**
 * Union of registered mdast nodes that can occur in {@link Root}.
 *
 * To register custom mdast nodes, add them to {@link RootContentMap}.
 * They will be automatically added here.
 */
declare type RootContent = RootContentMap[keyof RootContentMap];

/**
 * Info associated with mdast root nodes by the ecosystem.
 */
declare interface RootData extends Data {}

declare class RoutePage {
    routeMeta: RouteMeta;
    static create(routeMeta: RouteMeta): RoutePage;
    constructor(routeMeta: RouteMeta);
}

export declare class RouteService {
    #private;
    routeData: Map<string, RoutePage>;
    static create(options: InitOptions): Promise<RouteService>;
    constructor(scanDir: string, userConfig: UserConfig, tempDir: string, pluginDriver: PluginDriver);
    get extensions(): readonly string[];
    addRoute(routeMeta: RouteMeta): Promise<void>;
    removeRoute(filePath: string): void;
    getRoutes(): RouteMeta[];
    getRoutePages(): RoutePage[];
    isExistRoute(routePath: string): boolean;
    generateRoutesCode(): string;
    generateRoutesCodeByRouteMeta(routeMeta: RouteMeta[]): string;
    getRoutePathParts(routePath: string): readonly [string, string, string];
    normalizeRoutePath(routePath: string): {
        routePath: string;
        lang: string;
        version: string;
    };
    getRoutePageByRoutePath(routePath: string): RoutePage | undefined;
}

declare type RspressPluginHookKeys = 'beforeBuild' | 'afterBuild' | 'addPages' | 'addRuntimeModules' | 'routeGenerated' | 'routeServiceGenerated' | 'addSSGRoutes' | 'extendPageData' | 'modifySearchIndexData';

export declare function serve(options: ServeOptions): Promise<ReturnType<RsbuildInstance['preview']>>;

declare interface ServeOptions {
    config: UserConfig;
    port?: number;
    host?: string;
}

declare interface ServerInstance {
    close: () => Promise<void>;
}


export * from "@rspress/shared";

export { }
