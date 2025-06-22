/*! For license information please see index.js.LICENSE.txt */
import node_path from "node:path";
import { getSidebarDataGroup, normalizeHref, removeBase } from "@rspress/shared";
import { logger } from "@rspress/shared/logger";
import { remarkPluginNormalizeLink } from "@rspress/core";
import remark_mdx from "remark-mdx";
import remark_parse from "remark-parse";
import remark_stringify from "remark-stringify";
import { unified } from "unified";
import { SKIP, visit } from "unist-util-visit";
var router_Action;
(function(Action) {
    Action["Pop"] = "POP";
    Action["Push"] = "PUSH";
    Action["Replace"] = "REPLACE";
})(router_Action || (router_Action = {}));
function warning(cond, message) {
    if (!cond) {
        if ("undefined" != typeof console) console.warn(message);
        try {
            throw new Error(message);
        } catch (e) {}
    }
}
var router_ResultType;
(function(ResultType) {
    ResultType["data"] = "data";
    ResultType["deferred"] = "deferred";
    ResultType["redirect"] = "redirect";
    ResultType["error"] = "error";
})(router_ResultType || (router_ResultType = {}));
new Set([
    "lazy",
    "caseSensitive",
    "path",
    "id",
    "index",
    "children"
]);
function matchPath(pattern, pathname) {
    if ("string" == typeof pattern) pattern = {
        path: pattern,
        caseSensitive: false,
        end: true
    };
    let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
    let match = pathname.match(matcher);
    if (!match) return null;
    let matchedPathname = match[0];
    let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
    let captureGroups = match.slice(1);
    let params = compiledParams.reduce((memo, _ref, index)=>{
        let { paramName, isOptional } = _ref;
        if ("*" === paramName) {
            let splatValue = captureGroups[index] || "";
            pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
        }
        const value = captureGroups[index];
        if (isOptional && !value) memo[paramName] = void 0;
        else memo[paramName] = (value || "").replace(/%2F/g, "/");
        return memo;
    }, {});
    return {
        params,
        pathname: matchedPathname,
        pathnameBase,
        pattern
    };
}
function compilePath(path, caseSensitive, end) {
    if (void 0 === caseSensitive) caseSensitive = false;
    if (void 0 === end) end = true;
    warning("*" === path || !path.endsWith("*") || path.endsWith("/*"), "Route path \"" + path + '" will be treated as if it were "' + path.replace(/\*$/, "/*") + '" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "' + path.replace(/\*$/, "/*") + "\".");
    let params = [];
    let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional)=>{
        params.push({
            paramName,
            isOptional: null != isOptional
        });
        return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
    });
    if (path.endsWith("*")) {
        params.push({
            paramName: "*"
        });
        regexpSource += "*" === path || "/*" === path ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
    } else if (end) regexpSource += "\\/*$";
    else if ("" !== path && "/" !== path) regexpSource += "(?:(?=\\/|$))";
    let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
    return [
        matcher,
        params
    ];
}
const validMutationMethodsArr = [
    "post",
    "put",
    "patch",
    "delete"
];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = [
    "get",
    ...validMutationMethodsArr
];
new Set(validRequestMethodsArr);
new Set([
    301,
    302,
    303,
    307,
    308
]);
new Set([
    307,
    308
]);
Symbol("deferred");
function routePathToMdPath(routePath) {
    let url = routePath;
    url = normalizeHref(url, false);
    url = url.replace(/\.html$/, '.md');
    return url;
}
function generateLlmsTxt(pageDataArray, navList, others, llmsTxtOptions, title, description) {
    const lines = [];
    const { onAfterLlmsTxtGenerate, onLineGenerate, onTitleGenerate } = 'boolean' == typeof llmsTxtOptions ? {} : llmsTxtOptions;
    const summary = onTitleGenerate ? onTitleGenerate({
        title,
        description
    }) : `# ${title}${description ? `\n\n> ${description}` : ''}`;
    for(let i = 0; i < navList.length; i++){
        const nav = navList[i];
        const pages = pageDataArray[i];
        const { text } = nav;
        if (0 === pages.length) continue;
        const title = text;
        lines.push(`\n## ${title}\n`);
        for (const page of pages){
            const { routePath, lang, title, frontmatter } = page;
            if ('/' === routePath || routePath === `/${lang}/`) continue;
            const line = onLineGenerate ? onLineGenerate(page) : `- [${title}](${routePathToMdPath(routePath)})${frontmatter.description ? `: ${frontmatter.description}` : ''}`;
            lines.push(line);
        }
    }
    let hasOthers = false;
    const otherLines = [];
    otherLines.push('\n## Other\n');
    for (const page of others){
        const { routePath, lang, title, frontmatter } = page;
        if ('/' === routePath || routePath === `/${lang}/`) continue;
        const line = onLineGenerate ? onLineGenerate(page) : `- [${title}](${routePathToMdPath(routePath)})${frontmatter.description ? `: ${frontmatter.description}` : ''}`;
        otherLines.push(line);
        hasOthers = true;
    }
    if (hasOthers) lines.push(...otherLines);
    const llmsTxt = `${summary}\n${lines.join('\n')}`;
    return onAfterLlmsTxtGenerate ? onAfterLlmsTxtGenerate(llmsTxt) : llmsTxt;
}
function generateLlmsFullTxt(pageDataArray, navList, others) {
    const lines = [];
    for(let i = 0; i < navList.length; i++){
        const pages = pageDataArray[i];
        if (0 !== pages.length) for (const page of pages){
            lines.push(`---
url: ${routePathToMdPath(page.routePath)}
---
`);
            lines.push(page.mdContent ?? page._flattenContent ?? page.content);
            lines.push('\n');
        }
    }
    for (const page of others){
        lines.push(`---
url: ${routePathToMdPath(page.routePath)}
---
`);
        lines.push(page.mdContent ?? page._flattenContent ?? page.content);
        lines.push('\n');
    }
    return lines.join('\n');
}
const mdxToMdPlugin = ()=>(tree)=>{
        visit(tree, 'mdxjsEsm', (node)=>{
            if (node.data?.estree?.body[0].type === 'ImportDeclaration') {
                node.value = '';
                return SKIP;
            }
        });
        visit(tree, 'mdxJsxFlowElement', (node, index, parent)=>{
            if (parent && void 0 !== index && Array.isArray(parent.children)) {
                parent.children.splice(index, 1, ...node.children);
                return index - 1;
            }
        });
        visit(tree, 'mdxJsxTextElement', (node, index, parent)=>{
            if (parent && void 0 !== index && Array.isArray(parent.children)) {
                parent.children.splice(index, 1, ...node.children);
                return index - 1;
            }
        });
    };
