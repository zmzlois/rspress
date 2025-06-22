import { AdditionalPage } from '@rspress/shared';
import { DefaultThemeConfig } from '@rspress/shared';
import type { PageIndexInfo } from '@rspress/shared';
import type { RouteMeta } from '@rspress/shared';
import type { Rspack as Rspack_2 } from '@rsbuild/core';
import type { RspressPlugin } from '@rspress/shared';
import type { UserConfig } from '@rspress/shared';

declare interface InitOptions {
    scanDir: string;
    config: UserConfig;
    runtimeTempDir: string;
    pluginDriver: PluginDriver;
}

declare function mdxLoader(this: Rspack_2.LoaderContext<MdxLoaderOptions>, source: string): Promise<void>;
export default mdxLoader;

declare interface MdxLoaderOptions {
    config: UserConfig;
    docDirectory: string;
    checkDeadLinks: boolean;
    routeService: RouteService;
    pluginDriver: PluginDriver;
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

declare class RoutePage {
    routeMeta: RouteMeta;
    static create(routeMeta: RouteMeta): RoutePage;
    constructor(routeMeta: RouteMeta);
}

declare class RouteService {
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

export { }
