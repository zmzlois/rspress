import __rslib_shim_module__ from 'module';
const require = /*#__PURE__*/ __rslib_shim_module__.createRequire(import.meta.url);
import * as __WEBPACK_EXTERNAL_MODULE__rspress_shared_baa012d0__ from "@rspress/shared";
import * as __WEBPACK_EXTERNAL_MODULE__rspress_shared_constants_70084e62__ from "@rspress/shared/constants";
import * as __WEBPACK_EXTERNAL_MODULE__rspress_shared_logger_4374e44a__ from "@rspress/shared/logger";
import * as __WEBPACK_EXTERNAL_MODULE__rspress_shared_node_utils_78947ce6__ from "@rspress/shared/node-utils";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_promises_153e37e0__ from "node:fs/promises";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__ from "node:path";
import { pluginContainerSyntax } from "@rspress/plugin-container-syntax";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PLUGIN_REACT_NAME, pluginReact } from "@rsbuild/plugin-react";
import picocolors from "picocolors";
import { glob } from "tinyglobby";
import node_os from "node:os";
import { RspackVirtualModulePlugin } from "rspack-plugin-virtual-module";
import { groupBy } from "lodash-es";
import { compile } from "@rspress/mdx-rs";
import { htmlToText } from "html-to-text";
import node_fs, { createReadStream, existsSync } from "node:fs";
import { createProcessor } from "@mdx-js/mdx";
import enhanced_resolve from "enhanced-resolve";
import { createHash } from "node:crypto";
import { createHead, transformHtmlTemplate } from "@unhead/react/server";
import { mergeRsbuildConfig as core_mergeRsbuildConfig } from "@rsbuild/core";
import { visit } from "unist-util-visit";
export * from "@rspress/shared";
var __webpack_modules__ = {
    "@rspress/shared": function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE__rspress_shared_baa012d0__;
    },
    "@rspress/shared/constants": function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE__rspress_shared_constants_70084e62__;
    },
    "@rspress/shared/logger": function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE__rspress_shared_logger_4374e44a__;
    },
    "@rspress/shared/node-utils": function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE__rspress_shared_node_utils_78947ce6__;
    },
    "node:fs/promises": function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_node_fs_promises_153e37e0__;
    },
    "node:path": function(module) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_node_path_c5b9b54f__;
    }
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (void 0 !== cachedModule) return cachedModule.exports;
    var module = __webpack_module_cache__[moduleId] = {
        exports: {}
    };
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
}
__webpack_require__.m = __webpack_modules__;
(()=>{
    __webpack_require__.d = (exports, definition)=>{
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.f = {};
    __webpack_require__.e = (chunkId)=>Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key)=>{
            __webpack_require__.f[key](chunkId, promises);
            return promises;
        }, []));
})();
(()=>{
    __webpack_require__.u = (chunkId)=>"" + chunkId + ".js";
})();
(()=>{
    __webpack_require__.o = (obj, prop)=>Object.prototype.hasOwnProperty.call(obj, prop);
})();
(()=>{
    var installedChunks = {
        980: 0
    };
    var installChunk = (data)=>{
        var __webpack_ids__ = data.__webpack_ids__;
        var __webpack_modules__ = data.__webpack_modules__;
        var __webpack_runtime__ = data.__webpack_runtime__;
        var moduleId, chunkId, i = 0;
        for(moduleId in __webpack_modules__)if (__webpack_require__.o(__webpack_modules__, moduleId)) __webpack_require__.m[moduleId] = __webpack_modules__[moduleId];
        if (__webpack_runtime__) __webpack_runtime__(__webpack_require__);
        for(; i < __webpack_ids__.length; i++){
            chunkId = __webpack_ids__[i];
            if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) installedChunks[chunkId][0]();
            installedChunks[__webpack_ids__[i]] = 0;
        }
    };
    __webpack_require__.f.j = function(chunkId, promises) {
        var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : void 0;
        if (0 !== installedChunkData) if (installedChunkData) promises.push(installedChunkData[1]);
        else {
            var promise = import("./" + __webpack_require__.u(chunkId)).then(installChunk, (e)=>{
                if (0 !== installedChunks[chunkId]) installedChunks[chunkId] = void 0;
                throw e;
            });
            var promise = Promise.race([
                promise,
                new Promise((resolve)=>{
                    installedChunkData = installedChunks[chunkId] = [
                        resolve
                    ];
                })
            ]);
            promises.push(installedChunkData[1] = promise);
        }
    };
})();
class PluginDriver {
    #config;
    #plugins;
    #isProd;
    constructor(config, isProd){
        this.#config = config;
        this.#isProd = isProd;
        this.#plugins = [];
    }
    async init() {
        this.clearPlugins();
        const config = this.#config;
        const themeConfig = config?.themeConfig || {};
        const enableLastUpdated = themeConfig?.lastUpdated || themeConfig?.locales?.some((locale)=>locale.lastUpdated);
        const mediumZoomConfig = config?.mediumZoom ?? true;
        const haveNavSidebarConfig = themeConfig.nav || themeConfig.sidebar || themeConfig.locales?.[0]?.nav || themeConfig.locales?.[0]?.sidebar;
        if (enableLastUpdated) {
            const { pluginLastUpdated } = await import("@rspress/plugin-last-updated");
            this.addPlugin(pluginLastUpdated());
        }
        if (mediumZoomConfig) {
            const { pluginMediumZoom } = await import("@rspress/plugin-medium-zoom");
            this.addPlugin(pluginMediumZoom('object' == typeof mediumZoomConfig ? mediumZoomConfig : void 0));
        }
        this.addPlugin(pluginContainerSyntax());
        (config.plugins || []).forEach((plugin)=>{
            this.addPlugin(plugin);
        });
        if (!haveNavSidebarConfig) {
            const { pluginAutoNavSidebar } = await __webpack_require__.e("235").then(__webpack_require__.bind(__webpack_require__, "./src/node/auto-nav-sidebar/index.ts"));
            this.addPlugin(pluginAutoNavSidebar());
        }
    }
    addPlugin(plugin) {
        const existedIndex = this.#plugins.findIndex((item)=>item.name === plugin.name);
        if (-1 !== existedIndex) throw new Error(`The plugin "${plugin.name}" has been registered`);
        this.#plugins.push(plugin);
    }
    getPlugins() {
        return this.#plugins;
    }
    clearPlugins() {
        this.#plugins = [];
    }
    removePlugin(pluginName) {
        const index = this.#plugins.findIndex((item)=>item.name === pluginName);
        if (-1 !== index) this.#plugins.splice(index, 1);
    }
    async modifyConfig() {
        let config = this.#config;
        for(let i = 0; i < this.#plugins.length; i++){
            const plugin = this.#plugins[i];
            if ('function' == typeof plugin.config) config = await plugin.config(config || {}, {
                addPlugin: this.addPlugin.bind(this),
                removePlugin: (pluginName)=>{
                    const index = this.#plugins.findIndex((item)=>item.name === pluginName);
                    this.removePlugin(pluginName);
                    if (index <= i && index > 0) i--;
                }
            }, this.#isProd);
        }
        this.#config = config;
        return this.#config;
    }
    async beforeBuild() {
        return this._runParallelAsyncHook('beforeBuild', this.#config || {}, this.#isProd);
    }
    async afterBuild() {
        return this._runParallelAsyncHook('afterBuild', this.#config || {}, this.#isProd);
    }
    async modifySearchIndexData(pages) {
        return this._runParallelAsyncHook('modifySearchIndexData', pages, this.#isProd);
    }
    async extendPageData(pageData) {
        return this._runParallelAsyncHook('extendPageData', pageData, this.#isProd);
    }
    async addPages() {
        const result = await this._runParallelAsyncHook('addPages', this.#config || {}, this.#isProd);
        return result.flat();
    }
    async routeGenerated(routes) {
        return this._runParallelAsyncHook('routeGenerated', routes, this.#isProd);
    }
    async routeServiceGenerated(routeService) {
        return this._runParallelAsyncHook('routeServiceGenerated', routeService, this.#isProd);
    }
    async addRuntimeModules() {
        const result = await this._runParallelAsyncHook('addRuntimeModules', this.#config || {}, this.#isProd);
        return result.reduce((prev, current)=>({
                ...prev,
                ...current
            }), {});
    }
    async addSSGRoutes() {
        const result = await this._runParallelAsyncHook('addSSGRoutes', this.#config || {}, this.#isProd);
        return result.flat();
    }
    globalUIComponents() {
        const result = this.#plugins.map((plugin)=>plugin.globalUIComponents || []);
        return result.flat();
    }
    globalStyles() {
        return this.#plugins.filter((plugin)=>'string' == typeof plugin.globalStyles).map((plugin)=>plugin.globalStyles);
    }
    _runParallelAsyncHook(hookName, ...args) {
        return Promise.all(this.#plugins.filter((plugin)=>'function' == typeof plugin[hookName]).map((plugin)=>plugin[hookName](...args)));
    }
    _runSerialAsyncHook(hookName, ...args) {
        return this.#plugins.reduce(async (prev, plugin)=>{
            if ('function' == typeof plugin[hookName]) {
                await prev;
                return plugin[hookName](...args);
            }
            return prev;
        }, Promise.resolve());
    }
}
var promises_ = __webpack_require__("node:fs/promises");
var external_node_path_ = __webpack_require__("node:path");
var shared_ = __webpack_require__("@rspress/shared");
const PLUGIN_VIRTUAL_MODULE_NAME = 'rsbuild:virtual-module';
const pluginVirtualModule = (pluginOptions = {})=>({
        name: PLUGIN_VIRTUAL_MODULE_NAME,
        async setup (api) {
            const { virtualModules = {}, tempDir: virtualFolderName = '.rsbuild-virtual-module' } = pluginOptions;
            const TEMP_DIR = (0, external_node_path_.join)(api.context.rootPath, 'node_modules', virtualFolderName);
            const virtualFileAbsolutePaths = Object.keys(virtualModules).map((i)=>{
                let absolutePath = (0, external_node_path_.join)(TEMP_DIR, i);
                if (!(0, external_node_path_.extname)(absolutePath)) absolutePath = `${absolutePath}.js`;
                return [
                    i,
                    absolutePath
                ];
            });
            api.modifyRsbuildConfig((config)=>{
                if (!config.source) config.source = {};
                config.source.include = [
                    ...config.source.include || [],
                    TEMP_DIR
                ];
            });
            api.onBeforeCreateCompiler(async ()=>{
                await Promise.all(virtualFileAbsolutePaths.map(async ([_, absolutePath])=>{
                    const dir = (0, external_node_path_.dirname)(absolutePath);
                    await (0, promises_.mkdir)(dir, {
                        recursive: true
                    });
                    return (0, promises_.writeFile)(absolutePath, '', 'utf-8');
                }));
            });
            api.modifyBundlerChain((chain)=>{
                chain.resolve.alias.merge(Object.fromEntries(virtualFileAbsolutePaths));
            });
            for (const [moduleName, absolutePath] of virtualFileAbsolutePaths){
                const handler = virtualModules[moduleName];
                if (handler) api.transform({
                    test: absolutePath
                }, handler);
            }
        }
    });
var package_namespaceObject = JSON.parse('{"i8":"2.0.0-beta.16"}');
const RSPRESS_VERSION = package_namespaceObject.i8;
const isProduction = ()=>'production' === process.env.NODE_ENV;
const importStatementRegex = /import\s+(.*?)\s+from\s+(['"])(.*?)(?:"|');?/gm;
const inlineThemeScript = `{
  const saved = localStorage.getItem('${shared_.APPEARANCE_KEY}')
  const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = !saved || saved === 'auto' ? preferDark : saved === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.classList.toggle('rp-dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}`.replace(/\n/g, ';').replace(/\s{2,}/g, '');
const dirname = external_node_path_["default"].dirname(fileURLToPath(new URL(import.meta.url)));
const PACKAGE_ROOT = external_node_path_["default"].join(dirname, '..');
const TEMPLATE_PATH = external_node_path_["default"].join(PACKAGE_ROOT, 'index.html');
const CSR_CLIENT_ENTRY = external_node_path_["default"].join(PACKAGE_ROOT, 'dist', 'runtime', 'csrClientEntry.js');
const SSR_CLIENT_ENTRY = external_node_path_["default"].join(PACKAGE_ROOT, 'dist', 'runtime', 'ssrClientEntry.js');
const SSR_SERVER_ENTRY = external_node_path_["default"].join(PACKAGE_ROOT, 'dist', 'runtime', 'ssrServerEntry.js');
const OUTPUT_DIR = 'doc_build';
const APP_HTML_MARKER = '<!--<?- DOC_CONTENT ?>-->';
const HEAD_MARKER = '<!--<?- HEAD ?>-->';
const META_GENERATOR = '<!--<?- GENERATOR ?>-->';
const DEFAULT_TITLE = 'Rspress';
const PUBLIC_DIR = 'public';
const constants_TEMP_DIR = external_node_path_["default"].join(process.cwd(), 'node_modules', shared_.RSPRESS_TEMP_DIR);
const NODE_SSG_BUNDLE_FOLDER = '__ssg__';
const NODE_SSG_BUNDLE_NAME = 'rspress-ssg-entry.cjs';
var logger_ = __webpack_require__("@rspress/shared/logger");
async function pathExists(path) {
    try {
        await promises_["default"].access(path);
        return true;
    } catch  {
        return false;
    }
}
async function readJson(path) {
    const raw = await promises_["default"].readFile(path, 'utf8');
    return JSON.parse(raw);
}
const THEME_DEFAULT_EXPORT_PATTERN = /export\s+default\s+\{/;
async function hintThemeBreakingChange(customThemeDir) {
    const fileList = [
        'index.ts',
        'index.tsx',
        'index.js',
        'index.mjs'
    ];
    let useDefaultExportFilePath = null;
    for (const file of fileList){
        const filePath = (0, external_node_path_.join)(customThemeDir, file);
        if (await pathExists(filePath)) {
            const content = await (0, promises_.readFile)(filePath, {
                encoding: 'utf-8'
            });
            if (THEME_DEFAULT_EXPORT_PATTERN.test(content)) useDefaultExportFilePath = filePath;
            break;
        }
    }
    if (useDefaultExportFilePath) logger_.logger.warn(`[Rspress v2] Breaking Change: The "theme/index.tsx" is now using named export instead of default export, please update ${picocolors.greenBright(useDefaultExportFilePath)} (https://github.com/web-infra-dev/rspress/discussions/1891#discussioncomment-12422737).\n`, picocolors.redBright(`
- import Theme from '@rspress/theme-default';
- export default {
-  ...Theme,
-  Layout,
- };
- export * from 'rspress/theme';`) + picocolors.greenBright(`
+ import { Layout } from '@rspress/theme-default';

+ export { Layout };
+ export * from 'rspress/theme';
`));
}
function hintSSGFailed() {
    logger_.logger.info(`[Rspress v2] \`ssg: true\` requires the source code to support SSR. If the code is not compatible to SSR, the build process will fail. You can try:
    1. Fix code to make it SSR-compatible.
    2. Set \`ssg: false\`, but the SSG feature will be lost.`);
}
function hintSSGFalse() {
    logger_.logger.info('`ssg: false` detected, SSG will be disabled.');
}
function hintReactVersion() {
    logger_.logger.info('[Rspress v2] Rspress support React 18 and 19, please confirm that both react and react-dom are installed in package.json with the same version. ');
}
var constants_ = __webpack_require__("@rspress/shared/constants");
const isWindows = 'win32' === node_os.platform();
function slash(p) {
    return p.replace(/\\/g, '/');
}
function normalizePath(id) {
    return external_node_path_["default"].posix.normalize(isWindows ? slash(id) : id);
}
function getPageKey(route) {
    const cleanRoute = (0, shared_.removeLeadingSlash)(route);
    return cleanRoute.replace(/\//g, '_').replace(/\.[^.]+$/, '') || 'index';
}
class RoutePage {
    routeMeta;
    static create(routeMeta) {
        return new RoutePage(routeMeta);
    }
    constructor(routeMeta){
        this.routeMeta = routeMeta;
    }
}
const getRoutePathParts = (routePath, lang, version, langs, versions)=>{
    const hasTrailSlash = routePath.endsWith('/');
    let versionPart = '';
    let langPart = '';
    let purePathPart = '';
    const parts = routePath.split('/').filter(Boolean);
    if (version) {
        const versionToMatch = parts[0];
        if (versions.includes(versionToMatch)) {
            if (versionToMatch !== version) versionPart = versionToMatch;
            parts.shift();
        }
    }
    if (lang) {
        const langToMatch = parts[0];
        if (langs.includes(langToMatch)) {
            if (langToMatch !== lang) langPart = langToMatch;
            parts.shift();
        }
    }
    purePathPart = parts.join('/');
    return [
        versionPart,
        langPart,
        hasTrailSlash ? (0, shared_.addTrailingSlash)(purePathPart) : purePathPart
    ];
};
const normalizeRoutePath = (routePath, base, lang, version, langs, versions, extensions = constants_.DEFAULT_PAGE_EXTENSIONS)=>{
    const [versionPart, langPart, purePathPart] = getRoutePathParts(routePath, lang, version, langs, versions);
    const extensionsWithoutDot = extensions.map((i)=>i.slice(1));
    const cleanExtensionPattern = new RegExp(`\\.(${extensionsWithoutDot.join('|')})$`, 'i');
    const normalizedRoutePath = (0, shared_.addLeadingSlash)([
        versionPart,
        langPart
    ].filter(Boolean).join('/') + (0, shared_.addLeadingSlash)(purePathPart)).replace(cleanExtensionPattern, '').replace(/\.html$/, '').replace(/\/index$/, '/');
    return {
        routePath: (0, shared_.withBase)(normalizedRoutePath, base),
        lang: langPart || lang,
        version: versionPart || version
    };
};
class RouteService {
    routeData = new Map();
    #scanDir;
    #defaultLang;
    #defaultVersion = '';
    #extensions = [];
    #langs = [];
    #versions = [];
    #include = [];
    #exclude = [];
    #base = '';
    #tempDir = '';
    #pluginDriver;
    static async create(options) {
        const { scanDir, config, runtimeTempDir, pluginDriver } = options;
        const routeService = new RouteService(scanDir, config, runtimeTempDir, pluginDriver);
        await routeService.#init();
        await pluginDriver.routeServiceGenerated(routeService);
        return routeService;
    }
    constructor(scanDir, userConfig, tempDir, pluginDriver){
        const routeOptions = userConfig?.route || {};
        this.#scanDir = scanDir;
        this.#extensions = routeOptions.extensions || constants_.DEFAULT_PAGE_EXTENSIONS;
        this.#include = routeOptions.include || [];
        this.#exclude = routeOptions.exclude || [];
        this.#defaultLang = userConfig?.lang || '';
        this.#langs = (userConfig?.locales ?? userConfig?.themeConfig?.locales ?? []).map((item)=>item.lang);
        this.#base = userConfig?.base || '';
        this.#tempDir = tempDir;
        this.#pluginDriver = pluginDriver;
        if (userConfig.multiVersion) {
            this.#defaultVersion = userConfig.multiVersion.default || '';
            this.#versions = userConfig.multiVersion.versions || [];
        }
    }
    get extensions() {
        return this.#extensions;
    }
    async #init() {
        const extensions = this.#extensions.map((i)=>i.slice(1));
        const files = (await glob([
            `**/*.{${extensions.join(',')}}`,
            ...this.#include
        ], {
            cwd: this.#scanDir,
            absolute: true,
            onlyFiles: true,
            ignore: [
                ...this.#exclude,
                '**/node_modules/**',
                '**/.eslintrc.js',
                '**/.nx/**',
                `./${PUBLIC_DIR}/**`
            ]
        })).sort();
        files.forEach((filePath)=>{
            const fileRelativePath = normalizePath(external_node_path_["default"].relative(this.#scanDir, filePath));
            const { routePath, lang, version } = this.normalizeRoutePath(fileRelativePath);
            const absolutePath = external_node_path_["default"].join(this.#scanDir, fileRelativePath);
            const routeMeta = {
                routePath,
                absolutePath: normalizePath(absolutePath),
                relativePath: fileRelativePath,
                pageName: getPageKey(fileRelativePath),
                lang,
                version
            };
            this.addRoute(routeMeta);
        });
        const externalPages = await this.#pluginDriver.addPages();
        await Promise.all(externalPages.map(async (route, index)=>{
            const { routePath, content, filepath } = route;
            if (filepath) {
                const routeMeta = this.#generateRouteMeta(routePath, filepath);
                this.addRoute(routeMeta);
                return;
            }
            if (content) {
                const filepath = await this.#writeTempFile(index, content);
                const routeMeta = this.#generateRouteMeta(routePath, filepath);
                this.addRoute(routeMeta);
            }
        }));
        await this.#pluginDriver.routeGenerated(this.getRoutes());
    }
    async addRoute(routeMeta) {
        const { routePath } = routeMeta;
        if (this.routeData.has(routePath)) throw new Error(`routePath ${routePath} has already been added`);
        const routePage = RoutePage.create(routeMeta);
        this.routeData.set(routePath, routePage);
    }
    removeRoute(filePath) {
        const fileRelativePath = external_node_path_["default"].relative(this.#scanDir, filePath);
        const { routePath } = this.normalizeRoutePath(fileRelativePath);
        this.routeData.delete(routePath);
    }
    getRoutes() {
        return Array.from(this.routeData.values()).map((i)=>i.routeMeta);
    }
    getRoutePages() {
        return Array.from(this.routeData.values());
    }
    isExistRoute(routePath) {
        const { routePath: normalizedRoute } = this.normalizeRoutePath(routePath);
        return Boolean(this.routeData.get(normalizedRoute));
    }
    generateRoutesCode() {
        return this.generateRoutesCodeByRouteMeta(this.getRoutes());
    }
    generateRoutesCodeByRouteMeta(routeMeta) {
        return `
import React from 'react';
import { lazyWithPreload } from "react-lazy-with-preload";
${routeMeta.map((route, index)=>`const Route${index} = lazyWithPreload(() => import('${route.absolutePath}'))`).join('\n')}
export const routes = [
${routeMeta.map((route, index)=>{
            const preload = `async () => {
        await Route${index}.preload();
        return import("${route.absolutePath}");
      }`;
            const component = `Route${index}`;
            return `{ path: '${route.routePath}', element: React.createElement(${component}), filePath: '${route.relativePath}', preload: ${preload}, lang: '${route.lang}', version: '${route.version}' }`;
        }).join(',\n')}
];
`;
    }
    getRoutePathParts(routePath) {
        return getRoutePathParts(routePath, this.#defaultLang, this.#defaultVersion, this.#langs, this.#versions);
    }
    normalizeRoutePath(routePath) {
        return normalizeRoutePath(routePath, this.#base, this.#defaultLang, this.#defaultVersion, this.#langs, this.#versions, this.#extensions);
    }
    async #writeTempFile(index, content) {
        const tempFilePath = external_node_path_["default"].join(this.#tempDir, `temp-${index}.mdx`);
        await promises_["default"].writeFile(tempFilePath, content);
        return tempFilePath;
    }
    #generateRouteMeta(routePath, filepath) {
        const { routePath: normalizedPath, lang, version } = this.normalizeRoutePath(routePath);
        return {
            routePath: normalizedPath,
            absolutePath: normalizePath(filepath),
            relativePath: normalizePath(external_node_path_["default"].relative(this.#scanDir, filepath)),
            pageName: getPageKey(routePath),
            lang,
            version
        };
    }
    getRoutePageByRoutePath(routePath) {
        return this.routeData.get(routePath);
    }
}
var node_utils_ = __webpack_require__("@rspress/shared/node-utils");
let flattenMdxContent_resolver;
let startFlatten = false;
const processor = createProcessor();
const { CachedInputFileSystem, ResolverFactory } = enhanced_resolve;
const fileSystem = node_fs;
async function resolveDepPath(importPath, importer, alias) {
    if (!flattenMdxContent_resolver) flattenMdxContent_resolver = ResolverFactory.createResolver({
        fileSystem: new CachedInputFileSystem(fileSystem, 0),
        extensions: [
            '.mdx',
            '.md'
        ],
        alias
    });
    const resolveResult = await new Promise((resolve, reject)=>{
        flattenMdxContent_resolver.resolve({
            importer
        }, importer, importPath, {}, (err, filePath)=>{
            if (err) return reject(err);
            if (!filePath) return reject(new Error(`Empty result when resolving ${importPath} from ${importer}`));
            return resolve(filePath);
        });
    });
    return resolveResult;
}
async function flattenMdxContent(content, basePath, alias) {
    const deps = [];
    const regex = new RegExp(importStatementRegex);
    if (!regex.test(content)) return {
        flattenContent: content,
        deps
    };
    if (!startFlatten) {
        flattenMdxContent_resolver = ResolverFactory.createResolver({
            fileSystem: new CachedInputFileSystem(fileSystem, 0),
            extensions: [
                '.mdx',
                '.md',
                '.js'
            ],
            alias
        });
        startFlatten = true;
    }
    let ast;
    let result = content;
    try {
        ast = processor.parse(content);
    } catch (e) {
        logger_.logger.debug('flattenMdxContent parse failed: \n', e);
        return {
            flattenContent: content,
            deps
        };
    }
    const importNodes = ast.children.filter((node)=>'mdxjsEsm' === node.type).flatMap((node)=>node.data?.estree?.body || []).filter((node)=>'ImportDeclaration' === node.type);
    for (const importNode of importNodes){
        const id = importNode.specifiers[0].local.name;
        const importPath = importNode.source.value;
        let absoluteImportPath;
        try {
            absoluteImportPath = await resolveDepPath(importPath, external_node_path_["default"].dirname(basePath), alias);
        } catch (_e) {
            continue;
        }
        if (shared_.MDX_OR_MD_REGEXP.test(absoluteImportPath)) {
            const importedContent = node_fs.readFileSync(absoluteImportPath, 'utf-8');
            const { flattenContent: replacedValue, deps: subDeps } = await flattenMdxContent(importedContent, absoluteImportPath, alias);
            result = result.replace(new RegExp(`import\\s+${id}\\s+from\\s+['"](${importPath})['"];?`), '').replace(new RegExp(`<${id}\\s*/>`, 'g'), ()=>replacedValue);
            deps.push(...subDeps, absoluteImportPath);
        }
    }
    return {
        flattenContent: result,
        deps
    };
}
function applyReplaceRules(code = '', replaceRules = []) {
    let result = code;
    for (const rule of replaceRules)result = result.replace(rule.search, rule.replace);
    return result;
}
function applyReplaceRulesToNestedObject(obj, replaceRules) {
    for(const key in obj)if ('string' == typeof obj[key]) obj[key] = applyReplaceRules(obj[key], replaceRules);
    else if ('object' == typeof obj[key] && null !== obj[key]) obj[key] = applyReplaceRulesToNestedObject(obj[key], replaceRules);
    return obj;
}
async function getPageIndexInfoByRoute(route, options) {
    const { alias, domain, replaceRules, root, searchCodeBlocks } = options;
    const defaultIndexInfo = {
        title: '',
        content: '',
        _html: '',
        _flattenContent: '',
        routePath: route.routePath,
        lang: route.lang,
        toc: [],
        domain,
        frontmatter: {},
        version: route.version,
        _filepath: route.absolutePath,
        _relativePath: external_node_path_["default"].relative(root, route.absolutePath).split(external_node_path_["default"].sep).join('/')
    };
    if (!shared_.MDX_OR_MD_REGEXP.test(route.absolutePath)) return defaultIndexInfo;
    let content = await promises_["default"].readFile(route.absolutePath, 'utf8');
    const { frontmatter, content: contentWithoutFrontMatter } = (0, node_utils_.loadFrontMatter)(content, route.absolutePath, root);
    applyReplaceRulesToNestedObject(frontmatter, replaceRules);
    const { flattenContent } = await flattenMdxContent(applyReplaceRules(contentWithoutFrontMatter, replaceRules), route.absolutePath, alias);
    content = flattenContent.replace(importStatementRegex, '');
    const { html: rawHtml, title, toc: rawToc } = await compile({
        value: content,
        filepath: route.absolutePath,
        development: 'production' !== process.env.NODE_ENV,
        root
    });
    function encodeHtml(html) {
        return html.replace(/<code>([\s\S]*?)<\/\s?code>/gm, function(_match, innerContent) {
            return `<code>${innerContent.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
        });
    }
    const html = encodeHtml(String(rawHtml));
    content = htmlToText(html, {
        wordwrap: 80,
        selectors: [
            {
                selector: 'a',
                options: {
                    ignoreHref: true
                }
            },
            {
                selector: 'img',
                format: 'skip'
            },
            {
                selector: 'pre > code',
                format: searchCodeBlocks ? 'block' : 'skip'
            },
            ...[
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6'
            ].map((tag)=>({
                    selector: tag,
                    options: {
                        uppercase: false
                    }
                }))
        ],
        tables: true,
        longWordSplit: {
            forceWrapOnLimit: true
        }
    });
    if (content.startsWith(title)) content = content.slice(title.length);
    const toc = rawToc.map((item)=>{
        const match = item.id.match(/-(\d+)$/);
        let position = -1;
        if (match) for(let i = 0; i < Number(match[1]); i++){
            position = content.indexOf(`\n${item.text}#\n\n`, position + 1);
            if (-1 === position) break;
        }
        return {
            ...item,
            charIndex: content.indexOf(`\n${item.text}#\n\n`, position + 1)
        };
    });
    return {
        ...defaultIndexInfo,
        title: frontmatter.title || title,
        toc,
        content,
        _html: html,
        _flattenContent: flattenContent,
        frontmatter: {
            ...frontmatter,
            __content: void 0
        }
    };
}
async function extractPageData(routeService, options) {
    const pageData = await Promise.all(routeService.getRoutes().map((routeMeta)=>getPageIndexInfoByRoute(routeMeta, options)));
    return pageData;
}
function createHash_createHash(str) {
    return createHash('sha256').update(str).digest('hex').slice(0, 8);
}
var types_RuntimeModuleID = /*#__PURE__*/ function(RuntimeModuleID) {
    RuntimeModuleID["GlobalStyles"] = "virtual-global-styles";
    RuntimeModuleID["GlobalComponents"] = "virtual-global-components";
    RuntimeModuleID["Routes"] = "virtual-routes";
    RuntimeModuleID["SiteData"] = "virtual-site-data";
    RuntimeModuleID["SearchIndexHash"] = "virtual-search-index-hash";
    RuntimeModuleID["I18nText"] = "virtual-i18n-text";
    RuntimeModuleID["SearchHooks"] = "virtual-search-hooks";
    return RuntimeModuleID;
}({});
const DEFAULT_I18N_SOURCE = (0, external_node_path_.join)(process.cwd(), 'i18n.json');
function getI18nData(docConfig) {
    const { i18nSourcePath = DEFAULT_I18N_SOURCE } = docConfig;
    try {
        delete require.cache[i18nSourcePath];
        const i18nSource = require(i18nSourcePath);
        return i18nSource;
    } catch (e) {
        logger_.logger.debug('getI18nData Failed: \n', e);
        return {};
    }
}
const i18nVMPlugin = (context)=>{
    const { config } = context;
    return {
        [types_RuntimeModuleID.I18nText]: ({ addDependency, addMissingDependency })=>{
            addDependency(config.i18nSourcePath || DEFAULT_I18N_SOURCE);
            addMissingDependency(config.i18nSourcePath || DEFAULT_I18N_SOURCE);
            const i18nData = getI18nData(config);
            return `export default ${JSON.stringify(i18nData, null, 2)}`;
        }
    };
};
function normalizeThemeConfig(docConfig) {
    const { locales: siteLocales, base = '', lang, replaceRules = [], multiVersion } = docConfig;
    const { versions = [] } = multiVersion || {};
    const hasMultiVersion = versions.length > 0;
    docConfig.themeConfig = docConfig.themeConfig || {};
    const { themeConfig } = docConfig;
    const locales = siteLocales ?? (themeConfig?.locales || []);
    const i18nTextData = getI18nData(docConfig);
    const normalizeLinkPrefix = (link = '', currentLang = '')=>{
        const normalizedLink = (0, shared_.slash)(link);
        if (!currentLang || !link || (0, shared_.withoutBase)(normalizedLink, base).startsWith(`/${currentLang}`) || (0, shared_.isExternalUrl)(normalizedLink) || hasMultiVersion) return normalizedLink;
        return lang === currentLang ? normalizedLink : `/${currentLang}${(0, shared_.addLeadingSlash)(normalizedLink)}`;
    };
    const getI18nText = (key = '', currentLang = '')=>{
        const text = i18nTextData[key]?.[currentLang];
        return text || key;
    };
    const normalizeSidebar = (sidebar, currentLang = '')=>{
        const normalizedSidebar = {};
        if (!sidebar) return {};
        const normalizeSidebarItem = (item)=>{
            if ('object' == typeof item && 'dividerType' in item) return item;
            if ('object' == typeof item && 'sectionHeaderText' in item) {
                item.sectionHeaderText = applyReplaceRules(getI18nText(item.sectionHeaderText, currentLang), replaceRules);
                return item;
            }
            if ('object' == typeof item && 'items' in item) return {
                ...item,
                text: applyReplaceRules(getI18nText(item.text, currentLang), replaceRules),
                link: normalizeLinkPrefix(item.link),
                collapsed: item.collapsed ?? false,
                collapsible: item.collapsible ?? true,
                tag: item.tag,
                items: item.items.map((subItem)=>normalizeSidebarItem(subItem))
            };
            return {
                ...item,
                text: applyReplaceRules(getI18nText(item.text, currentLang), replaceRules),
                link: normalizeLinkPrefix(item.link),
                tag: item.tag
            };
        };
        const normalizeSidebar = (sidebar)=>{
            Object.keys(sidebar).forEach((key)=>{
                const value = sidebar[key];
                normalizedSidebar[key] = value.map(normalizeSidebarItem);
            });
        };
        normalizeSidebar(sidebar);
        return normalizedSidebar;
    };
    const normalizeNav = (nav, currentLang)=>{
        if (!nav) return [];
        const transformNavItem = (navItem)=>{
            const text = applyReplaceRules(getI18nText(navItem.text, currentLang), replaceRules);
            if ('link' in navItem) return {
                ...navItem,
                text,
                link: normalizeLinkPrefix(navItem.link, currentLang)
            };
            if ('items' in navItem) return {
                ...navItem,
                text,
                items: navItem.items.map((item)=>({
                        ...item,
                        text: applyReplaceRules(getI18nText(item.text, currentLang), replaceRules),
                        link: normalizeLinkPrefix(item.link, currentLang)
                    }))
            };
            return navItem;
        };
        if (Array.isArray(nav)) return nav.map(transformNavItem);
        return Object.entries(nav).reduce((acc, [key, value])=>{
            acc[key] = value.map(transformNavItem);
            return acc;
        }, {});
    };
    if (locales.length) themeConfig.locales = locales.map(({ lang: currentLang, label })=>{
        const localeInThemeConfig = themeConfig.locales?.find((locale)=>locale.lang === currentLang);
        return {
            lang: currentLang,
            label,
            ...localeInThemeConfig || {},
            sidebar: normalizeSidebar(localeInThemeConfig?.sidebar ?? themeConfig.sidebar, currentLang),
            nav: normalizeNav(localeInThemeConfig?.nav ?? themeConfig.nav, currentLang)
        };
    });
    else {
        themeConfig.sidebar = normalizeSidebar(themeConfig?.sidebar);
        themeConfig.nav = normalizeNav(themeConfig?.nav);
    }
    return themeConfig;
}
function deletePrivateField(obj) {
    if ('object' != typeof obj || null === obj) return obj;
    const newObj = {
        ...obj
    };
    for(const key in newObj)if (key.startsWith('_')) delete newObj[key];
    return newObj;
}
async function siteDataVMPlugin(context) {
    const { config, alias, userDocRoot, routeService, pluginDriver } = context;
    const userConfig = config;
    const tempSearchObj = Object.assign({}, userConfig.search);
    if (tempSearchObj) tempSearchObj.searchHooks = void 0;
    const replaceRules = userConfig?.replaceRules || [];
    const searchConfig = userConfig?.search || {};
    const domain = searchConfig?.mode === 'remote' ? searchConfig.domain ?? '' : '';
    const searchCodeBlocks = 'codeBlocks' in searchConfig ? Boolean(searchConfig.codeBlocks) : true;
    const pages = await extractPageData(routeService, {
        replaceRules,
        alias,
        domain,
        root: userDocRoot,
        searchCodeBlocks
    });
    await pluginDriver.modifySearchIndexData(pages);
    const versioned = userConfig.search && 'remote' !== userConfig.search.mode && userConfig.search.versioned;
    const groupedPages = groupBy(pages, (page)=>{
        if (page.frontmatter?.pageType === 'home') return 'noindex';
        const version = versioned ? page.version : '';
        const lang = page.lang || '';
        return `${version}###${lang}`;
    });
    delete groupedPages.noindex;
    const indexHashByGroup = {};
    await Promise.all(Object.keys(groupedPages).map(async (group)=>{
        const stringifiedIndex = JSON.stringify(groupedPages[group].map(deletePrivateField));
        const indexHash = createHash_createHash(stringifiedIndex);
        indexHashByGroup[group] = indexHash;
        const [version, lang] = group.split('###');
        const indexVersion = version ? `.${version.replace('.', '_')}` : '';
        const indexLang = lang ? `.${lang}` : '';
        await promises_["default"].mkdir(constants_TEMP_DIR, {
            recursive: true
        });
        await promises_["default"].writeFile(external_node_path_["default"].join(constants_TEMP_DIR, `${shared_.SEARCH_INDEX_NAME}${indexVersion}${indexLang}.${indexHash}.json`), stringifiedIndex);
    }));
    await Promise.all(pages.map(async (pageData)=>pluginDriver.extendPageData(pageData)));
    const siteData = {
        title: userConfig?.title || '',
        description: userConfig?.description || '',
        icon: (0, node_utils_.getIconUrlPath)(userConfig?.icon) || '',
        route: userConfig?.route || {},
        themeConfig: normalizeThemeConfig(userConfig),
        base: userConfig?.base || '/',
        lang: userConfig?.lang || '',
        locales: userConfig?.locales || userConfig.themeConfig?.locales || [],
        logo: userConfig?.logo || '',
        logoText: userConfig?.logoText || '',
        ssg: Boolean(userConfig?.ssg ?? true),
        multiVersion: {
            default: userConfig?.multiVersion?.default || '',
            versions: userConfig?.multiVersion?.versions || []
        },
        search: tempSearchObj ?? {
            mode: 'local'
        },
        pages: pages.map((page)=>{
            const { content, domain, _filepath, _html, _flattenContent, ...rest } = page;
            return isProduction() ? rest : {
                ...rest,
                _filepath
            };
        }),
        markdown: {
            showLineNumbers: userConfig?.markdown?.showLineNumbers ?? false,
            defaultWrapCode: userConfig?.markdown?.defaultWrapCode ?? false,
            shiki: {}
        }
    };
    return {
        [`${types_RuntimeModuleID.SiteData}.mjs`]: `export default ${JSON.stringify(siteData, null, 2)}`,
        [types_RuntimeModuleID.SearchIndexHash]: `export default ${JSON.stringify(indexHashByGroup, null, 2)}`
    };
}
const runtimeModuleFactory = [
    siteDataVMPlugin
];
function rsbuildPluginDocVM(factoryContext) {
    return {
        name: 'rsbuild-plugin-doc-vm',
        setup (api) {
            api.modifyBundlerChain(async (bundlerChain)=>{
                const alias = bundlerChain.resolve.alias.entries();
                const runtimeModule = {};
                for (const factory of runtimeModuleFactory){
                    const moduleResult = await factory({
                        ...factoryContext,
                        alias: alias
                    });
                    Object.assign(runtimeModule, moduleResult);
                }
                bundlerChain.plugin('rspress-runtime-module').use(new RspackVirtualModulePlugin(runtimeModule));
            });
        }
    };
}
async function getVirtualModulesFromPlugins(pluginDriver) {
    const runtimeModule = {};
    const modulesByPlugin = await pluginDriver.addRuntimeModules();
    Object.keys(modulesByPlugin).forEach((key)=>{
        if (runtimeModule[key]) throw new Error(`The runtime module ${key} is duplicated, please check your plugin`);
        runtimeModule[key] = ()=>modulesByPlugin[key];
    });
    return runtimeModule;
}
const globalStylesVMPlugin = (context)=>({
        [types_RuntimeModuleID.GlobalStyles]: ()=>{
            const { config, pluginDriver } = context;
            const globalStylesByPlugins = pluginDriver.globalStyles();
            const moduleContent = [
                config?.globalStyles,
                ...globalStylesByPlugins
            ].filter(Boolean).map((source)=>`import ${JSON.stringify(source)};`).join('');
            return moduleContent;
        }
    });
const globalUIComponentsVMPlugin = (context)=>({
        [types_RuntimeModuleID.GlobalComponents]: ()=>{
            const { config, pluginDriver } = context;
            let index = 0;
            const globalUIComponentsByPlugins = pluginDriver.globalUIComponents();
            const globalComponents = [
                ...config?.globalUIComponents || [],
                ...globalUIComponentsByPlugins
            ];
            const moduleContent = globalComponents.map((source)=>{
                const name = `Comp_${index}`;
                if (Array.isArray(source)) return `import ${name} from ${JSON.stringify(source[0])};
const Props_${index++} = ${JSON.stringify(source[1])};\n`;
                index++;
                return `import ${name} from ${JSON.stringify(source)};\n`;
            }).concat(`export default [${Array.from({
                length: index
            }, (_, i)=>{
                if (Array.isArray(globalComponents[i])) return `[Comp_${i}, Props_${i}]`;
                return `Comp_${i}`;
            }).join(', ')}];`).join('');
            return moduleContent;
        }
    });
const routeListVMPlugin = (context)=>{
    const { routeService } = context;
    return {
        [types_RuntimeModuleID.Routes]: ()=>routeService.generateRoutesCode()
    };
};
const searchHookVMPlugin = (context)=>({
        [`${types_RuntimeModuleID.SearchHooks}`]: ()=>{
            const { config } = context;
            let content = 'export const onSearch = () => {};';
            if ('object' == typeof config.search && 'string' == typeof config.search.searchHooks) content = `export * from '${config.search.searchHooks}'`;
            return content;
        }
    });
async function writeSearchIndex(config) {
    if (config?.search === false) return;
    const cwd = process.cwd();
    const searchIndexFiles = await promises_["default"].readdir(constants_TEMP_DIR);
    const outDir = config?.outDir ?? (0, external_node_path_.join)(cwd, OUTPUT_DIR);
    const targetDir = (0, external_node_path_.join)(outDir, 'static');
    await promises_["default"].mkdir(targetDir, {
        recursive: true
    });
    let searchIndexData = '[]';
    let scanning = false;
    for (const searchIndexFile of searchIndexFiles){
        if (!searchIndexFile.includes(shared_.SEARCH_INDEX_NAME) || !searchIndexFile.endsWith('.json')) continue;
        const source = (0, external_node_path_.join)(constants_TEMP_DIR, searchIndexFile);
        const target = (0, external_node_path_.join)(targetDir, searchIndexFile);
        const searchIndex = await promises_["default"].readFile((0, external_node_path_.join)(constants_TEMP_DIR, searchIndexFile), 'utf-8');
        searchIndexData = `${searchIndexData.slice(0, -1)}${scanning ? ',' : ''}${searchIndex.slice(1)}`;
        await promises_["default"].rename(source, target);
        scanning = true;
    }
    if (isProduction() && (0, shared_.isSCM)() && config?.search?.mode === 'remote') {
        const { apiUrl, indexName } = config.search;
        try {
            await fetch(`${apiUrl}?index=${indexName}`, {
                method: 'PUT',
                body: searchIndexData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            logger_.logger.info(picocolors.green(`[doc-tools] Search index uploaded to ${apiUrl}, indexName: ${indexName}`));
        } catch (e) {
            logger_.logger.info(picocolors.red(`[doc-tools] Upload search index \`${indexName}\` failed:\n ${e}`));
        }
    }
}
function serveSearchIndexMiddleware(config) {
    return (req, res, next)=>{
        const searchIndexRequestMatch = `/${shared_.SEARCH_INDEX_NAME}.`;
        if (req.url?.includes(searchIndexRequestMatch)) {
            res.setHeader('Content-Type', 'application/json');
            const outDir = config?.outDir ?? (0, external_node_path_.join)(process.cwd(), OUTPUT_DIR);
            const searchIndexFile = req.url.split('/').pop();
            createReadStream((0, external_node_path_.join)(outDir, 'static', searchIndexFile), 'utf-8').pipe(res, {
                end: true
            });
        } else next?.();
    };
}
async function pMap(iterable, mapper, { concurrency = Number.POSITIVE_INFINITY, stopOnError = true, signal } = {}) {
    return new Promise((resolve_, reject_)=>{
        if (void 0 === iterable[Symbol.iterator] && void 0 === iterable[Symbol.asyncIterator]) throw new TypeError(`Expected \`input\` to be either an \`Iterable\` or \`AsyncIterable\`, got (${typeof iterable})`);
        if ('function' != typeof mapper) throw new TypeError('Mapper function is required');
        if (!(Number.isSafeInteger(concurrency) && concurrency >= 1 || concurrency === Number.POSITIVE_INFINITY)) throw new TypeError(`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`);
        const result = [];
        const errors = [];
        const skippedIndexesMap = new Map();
        let isRejected = false;
        let isResolved = false;
        let isIterableDone = false;
        let resolvingCount = 0;
        let currentIndex = 0;
        const iterator = void 0 === iterable[Symbol.iterator] ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
        const signalListener = ()=>{
            reject(signal.reason);
        };
        const cleanup = ()=>{
            signal?.removeEventListener('abort', signalListener);
        };
        const resolve = (value)=>{
            resolve_(value);
            cleanup();
        };
        const reject = (reason)=>{
            isRejected = true;
            isResolved = true;
            reject_(reason);
            cleanup();
        };
        if (signal) {
            if (signal.aborted) reject(signal.reason);
            signal.addEventListener('abort', signalListener, {
                once: true
            });
        }
        const next = async ()=>{
            if (isResolved) return;
            const nextItem = await iterator.next();
            const index = currentIndex;
            currentIndex++;
            if (nextItem.done) {
                isIterableDone = true;
                if (0 === resolvingCount && !isResolved) {
                    if (!stopOnError && errors.length > 0) return void reject(new AggregateError(errors));
                    isResolved = true;
                    if (0 === skippedIndexesMap.size) return void resolve(result);
                    const pureResult = [];
                    for (const [index, value] of result.entries())if (skippedIndexesMap.get(index) !== pMapSkip) pureResult.push(value);
                    resolve(pureResult);
                }
                return;
            }
            resolvingCount++;
            (async ()=>{
                try {
                    const element = await nextItem.value;
                    if (isResolved) return;
                    const value = await mapper(element, index);
                    if (value === pMapSkip) skippedIndexesMap.set(index, value);
                    result[index] = value;
                    resolvingCount--;
                    await next();
                } catch (error) {
                    if (stopOnError) reject(error);
                    else {
                        errors.push(error);
                        resolvingCount--;
                        try {
                            await next();
                        } catch (error) {
                            reject(error);
                        }
                    }
                }
            })();
        };
        (async ()=>{
            for(let index = 0; index < concurrency; index++){
                try {
                    await next();
                } catch (error) {
                    reject(error);
                    break;
                }
                if (isIterableDone || isRejected) break;
            }
        })();
    });
}
const pMapSkip = Symbol('skip');
async function renderConfigHead(config, route) {
    if (!isRouteMeta(route)) return '';
    if (!config.head || 0 === config.head.length) return '';
    return config.head.map((head)=>{
        if ('string' == typeof head) return head;
        if ('function' == typeof head) {
            const resultHead = head(route);
            if (!resultHead) return '';
            if ('string' == typeof resultHead) return resultHead;
            return `<${resultHead[0]} ${renderAttrs(resultHead[1])}>`;
        }
        return `<${head[0]} ${renderAttrs(head[1])}>`;
    }).join('');
}
function renderAttrs(attrs) {
    return Object.entries(attrs).map(([key, value])=>{
        if ('boolean' == typeof value) return key;
        if ('string' == typeof value || 'number' == typeof value) return `${key}="${value}"`;
        throw new Error(`Invalid value for attribute ${key}:${JSON.stringify(value)}`);
    }).join('');
}
function isRouteMeta(route) {
    return !!route && 'object' == typeof route && 'routePath' in route && 'absolutePath' in route;
}
async function renderPages(routeService, config, pluginDriver, ssrBundlePath, htmlTemplate, emitAsset) {
    logger_.logger.info('Rendering pages...');
    const startTime = Date.now();
    let render;
    try {
        const { default: ssrExports } = await import(pathToFileURL(ssrBundlePath).toString());
        render = await ssrExports.render;
    } catch (e) {
        if (e instanceof Error) {
            logger_.logger.error(`Failed to load SSG bundle: ${picocolors.yellow(ssrBundlePath)}: ${e.message}`);
            logger_.logger.debug(e);
            hintSSGFailed();
        }
        throw e;
    }
    try {
        const routes = routeService.getRoutes();
        const base = config?.base ?? '';
        const additionalRoutes = (await pluginDriver.addSSGRoutes()).map((route)=>({
                routePath: (0, shared_.withBase)(route.path, base)
            }));
        const allRoutes = [
            ...routes,
            ...additionalRoutes
        ];
        const is404RouteInRoutes = allRoutes.some((route)=>'/404' === route.routePath);
        if (!is404RouteInRoutes) allRoutes.push({
            routePath: '/404'
        });
        const filteredRoutes = allRoutes.filter((route)=>!route.routePath.includes(':'));
        await pMap(filteredRoutes, async (route)=>{
            const head = createHead();
            const { routePath } = route;
            let appHtml = '';
            if (render) try {
                ({ appHtml } = await render(routePath, head));
            } catch (e) {
                if (e instanceof Error) {
                    logger_.logger.error(`Page "${picocolors.yellow(routePath)}" SSG rendering failed.\n    ${picocolors.gray(e.toString())}`);
                    throw e;
                }
            }
            const replacedHtmlTemplate = htmlTemplate.replace(/<title>(.*?)<\/title>/gi, '').replace(APP_HTML_MARKER, ()=>appHtml).replace(META_GENERATOR, ()=>`<meta name="generator" content="Rspress v${RSPRESS_VERSION}">`).replace(HEAD_MARKER, [
                await renderConfigHead(config, route)
            ].join(''));
            const html = await transformHtmlTemplate(head, replacedHtmlTemplate);
            const normalizeHtmlFilePath = (path)=>{
                const normalizedBase = `${(0, shared_.normalizeSlash)(config?.base || '/')}/`;
                if (path.endsWith('/')) return `${path}index.html`.replace(normalizedBase, '');
                return `${path}.html`.replace(normalizedBase, '');
            };
            const fileName = normalizeHtmlFilePath(routePath);
            emitAsset(fileName, html);
        }, {
            concurrency: process.env.RSPRESS_SSG_CONCURRENCY ? Number.parseInt(process.env.RSPRESS_SSG_CONCURRENCY, 10) : 32
        });
        const totalTime = Date.now() - startTime;
        logger_.logger.success(`Pages rendered in ${picocolors.yellow(totalTime)} ms.`);
    } catch (e) {
        if (e instanceof Error) {
            logger_.logger.error(`Pages render error: ${e.message}`);
            logger_.logger.debug(e);
            hintSSGFailed();
        }
        throw e;
    }
}
const rsbuildPluginSSG = ({ routeService, config, pluginDriver })=>({
        name: 'rspress-inner-rsbuild-plugin-ssg',
        async setup (api) {
            api.onBeforeBuild(()=>{
                let htmlTemplate = '';
                const indexHtmlEmittedInWeb = new Promise((resolve, reject)=>{
                    api.processAssets({
                        stage: 'report',
                        targets: [
                            'web'
                        ]
                    }, ({ assets, compilation, environment })=>{
                        if ('web' !== environment.name) return;
                        for (const [assetName, assetSource] of Object.entries(assets))if ('index.html' === assetName) {
                            htmlTemplate = assetSource.source().toString();
                            compilation.deleteAsset(assetName);
                            resolve();
                            break;
                        }
                        reject();
                    });
                }).catch(()=>{
                    const message = 'SSG requires an `index.html` as entry, but this file is not emitted successfully in the web target.';
                    logger_.logger.error(message);
                    const error = new Error(message);
                    throw error;
                });
                api.processAssets({
                    stage: 'optimize-transfer',
                    targets: [
                        'node'
                    ]
                }, async ({ assets, compilation, environment, compiler })=>{
                    if ('node' !== environment.name) return;
                    const distPath = environment.distPath;
                    const ssgFolderPath = (0, external_node_path_.join)(distPath, NODE_SSG_BUNDLE_FOLDER);
                    const mainCjsAbsolutePath = (0, external_node_path_.join)(ssgFolderPath, NODE_SSG_BUNDLE_NAME);
                    await (0, promises_.mkdir)(ssgFolderPath, {
                        recursive: true
                    });
                    await Promise.all(Object.entries(assets).map(async ([assetName, assetSource])=>{
                        if (assetName.startsWith(`${NODE_SSG_BUNDLE_FOLDER}/`)) {
                            const fileAbsolutePath = (0, external_node_path_.join)(distPath, assetName);
                            await (0, promises_.writeFile)(fileAbsolutePath, assetSource.source().toString());
                            compilation.deleteAsset(assetName);
                        }
                    }));
                    const emitAsset = (assetName, content)=>{
                        compilation.emitAsset(assetName, new compiler.webpack.sources.RawSource(content));
                    };
                    await indexHtmlEmittedInWeb;
                    await renderPages(routeService, config, pluginDriver, mainCjsAbsolutePath, htmlTemplate, emitAsset);
                    if (!(0, shared_.isDebugMode)()) await (0, promises_.rm)(ssgFolderPath, {
                        recursive: true
                    });
                });
            });
        }
    });
const { CachedInputFileSystem: detectReactVersion_CachedInputFileSystem, ResolverFactory: detectReactVersion_ResolverFactory } = enhanced_resolve;
async function detectPackageMajorVersion(name) {
    const cwd = process.cwd();
    const pkgPath = external_node_path_["default"].join(cwd, 'node_modules', name);
    if (await pathExists(pkgPath)) {
        const pkgJson = await readJson(external_node_path_["default"].join(pkgPath, 'package.json'));
        const version = Number(pkgJson.version?.split('.')[0]);
        return version;
    }
}
const DEFAULT_REACT_VERSION = 19;
async function detectReactVersion() {
    return await detectPackageMajorVersion('react') ?? DEFAULT_REACT_VERSION;
}
async function resolveReactRouterDomAlias() {
    const alias = {};
    const resolver = detectReactVersion_ResolverFactory.createResolver({
        fileSystem: new detectReactVersion_CachedInputFileSystem(node_fs, 0),
        mainFields: [
            'browser',
            'module',
            'main'
        ],
        extensions: [
            '.js'
        ],
        alias
    });
    try {
        const pkgPath = await new Promise((resolve, reject)=>{
            resolver.resolve({
                importer: PACKAGE_ROOT
            }, PACKAGE_ROOT, 'react-router-dom', {}, (err, filePath)=>{
                if (err || !filePath) return reject(err);
                return resolve(filePath);
            });
        });
        return {
            'react-router-dom': pkgPath
        };
    } catch (e) {
        logger_.logger.warn('react-router-dom not found: \n', e);
    }
    return {};
}
async function resolveReactAlias(reactVersion, isSSR) {
    const basedir = reactVersion === DEFAULT_REACT_VERSION ? PACKAGE_ROOT : process.cwd();
    const libPaths = [
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom',
        'react-dom/client',
        'react-dom/server'
    ];
    const alias = {};
    const resolver = detectReactVersion_ResolverFactory.createResolver({
        fileSystem: new detectReactVersion_CachedInputFileSystem(node_fs, 0),
        extensions: [
            '.js'
        ],
        alias,
        conditionNames: isSSR ? [
            '...'
        ] : [
            'browser',
            '...'
        ]
    });
    await Promise.all(libPaths.map(async (lib)=>{
        try {
            alias[lib] = await new Promise((resolve, reject)=>{
                resolver.resolve({
                    importer: basedir
                }, basedir, lib, {}, (err, filePath)=>{
                    if (err || !filePath) return reject(err);
                    return resolve(filePath);
                });
            });
        } catch (e) {
            if (e instanceof Error) {
                logger_.logger.warn(`${lib} not found: \n    ${picocolors.gray(e.toString())}`);
                hintReactVersion();
            }
        }
    }));
    return alias;
}
const detectCustomIcon = async (customThemeDir)=>{
    const assetsDir = external_node_path_["default"].join(customThemeDir, 'assets');
    const alias = {};
    if (!existsSync(assetsDir)) return alias;
    const files = await glob('*.svg', {
        cwd: assetsDir
    });
    files.forEach((file)=>{
        const name = external_node_path_["default"].basename(file, '.svg');
        alias[`@theme-assets/${name}`] = external_node_path_["default"].join(assetsDir, file);
    });
    return alias;
};
const presetIcons = {
    discord: '<path fill="currentColor" d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.3 18.3 0 0 0-5.487 0a13 13 0 0 0-.617-1.25a.08.08 0 0 0-.079-.037A19.7 19.7 0 0 0 3.677 4.37a.1.1 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.08.08 0 0 0 .084-.028a14 14 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13 13 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10 10 0 0 0 .372-.292a.07.07 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .078.01q.181.149.373.292a.077.077 0 0 1-.006.127a12.3 12.3 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.08.08 0 0 0 .084.028a19.8 19.8 0 0 0 6.002-3.03a.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03M8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418m7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418"/>',
    facebook: '<path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978c.401 0 .955.042 1.468.103a9 9 0 0 1 1.141.195v3.325a9 9 0 0 0-.653-.036a27 27 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.7 1.7 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103l-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647"/>',
    github: '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
    gitlab: '<path fill="currentColor" d="m23.6 9.593l-.033-.086L20.3.98a.85.85 0 0 0-.336-.405a.875.875 0 0 0-1 .054a.9.9 0 0 0-.29.44L16.47 7.818H7.537L5.333 1.07a.86.86 0 0 0-.29-.441a.875.875 0 0 0-1-.054a.86.86 0 0 0-.336.405L.433 9.502l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.009l.03.021l4.977 3.727l2.462 1.863l1.5 1.132a1.01 1.01 0 0 0 1.22 0l1.499-1.132l2.461-1.863l5.006-3.75l.013-.01a6.07 6.07 0 0 0 2.01-7.002"/>',
    instagram: '<path fill="currentColor" d="M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388a5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947s.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911c.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552c1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388a5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912c.056-1.28.07-1.69.063-4.948c-.006-3.258-.02-3.667-.081-4.947c-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123a5.9 5.9 0 0 0-2.128-1.38c-.764-.294-1.636-.496-2.914-.55C15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895a3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228c-.06-1.264-.072-1.644-.08-4.848c-.006-3.204.006-3.583.061-4.848c.05-1.169.246-1.805.408-2.228c.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417c1.265-.06 1.644-.072 4.848-.08c3.203-.006 3.583.006 4.85.062c1.168.05 1.804.244 2.227.408c.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227c.06 1.265.074 1.645.08 4.848c.005 3.203-.006 3.583-.061 4.848c-.051 1.17-.245 1.805-.408 2.23c-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418c-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442a1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024a6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16A4 4 0 0 1 8 12.008"/>',
    linkedin: '<path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.06 2.06 0 0 1-2.063-2.065a2.064 2.064 0 1 1 2.063 2.065m1.782 13.019H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>',
    slack: '<path fill="currentColor" d="M5.042 15.165a2.53 2.53 0 0 1-2.52 2.523A2.53 2.53 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52a2.527 2.527 0 0 1 2.521 2.52v6.313A2.53 2.53 0 0 1 8.834 24a2.53 2.53 0 0 1-2.521-2.522zM8.834 5.042a2.53 2.53 0 0 1-2.521-2.52A2.53 2.53 0 0 1 8.834 0a2.53 2.53 0 0 1 2.521 2.522v2.52zm0 1.271a2.53 2.53 0 0 1 2.521 2.521a2.53 2.53 0 0 1-2.521 2.521H2.522A2.53 2.53 0 0 1 0 8.834a2.53 2.53 0 0 1 2.522-2.521zm10.122 2.521a2.53 2.53 0 0 1 2.522-2.521A2.53 2.53 0 0 1 24 8.834a2.53 2.53 0 0 1-2.522 2.521h-2.522zm-1.268 0a2.53 2.53 0 0 1-2.523 2.521a2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.53 2.53 0 0 1 2.523 2.522zm-2.523 10.122a2.53 2.53 0 0 1 2.523 2.522A2.53 2.53 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522zm0-1.268a2.527 2.527 0 0 1-2.52-2.523a2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.53 2.53 0 0 1-2.522 2.523z"/>',
    youtube: '<path fill="currentColor" d="M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z"/>',
    juejin: '<path fill="currentColor" d="m12 14.316l7.454-5.88l-2.022-1.625L12 11.1l-.004.003l-5.432-4.288l-2.02 1.624l7.452 5.88Zm0-7.247l2.89-2.298L12 2.453l-.004-.005l-2.884 2.318l2.884 2.3Zm0 11.266l-.005.002l-9.975-7.87L0 12.088l.194.156l11.803 9.308l7.463-5.885L24 12.085l-2.023-1.624Z"/>',
    qq: '<path fill="currentColor" d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673c.54.065 2.103-2.472 2.103-2.472c0 1.469.756 3.387 2.394 4.771c-.612.188-1.363.479-1.845.835c-.434.32-.379.646-.301.778c.343.578 5.883.369 7.482.189c1.6.18 7.14.389 7.483-.189c.078-.132.132-.458-.301-.778c-.483-.356-1.233-.646-1.846-.836c1.637-1.384 2.393-3.302 2.393-4.771c0 0 1.563 2.537 2.103 2.472c.251-.03.581-1.39-.438-4.673"/>',
    wechat: '<path fill="currentColor" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213c0 .163.13.295.29.295a.33.33 0 0 0 .167-.054l1.903-1.114a.86.86 0 0 1 .717-.098a10.2 10.2 0 0 0 2.837.403c.276 0 .543-.027.811-.05c-.857-2.578.157-4.972 1.932-6.446c1.703-1.415 3.882-1.98 5.853-1.838c-.576-3.583-4.196-6.348-8.596-6.348M5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178a1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18m5.34 2.867c-1.797-.052-3.746.512-5.28 1.786c-1.72 1.428-2.687 3.72-1.78 6.22c.942 2.453 3.666 4.229 6.884 4.229c.826 0 1.622-.12 2.361-.336a.72.72 0 0 1 .598.082l1.584.926a.3.3 0 0 0 .14.047c.134 0 .24-.111.24-.247c0-.06-.023-.12-.038-.177l-.327-1.233a.6.6 0 0 1-.023-.156a.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983a.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983a.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982"/>',
    weibo: '<path fill="currentColor" d="M17.525 11.378c1.263.392 2.669 1.336 2.669 3.004c0 2.763-3.98 6.239-9.964 6.239c-4.565 0-9.23-2.213-9.23-5.852c0-1.902 1.204-4.102 3.277-6.177c2.773-2.77 6.004-4.033 7.219-2.816c.537.537.588 1.464.244 2.572c-.178.557.525.25.525.25c2.24-.938 4.196-.994 4.909.027c.38.543.343 1.306-.008 2.19c-.163.407.048.471.36.563zm-7.282 7.939c3.641-.362 6.401-2.592 6.167-4.983c-.237-2.391-3.382-4.038-7.023-3.677c-3.64.36-6.403 2.59-6.167 4.98c.237 2.394 3.382 4.039 7.023 3.68zM6.16 14.438c.754-1.527 2.712-2.39 4.446-1.94c1.793.463 2.707 2.154 1.976 3.8c-.744 1.682-2.882 2.578-4.695 1.993c-1.752-.566-2.493-2.294-1.727-3.853zm1.446 2.587c.568.257 1.325.013 1.676-.55c.346-.568.163-1.217-.407-1.459c-.563-.237-1.291.008-1.64.553c-.354.547-.189 1.202.371 1.456zm2.206-1.808c.219.092.501-.012.628-.231c.123-.22.044-.466-.178-.548c-.216-.084-.486.018-.613.232c-.123.214-.054.458.163.547zM19.873 9.5a.725.725 0 1 1-1.378-.451a1.38 1.38 0 0 0-.288-1.357a1.395 1.395 0 0 0-1.321-.425a.723.723 0 1 1-.303-1.416a2.836 2.836 0 0 1 3.29 3.649zm-3.916-6.575A5.831 5.831 0 0 1 21.5 4.72a5.836 5.836 0 0 1 1.22 5.704a.838.838 0 0 1-1.06.54a.844.844 0 0 1-.542-1.062a4.143 4.143 0 0 0-4.807-5.327a.845.845 0 0 1-.354-1.65z"/>',
    zhihu: '<path fill="currentColor" d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0zm1.964 4.078q-.408 1.096-.68 2.11h4.587c.545-.006.445 1.168.445 1.171H9.384a58 58 0 0 1-.112 3.797h2.712c.388.023.393 1.251.393 1.266H9.183a9.2 9.2 0 0 1-.408 2.102l.757-.604c.452.456 1.512 1.712 1.906 2.177c.473.681.063 2.081.063 2.081l-2.794-3.382c-.653 2.518-1.845 3.607-1.845 3.607c-.523.468-1.58.82-2.64.516c2.218-1.73 3.44-3.917 3.667-6.497H4.491c0-.015.197-1.243.806-1.266h2.71c.024-.32.086-3.254.086-3.797H6.598c-.136.406-.158.447-.268.753c-.594 1.095-1.603 1.122-1.907 1.155c.906-1.821 1.416-3.6 1.591-4.064c.425-1.124 1.671-1.125 1.671-1.125M13.078 6h6.377v11.33h-2.573l-2.184 1.373l-.401-1.373h-1.219zm1.313 1.219v8.86h.623l.263.937l1.455-.938h1.456v-8.86z"/>',
    bilibili: '<path fill="currentColor" d="M17.813 4.653h.854q2.266.08 3.773 1.574Q23.946 7.72 24 9.987v7.36q-.054 2.266-1.56 3.773c-1.506 1.507-2.262 1.524-3.773 1.56H5.333q-2.266-.054-3.773-1.56C.053 19.614.036 18.858 0 17.347v-7.36q.054-2.267 1.56-3.76t3.773-1.574h.774l-1.174-1.12a1.23 1.23 0 0 1-.373-.906q0-.534.373-.907l.027-.027q.4-.373.92-.373t.92.373L9.653 4.44q.107.106.187.213h4.267a.8.8 0 0 1 .16-.213l2.853-2.747q.4-.373.92-.373c.347 0 .662.151.929.4s.391.551.391.907q0 .532-.373.906zM5.333 7.24q-1.12.027-1.88.773q-.76.748-.786 1.894v7.52q.026 1.146.786 1.893t1.88.773h13.334q1.12-.026 1.88-.773t.786-1.893v-7.52q-.026-1.147-.786-1.894t-1.88-.773zM8 11.107q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q0-.56.386-.947q.387-.386.947-.386m8 0q.56 0 .933.373q.375.374.4.96v1.173q-.025.586-.4.96q-.373.375-.933.374c-.56-.001-.684-.125-.933-.374q-.375-.373-.4-.96V12.44q.025-.586.4-.96q.373-.373.933-.373"/>',
    lark: `<path d="M8.813 5.477c1.038.836 2.286 2.045 3.3 3.495.171.23.377.576.457.71l.034.056a8.803 8.803 0 0 0-.922 1.3l-.271-.494C9.655 7.53 6.3 5.477 6.137 5.377a.447.447 0 0 1-.006-.004l-.666-.393-.107-.086a.499.499 0 0 1 .306-.885L6.084 4h7.997c.159.006.318.037.47.092.174.064.317.174.458.308.134.143.272.296.403.448.622.675 1.324 1.688 1.324 1.688-.573.193-1.349.736-1.349.736a5.095 5.095 0 0 0-.348-.54 20.665 20.665 0 0 0-1.037-1.255H8.813Z" fill="currentColor"/>
  <path d="M18.482 7.507a5.42 5.42 0 0 1 4.04.717c.248.168.788.635.242 1.233-1.7 1.67-2.194 3.225-2.63 4.599-.278.873-.541 1.697-1.066 2.424-1.813 2.508-4.114 4-6.837 4.434-.561.089-1.132.131-1.7.131-3.958 0-7.498-2.035-8.75-2.844h.003l-.161-.107c-.534-.378-.61-.723-.623-.989V7.055a.486.486 0 0 1 .827-.317l.482.589c5.082 6.201 9.126 8.063 11.626 8.53 2.246.424 3.631-.165 4.022-.37.333-.51.534-1.143.764-1.865l.006-.021c.406-1.276.898-2.821 2.322-4.477a3.93 3.93 0 0 0-2.28-.168c-1.761.394-3.403 1.96-4.89 4.643a8.27 8.27 0 0 0-.341.671c-.724-.107-1.334-.65-1.334-.65.128-.269.22-.455.345-.672 1.718-3.125 3.714-4.962 5.933-5.441ZM2.477 16.889c1.145.744 5.341 3.232 9.532 2.563 1.56-.247 2.963-.915 4.196-1.99-2.771.254-7.557-.753-13.728-7.666v7.093Z" fill="currentColor"/>`,
    x: '<path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584l-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>',
    bluesky: '<path fill="currentColor" d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565C.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479c.815 2.736 3.713 3.66 6.383 3.364q.204-.03.415-.056q-.207.033-.415.056c-3.912.58-7.387 2.005-2.83 7.078c5.013 5.19 6.87-1.113 7.823-4.308c.953 3.195 2.05 9.271 7.733 4.308c4.267-4.308 1.172-6.498-2.74-7.078a9 9 0 0 1-.415-.056q.21.026.415.056c2.67.297 5.568-.628 6.383-3.364c.246-.828.624-5.79.624-6.478c0-.69-.139-1.861-.902-2.206c-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8"/>'
};
const formatIconName = (icon)=>icon.toLowerCase();
function getSocialIcons(socialLinks = []) {
    const icons = {};
    for (const link of socialLinks)if ('string' == typeof link.icon) {
        const pathContent = presetIcons[formatIconName(link.icon)];
        icons[link.icon] = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24">${pathContent}</svg>`;
    }
    return icons;
}
function isPluginIncluded(config, pluginName) {
    return Boolean(config.builderPlugins?.some((plugin)=>plugin.name === pluginName) || config.builderConfig?.plugins?.some((plugin)=>plugin && plugin.name === pluginName));
}
async function createInternalBuildConfig(userDocRoot, config, enableSSG, routeService, pluginDriver) {
    const cwd = process.cwd();
    const CUSTOM_THEME_DIR = config?.themeDir ?? external_node_path_["default"].join(process.cwd(), 'theme');
    const outDir = config?.outDir ?? OUTPUT_DIR;
    const DEFAULT_THEME = require.resolve('@rspress/theme-default');
    const base = config?.base ?? '';
    const assetPrefix = isProduction() ? (0, shared_.removeTrailingSlash)(config?.builderConfig?.output?.assetPrefix ?? base) : '';
    const reactVersion = await detectReactVersion();
    const normalizeIcon = (icon)=>{
        if (!icon) return;
        icon = icon.toString();
        if (icon.startsWith('file://')) icon = fileURLToPath(icon);
        else if (external_node_path_["default"].isAbsolute(icon)) return external_node_path_["default"].join(userDocRoot, PUBLIC_DIR, icon);
        return icon;
    };
    await hintThemeBreakingChange(CUSTOM_THEME_DIR);
    const [detectCustomIconAlias, reactCSRAlias, reactSSRAlias, reactRouterDomAlias] = await Promise.all([
        detectCustomIcon(CUSTOM_THEME_DIR),
        resolveReactAlias(reactVersion, false),
        enableSSG ? resolveReactAlias(reactVersion, true) : Promise.resolve({}),
        resolveReactRouterDomAlias()
    ]);
    const context = {
        userDocRoot,
        config,
        routeService,
        pluginDriver
    };
    return {
        plugins: [
            ...isPluginIncluded(config, PLUGIN_REACT_NAME) ? [] : [
                pluginReact()
            ],
            rsbuildPluginDocVM(context),
            pluginVirtualModule({
                tempDir: '.rspress/runtime',
                virtualModules: {
                    ...i18nVMPlugin(context),
                    ...globalUIComponentsVMPlugin(context),
                    ...globalStylesVMPlugin(context),
                    ...searchHookVMPlugin(context),
                    ...routeListVMPlugin(context),
                    ...await getVirtualModulesFromPlugins(pluginDriver)
                }
            }),
            ...enableSSG ? [
                rsbuildPluginSSG({
                    routeService,
                    config,
                    pluginDriver
                })
            ] : []
        ],
        server: {
            port: !isProduction() && process.env.PORT ? Number(process.env.PORT) : void 0,
            printUrls: ({ urls })=>urls.map((url)=>`${url}/${(0, shared_.removeLeadingSlash)(base)}`),
            publicDir: {
                name: external_node_path_["default"].join(userDocRoot, PUBLIC_DIR)
            }
        },
        dev: {
            lazyCompilation: 'false' !== process.env.RSPRESS_LAZY_COMPILATION,
            progressBar: false,
            setupMiddlewares: [
                (middlewares)=>{
                    middlewares.unshift(serveSearchIndexMiddleware(config));
                }
            ],
            cliShortcuts: {
                custom: (shortcuts)=>shortcuts.filter(({ key })=>'r' !== key)
            }
        },
        html: {
            title: config?.title ?? DEFAULT_TITLE,
            favicon: normalizeIcon(config?.icon),
            template: TEMPLATE_PATH,
            tags: [
                config.themeConfig?.darkMode !== false ? {
                    tag: "script",
                    children: inlineThemeScript,
                    append: false
                } : null
            ].filter(Boolean)
        },
        output: {
            assetPrefix,
            distPath: {
                root: outDir
            }
        },
        resolve: {
            alias: {
                ...detectCustomIconAlias,
                '@mdx-js/react': require.resolve('@mdx-js/react'),
                '@theme': [
                    CUSTOM_THEME_DIR,
                    DEFAULT_THEME
                ],
                '@theme-assets': external_node_path_["default"].join(DEFAULT_THEME, '../assets'),
                '@rspress/core': PACKAGE_ROOT,
                'react-lazy-with-preload': require.resolve('react-lazy-with-preload')
            }
        },
        source: {
            include: [
                PACKAGE_ROOT,
                external_node_path_["default"].join(cwd, 'node_modules', shared_.RSPRESS_TEMP_DIR)
            ],
            define: {
                'process.env.TEST': JSON.stringify(process.env.TEST),
                'process.env.RSPRESS_SOCIAL_ICONS': JSON.stringify(getSocialIcons(config.themeConfig?.socialLinks))
            }
        },
        performance: {
            chunkSplit: {
                override: {
                    cacheGroups: {
                        styles: {
                            name: 'styles',
                            minSize: 0,
                            chunks: 'all',
                            test: /\.(?:css|less|sass|scss)$/,
                            priority: 99
                        }
                    }
                }
            }
        },
        tools: {
            bundlerChain (chain, { CHAIN_ID, target }) {
                const isServer = 'node' === target;
                const jsModuleRule = chain.module.rule(CHAIN_ID.RULE.JS);
                const swcLoaderOptions = jsModuleRule.use(CHAIN_ID.USE.SWC).get('options');
                const checkDeadLinks = (config?.markdown?.checkDeadLinks && !isServer) ?? false;
                chain.module.rule('MDX').type("javascript/auto").test(shared_.MDX_OR_MD_REGEXP).resolve.merge({
                    conditionNames: jsModuleRule.resolve.conditionNames.values(),
                    mainFields: jsModuleRule.resolve.mainFields.values()
                }).end().oneOf('MDXCompile').use('builtin:swc-loader').loader('builtin:swc-loader').options(swcLoaderOptions).end().use('mdx-loader').loader(require.resolve('./loader.js')).options({
                    config,
                    docDirectory: userDocRoot,
                    checkDeadLinks,
                    routeService,
                    pluginDriver
                }).end();
                if (chain.plugins.has(CHAIN_ID.PLUGIN.REACT_FAST_REFRESH)) chain.plugin(CHAIN_ID.PLUGIN.REACT_FAST_REFRESH).tap((options)=>{
                    options[0] ??= {};
                    options[0].include = [
                        /\.([cm]js|[jt]sx?|flow)$/i,
                        shared_.MDX_OR_MD_REGEXP
                    ];
                    return options;
                });
                chain.resolve.extensions.prepend('.md').prepend('.mdx').prepend('.mjs');
                chain.module.rule('css-virtual-module').test(/\.rspress[\\/]runtime[\\/]virtual-global-styles/).merge({
                    sideEffects: true
                });
                if (isServer) {
                    chain.output.filename(`${NODE_SSG_BUNDLE_FOLDER}/${NODE_SSG_BUNDLE_NAME}`);
                    chain.output.chunkFilename(`${NODE_SSG_BUNDLE_FOLDER}/[name].cjs`);
                    chain.target('async-node');
                }
            }
        },
        environments: {
            web: {
                resolve: {
                    alias: {
                        ...reactCSRAlias,
                        ...reactRouterDomAlias
                    }
                },
                source: {
                    entry: {
                        index: enableSSG && isProduction() ? SSR_CLIENT_ENTRY : CSR_CLIENT_ENTRY
                    },
                    preEntry: [
                        external_node_path_["default"].join(DEFAULT_THEME, '../styles/index.js'),
                        'virtual-global-styles'
                    ],
                    define: {
                        'process.env.__SSR__': JSON.stringify(false)
                    }
                },
                output: {
                    target: 'web',
                    distPath: {
                        root: outDir
                    }
                }
            },
            ...enableSSG ? {
                node: {
                    resolve: {
                        alias: {
                            ...reactSSRAlias,
                            ...reactRouterDomAlias
                        }
                    },
                    source: {
                        entry: {
                            index: SSR_SERVER_ENTRY
                        },
                        define: {
                            'process.env.__SSR__': JSON.stringify(true)
                        }
                    },
                    performance: {
                        printFileSize: {
                            compressed: true
                        }
                    },
                    output: {
                        emitAssets: false,
                        target: 'node',
                        minify: false
                    }
                }
            } : {}
        }
    };
}
async function initRsbuild(rootDir, config, pluginDriver, enableSSG, extraRsbuildConfig) {
    const cwd = process.cwd();
    const userDocRoot = external_node_path_["default"].resolve(rootDir || config?.root || cwd);
    const builderPlugins = config?.builderPlugins ?? [];
    const runtimeTempDir = external_node_path_["default"].join(shared_.RSPRESS_TEMP_DIR, 'runtime');
    const runtimeAbsTempDir = external_node_path_["default"].join(cwd, 'node_modules', runtimeTempDir);
    await promises_["default"].mkdir(runtimeAbsTempDir, {
        recursive: true
    });
    const routeService = await RouteService.create({
        config,
        runtimeTempDir: runtimeAbsTempDir,
        scanDir: userDocRoot,
        pluginDriver
    });
    const { createRsbuild, mergeRsbuildConfig } = await import("@rsbuild/core");
    const internalRsbuildConfig = await createInternalBuildConfig(userDocRoot, config, enableSSG, routeService, pluginDriver);
    const rsbuild = await createRsbuild({
        callerName: 'rspress',
        rsbuildConfig: mergeRsbuildConfig(internalRsbuildConfig, ...pluginDriver.getPlugins()?.map((plugin)=>plugin.builderConfig ?? {}) || [], config?.builderConfig || {}, extraRsbuildConfig || {})
    });
    rsbuild.addPlugins(builderPlugins);
    return rsbuild;
}
function checkLanguageParity_normalizePath(filePath) {
    return filePath.split(external_node_path_["default"].sep).join('/');
}
async function getAllMarkdownFilesFrom(dirPath) {
    const files = await promises_["default"].readdir(dirPath, {
        withFileTypes: true
    });
    const allFiles = [];
    for (const file of files){
        const fullPath = external_node_path_["default"].join(dirPath, file.name);
        if (file.isDirectory()) {
            const nestedFiles = await getAllMarkdownFilesFrom(fullPath);
            allFiles.push(...nestedFiles);
        } else if ([
            '.md',
            '.mdx'
        ].includes(external_node_path_["default"].extname(file.name))) allFiles.push(fullPath);
    }
    return allFiles;
}
async function collectModuleFiles(contentPath, lang, includedDir, excludedDirs, fileLangMap) {
    const langDirPath = external_node_path_["default"].join(contentPath, lang);
    const langModuleDir = external_node_path_["default"].join(langDirPath, includedDir);
    try {
        const moduleDirStats = await promises_["default"].stat(langModuleDir);
        if (!moduleDirStats.isDirectory()) return fileLangMap;
        const files = await getAllMarkdownFilesFrom(langModuleDir);
        for (const file of files){
            const relativePath = checkLanguageParity_normalizePath(external_node_path_["default"].relative(langDirPath, file));
            if (excludedDirs.some((excludedDir)=>{
                const isFilePath = /\.(md|mdx)$/.test(excludedDir);
                return relativePath.includes(excludedDir + (isFilePath ? '' : '/'));
            })) continue;
            const baseName = relativePath;
            if (!fileLangMap[baseName]) fileLangMap[baseName] = new Set();
            fileLangMap[baseName].add(lang);
        }
    } catch (e) {
        logger_.logger.error(e);
        throw new Error(`Failed to access directory: ${checkLanguageParity_normalizePath(langModuleDir)}`);
    }
    return fileLangMap;
}
async function checkLanguageParity(config) {
    if (!config?.languageParity || false === config.languageParity.enabled) return;
    logger_.logger.info('Checking language parity...');
    const contentPath = external_node_path_["default"].resolve(config.root);
    const includedDirs = config.languageParity.include?.length ? config.languageParity.include : [
        ''
    ];
    const excludedDirs = config.languageParity.exclude ?? [];
    const supportedLanguages = (config.locales ?? config.themeConfig?.locales)?.map((locale)=>locale.lang) || [];
    if (!supportedLanguages.length) return void logger_.logger.error('No supported languages found in the configuration.');
    const missingLanguagesFile = [];
    try {
        for (const includedDir of includedDirs){
            if (excludedDirs.some((excludedDir)=>excludedDir === includedDir)) continue;
            const curFileLangMap = {};
            for (const lang of supportedLanguages)await collectModuleFiles(contentPath, lang, includedDir, excludedDirs, curFileLangMap);
            for (const [baseName, langs] of Object.entries(curFileLangMap)){
                const missingLangs = supportedLanguages.filter((lang)=>!langs.has(lang));
                missingLangs.forEach((lang)=>{
                    const missingPath = external_node_path_["default"].join(lang, baseName);
                    missingLanguagesFile.push(missingPath);
                });
            }
        }
        if (missingLanguagesFile.length > 0) throw new Error(`Check language parity failed! Missing content:\n${missingLanguagesFile.map((file)=>`        - ${checkLanguageParity_normalizePath(file)}`).join('\n')}`);
        logger_.logger.success('Language parity checked successfully.');
    } catch (err) {
        logger_.logger.error('Error during language parity check: \n', err);
        throw err;
    }
}
async function dev(options) {
    const { docDirectory, config, extraBuilderConfig } = options;
    const isProd = false;
    const pluginDriver = new PluginDriver(config, isProd);
    await pluginDriver.init();
    const modifiedConfig = await pluginDriver.modifyConfig();
    try {
        await pluginDriver.beforeBuild();
        const rsbuild = await initRsbuild(docDirectory, modifiedConfig, pluginDriver, false, extraBuilderConfig);
        rsbuild.onDevCompileDone(async ()=>{
            await pluginDriver.afterBuild();
        });
        const { server } = await rsbuild.startDevServer({
            getPortSilently: true
        });
        return server;
    } finally{
        await writeSearchIndex(modifiedConfig);
        await checkLanguageParity(modifiedConfig);
    }
}
async function bundle(docDirectory, config, pluginDriver, enableSSG) {
    try {
        const rsbuild = await initRsbuild(docDirectory, config, pluginDriver, enableSSG);
        await rsbuild.build();
    } finally{
        await writeSearchIndex(config);
        await checkLanguageParity(config);
    }
}
function emptyDir(path) {
    return promises_["default"].rm(path, {
        force: true,
        recursive: true
    });
}
async function build(options) {
    const { docDirectory, config } = options;
    const pluginDriver = new PluginDriver(config, true);
    await pluginDriver.init();
    const modifiedConfig = await pluginDriver.modifyConfig();
    await pluginDriver.beforeBuild();
    const ssgConfig = modifiedConfig.ssg ?? true;
    await emptyDir(constants_TEMP_DIR);
    await bundle(docDirectory, modifiedConfig, pluginDriver, ssgConfig);
    if (!ssgConfig) hintSSGFalse();
    await pluginDriver.afterBuild();
}
async function serve(options) {
    const { config, port: userPort, host: userHost } = options;
    const envPort = process.env.PORT;
    const envHost = process.env.HOST;
    const { builderConfig } = config;
    const port = Number(envPort || userPort || builderConfig?.server?.port || 4173);
    const host = envHost || userHost || builderConfig?.server?.host || 'localhost';
    config.builderConfig = core_mergeRsbuildConfig(builderConfig, {
        server: {
            port,
            host
        }
    });
    const pluginDriver = new PluginDriver(config, true);
    await pluginDriver.init();
    const modifiedConfig = await pluginDriver.modifyConfig();
    const rsbuild = await initRsbuild(config.root, modifiedConfig, pluginDriver, false);
    return rsbuild.preview();
}
const getASTNodeImport = (name, from)=>({
        type: 'mdxjsEsm',
        value: `import ${name} from ${JSON.stringify(from)}`,
        data: {
            estree: {
                type: 'Program',
                sourceType: 'module',
                body: [
                    {
                        type: 'ImportDeclaration',
                        specifiers: [
                            {
                                type: 'ImportDefaultSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name
                                }
                            }
                        ],
                        source: {
                            type: 'Literal',
                            value: from,
                            raw: `${JSON.stringify(from)}`
                        }
                    }
                ]
            }
        }
    });
function normalizeLink(nodeUrl, routeService, relativePath, cleanUrls) {
    if (!nodeUrl) return '';
    if (nodeUrl.startsWith('#')) return `#${nodeUrl.slice(1)}`;
    let { url, hash } = (0, shared_.parseUrl)(nodeUrl);
    if ((0, shared_.isExternalUrl)(url)) return url + (hash ? `#${hash}` : '');
    const extname = external_node_path_["default"].extname(url);
    if ((routeService?.extensions ?? constants_.DEFAULT_PAGE_EXTENSIONS).includes(extname)) url = url.replace(new RegExp(`\\${extname}$`), '');
    if (url.startsWith('.')) url = external_node_path_["default"].posix.join((0, shared_.slash)(external_node_path_["default"].dirname(relativePath)), url);
    else if (routeService) {
        const [pathVersion, pathLang] = routeService.getRoutePathParts((0, shared_.slash)(relativePath));
        const [urlVersion, urlLang, urlPath] = routeService.getRoutePathParts(url);
        url = (0, shared_.addLeadingSlash)(urlPath);
        if (pathLang && urlLang !== pathLang) url = `/${pathLang}${url}`;
        if (pathVersion && urlVersion !== pathVersion) url = `/${pathVersion}${url}`;
    }
    if ('boolean' == typeof cleanUrls) url = (0, shared_.normalizeHref)(url, cleanUrls);
    else {
        url = (0, shared_.normalizeHref)(url, false);
        url = url.replace(/\.html$/, cleanUrls);
    }
    if (hash) url += `#${hash}`;
    return url;
}
const normalizeImageUrl = (imageUrl)=>{
    if ((0, shared_.isExternalUrl)(imageUrl) || imageUrl.startsWith('/')) return '';
    return imageUrl;
};
const remarkPluginNormalizeLink = ({ root, cleanUrls, routeService })=>(tree, file)=>{
        const images = [];
        visit(tree, 'link', (node)=>{
            const { url: nodeUrl } = node;
            const relativePath = external_node_path_["default"].relative(root, file.path);
            node.url = normalizeLink(nodeUrl, routeService, relativePath, cleanUrls);
        });
        visit(tree, 'definition', (node)=>{
            const { url: nodeUrl } = node;
            const relativePath = external_node_path_["default"].relative(root, file.path);
            node.url = normalizeLink(nodeUrl, routeService, relativePath, cleanUrls);
        });
        const getMdxSrcAttribute = (tempVar)=>({
                type: 'mdxJsxAttribute',
                name: 'src',
                value: {
                    type: 'mdxJsxAttributeValueExpression',
                    value: tempVar,
                    data: {
                        estree: {
                            type: 'Program',
                            sourceType: 'module',
                            body: [
                                {
                                    type: 'ExpressionStatement',
                                    expression: {
                                        type: 'Identifier',
                                        name: tempVar
                                    }
                                }
                            ]
                        }
                    }
                }
            });
        visit(tree, 'image', (node)=>{
            const { alt, url } = node;
            if (!url) return;
            const imagePath = normalizeImageUrl(url);
            if (!imagePath) return;
            const tempVariableName = `image${images.length}`;
            Object.assign(node, {
                type: 'mdxJsxFlowElement',
                name: 'img',
                children: [],
                attributes: [
                    alt && {
                        type: 'mdxJsxAttribute',
                        name: 'alt',
                        value: alt
                    },
                    getMdxSrcAttribute(tempVariableName)
                ].filter(Boolean)
            });
            images.push(getASTNodeImport(tempVariableName, imagePath));
        });
        visit(tree, (node)=>{
            if ('mdxJsxFlowElement' !== node.type && 'mdxJsxTextElement' !== node.type || 'img' !== node.name) return;
            const srcAttr = (0, node_utils_.getNodeAttribute)(node, 'src', true);
            if ('string' != typeof srcAttr?.value) return;
            const imagePath = normalizeImageUrl(srcAttr.value);
            if (!imagePath) return;
            const tempVariableName = `image${images.length}`;
            Object.assign(srcAttr, getMdxSrcAttribute(tempVariableName));
            images.push(getASTNodeImport(tempVariableName, imagePath));
        });
        tree.children.unshift(...images);
    };
var __webpack_exports__mergeDocConfig = node_utils_.mergeDocConfig;
export { build, dev, remarkPluginNormalizeLink, serve, __webpack_exports__mergeDocConfig as mergeDocConfig };