function mdxToMd(content, filepath, docDirectory, routeService) {
    return unified().use(remark_parse).use(remark_mdx).use(mdxToMdPlugin).use(remarkPluginNormalizeLink, {
        cleanUrls: '.md',
        root: docDirectory,
        routeService
    }).use(remark_stringify).process({
        value: content,
        path: filepath
    });
}
const rsbuildPluginLlms = ({ disableSSGRef, pageDataList, routes, titleRef, descriptionRef, langRef, sidebar, baseRef, docDirectoryRef, routeServiceRef, nav, rspressPluginOptions })=>({
        name: 'rsbuild-plugin-llms',
        async setup (api) {
            const { llmsTxt = true, mdFiles = true, llmsFullTxt = true, include, exclude } = rspressPluginOptions;
            api.onBeforeBuild(async ()=>{
                const base = baseRef.current;
                const docDirectory = docDirectoryRef.current;
                const disableSSG = disableSSGRef.current;
                const newPageDataList = mergeRouteMetaWithPageData(routes, pageDataList, langRef.current, include, exclude);
                const navList = Array.isArray(nav) ? nav.map((i)=>{
                    const nav = i.nav.default;
                    const lang = i.lang;
                    return nav.map((i)=>({
                            ...i,
                            lang
                        }));
                }).flat().filter((i)=>i.activeMatch || i.link) : [];
                const others = [];
                const pageArray = new Array(navList.length).fill(0).map(()=>[]);
                newPageDataList.forEach((pageData)=>{
                    const { routePath, lang } = pageData;
                    for(let i = 0; i < pageArray.length; i++){
                        const pageArrayItem = pageArray[i];
                        const navItem = navList[i];
                        if (lang === navItem.lang && new RegExp(navItem.activeMatch ?? navItem.link).test(removeBase(routePath, base))) return void pageArrayItem.push(pageData);
                    }
                    others.push(pageData);
                });
                for (const array of pageArray)organizeBySidebar(sidebar, array, base);
                if (llmsTxt) {
                    const llmsTxtContent = generateLlmsTxt(pageArray, navList, others, rspressPluginOptions.llmsTxt ?? {}, titleRef.current, descriptionRef.current);
                    api.processAssets({
                        targets: disableSSG ? [
                            'web'
                        ] : [
                            'node'
                        ],
                        stage: 'additional'
                    }, async ({ compilation, sources })=>{
                        const source = new sources.RawSource(llmsTxtContent);
                        compilation.emitAsset('llms.txt', source);
                    });
                }
                const mdContents = {};
                await Promise.all([
                    ...newPageDataList.values()
                ].map(async (pageData)=>{
                    const content = pageData._flattenContent ?? pageData.content;
                    const filepath = pageData._filepath;
                    const isMD = 'mdx' !== node_path.extname(filepath).slice(1);
                    let mdContent;
                    if (isMD) mdContent = content;
                    else try {
                        mdContent = (await mdxToMd(content, filepath, docDirectory, routeServiceRef.current)).toString();
                    } catch (e) {
                        logger.debug(e);
                        mdContent = content;
                        return;
                    }
                    pageData.mdContent = mdContent;
                    const outFilePath = `${pageData.routePath.endsWith('/') ? `${pageData.routePath}index` : pageData.routePath}.md`;
                    mdContents[outFilePath] = mdContent.toString();
                }) ?? []);
                if (mdFiles) api.processAssets({
                    targets: disableSSG ? [
                        'web'
                    ] : [
                        'node'
                    ],
                    stage: 'additional'
                }, async ({ compilation, sources })=>{
                    if (mdFiles) Object.entries(mdContents).forEach(([outFilePath, content])=>{
                        const source = new sources.RawSource(content);
                        compilation.emitAsset(`.${outFilePath}`, source);
                    });
                });
                if (llmsFullTxt) {
                    const llmsFullTxtContent = generateLlmsFullTxt(pageArray, navList, others);
                    api.processAssets({
                        targets: disableSSG ? [
                            'web'
                        ] : [
                            'node'
                        ],
                        stage: 'additional'
                    }, async ({ compilation, sources })=>{
                        const source = new sources.RawSource(llmsFullTxtContent);
                        compilation.emitAsset('llms-full.txt', source);
                    });
                }
            });
        }
    });
function mergeRouteMetaWithPageData(routeMetaList, pageDataList, lang, include, exclude) {
    const m = new Map(pageDataList.filter((pageData)=>{
        if (include) return include({
            page: pageData
        });
        if (lang) return pageData.lang === lang;
        return true;
    }).filter((pageData)=>{
        if (exclude) return !exclude({
            page: pageData
        });
        return true;
    }).map((pageData)=>[
            pageData.routePath,
            pageData
        ]));
    const mergedPageDataList = new Map();
    routeMetaList.forEach((routeMeta)=>{
        const pageData = m.get(routeMeta.routePath);
        if (pageData) mergedPageDataList.set(routeMeta.routePath, pageData);
    });
    return mergedPageDataList;
}
function flatSidebar(sidebar) {
    if (!sidebar) return [];
    return sidebar.flatMap((i)=>{
        if ('string' == typeof i) return i;
        if ('link' in i && 'string' == typeof i.link) return [
            i.link,
            ...flatSidebar(i?.items ?? [])
        ];
        if ('items' in i && Array.isArray(i.items)) return flatSidebar(i.items);
    }).filter(Boolean);
}
function organizeBySidebar(sidebar, pages, base) {
    if (0 === pages.length) return;
    const pageItem = pages[0];
    const currSidebar = getSidebarDataGroup(sidebar, pageItem.routePath, base);
    if (0 === currSidebar.length) return;
    const orderList = flatSidebar(currSidebar);
    pages.sort((a, b)=>{
        const aIndex = orderList.findIndex((order)=>matchPath(order, a.routePath));
        const bIndex = orderList.findIndex((order)=>matchPath(order, b.routePath));
        return aIndex - bIndex;
    });
}
function pluginLlms(options = {}) {
    const baseRef = {
        current: ''
    };
    const docDirectoryRef = {
        current: ''
    };
    const titleRef = {
        current: ''
    };
    const descriptionRef = {
        current: ''
    };
    const langRef = {
        current: ''
    };
    const pageDataList = [];
    const routes = [];
    const sidebar = {};
    const disableSSGRef = {
        current: false
    };
    const nav = [];
    const routeServiceRef = {
        current: void 0
    };
    return {
        name: '@rspress/plugin-llms',
        extendPageData (pageData, isProd) {
            if (isProd) pageDataList.push(pageData);
        },
        routeServiceGenerated (routeService, isProd) {
            if (isProd) routeServiceRef.current = routeService;
        },
        routeGenerated (_routes, isProd) {
            if (isProd) routes.push(..._routes);
        },
        beforeBuild (config) {
            disableSSGRef.current = false === config.ssg;
            const locales = config.themeConfig?.locales;
            const isMultiLang = locales && locales.length > 0;
            const sidebars = isMultiLang ? locales.map((i)=>i.sidebar) : [
                config.themeConfig?.sidebar
            ];
            const configSidebar = sidebars.reduce((prev, curr)=>{
                Object.assign(prev, curr);
                return prev;
            }, {});
            Object.assign(sidebar, configSidebar);
            const configNav = isMultiLang ? locales.filter((i)=>Boolean(i.nav)).map((i)=>({
                    nav: i.nav,
                    lang: i.lang
                })) : [
                {
                    nav: config.themeConfig?.nav,
                    lang: config.lang ?? ''
                }
            ];
            nav.push(...configNav);
            titleRef.current = config.title;
            descriptionRef.current = config.description;
            langRef.current = config.lang ?? '';
            baseRef.current = config.base ?? '/';
            docDirectoryRef.current = config.root ?? 'docs';
        },
        builderConfig: {
            plugins: [
                rsbuildPluginLlms({
                    ...options,
                    pageDataList,
                    routes,
                    titleRef,
                    descriptionRef,
                    langRef,
                    sidebar,
                    docDirectoryRef,
                    routeServiceRef,
                    nav,
                    baseRef,
                    disableSSGRef,
                    rspressPluginOptions: options
                })
            ]
        }
    };
}
export { pluginLlms };
