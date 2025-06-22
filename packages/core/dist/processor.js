import __rslib_shim_module__ from 'module';
/*#__PURE__*/ import.meta.url;
import node_path from "node:path";
import { createProcessor, nodeTypes } from "@mdx-js/mdx";
import { logger } from "@rspress/shared/logger";
import { extractTextAndId, getNodeAttribute, loadFrontMatter } from "@rspress/shared/node-utils";
import node_os from "node:os";
import rehype_external_links from "rehype-external-links";
import rehype_raw from "rehype-raw";
import remark_gfm from "remark-gfm";
import github_slugger from "github-slugger";
import { headingRank } from "hast-util-heading-rank";
import { visit } from "unist-util-visit";
import { addLeadingSlash, cleanUrl, isExternalUrl, isProduction, normalizeHref, parseUrl, slash as shared_slash } from "@rspress/shared";
import { DEFAULT_PAGE_EXTENSIONS } from "@rspress/shared/constants";
import { visitChildren } from "unist-util-visit-children";
import rehype from "@shikijs/rehype";
import { createCssVariablesTheme } from "shiki";
function applyReplaceRules(code = '', replaceRules = []) {
    let result = code;
    for (const rule of replaceRules)result = result.replace(rule.search, rule.replace);
    return result;
}
function escapeMarkdownHeadingIds(content) {
    const markdownHeadingRegexp = /(?:^|\n)#{1,6}(?!#).*/g;
    return content.replace(markdownHeadingRegexp, (substring)=>substring.replace('{#', '\\{#').replace('\\\\{#', '\\{#'));
}
const isWindows = 'win32' === node_os.platform();
function slash(p) {
    return p.replace(/\\/g, '/');
}
function normalizePath(id) {
    return node_path.posix.normalize(isWindows ? slash(id) : id);
}
const rehypeHeaderAnchor = ()=>{
    const slugger = new github_slugger();
    return (tree)=>{
        visit(tree, 'element', (node)=>{
            if (!headingRank(node)) return;
            if (!node.properties?.id) {
                const [text, customId] = collectHeaderText(node);
                node.properties ??= {};
                node.properties.id = customId || slugger.slug(text);
            }
            node.children.unshift(create(node));
        });
    };
};
const collectHeaderText = (node)=>{
    let text = '';
    let id = '';
    node.children.forEach((child)=>{
        if ('text' === child.type) {
            const [textPart, idPart] = extractTextAndId(child.value);
            child.value = textPart;
            text += textPart;
            id = idPart;
        } else if ('element' === child.type) child.children.forEach((c)=>{
            if ('text' === c.type) text += c.value;
        });
    });
    return [
        text,
        id
    ];
};
function create(node) {
    return {
        type: 'element',
        tagName: 'a',
        properties: {
            class: 'header-anchor',
            ariaHidden: 'true',
            href: `#${node.properties.id}`
        },
        children: [
            {
                type: 'text',
                value: '#'
            }
        ]
    };
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
const remarkBuiltin = ({ globalComponents })=>(tree)=>{
        const demos = globalComponents.map((componentPath)=>{
            const filename = node_path.parse(componentPath).name;
            const componentName = filename[0].toUpperCase() + filename.slice(1);
            return getASTNodeImport(componentName, componentPath);
        });
        tree.children.unshift(...demos);
    };
const IGNORE_REGEXP = /^(https?|mailto|tel|#)/;
function checkLinks(links, filepath, root, routeService) {
    const errorInfos = [];
    links.filter((link)=>!IGNORE_REGEXP.test(link)).map((link)=>normalizePath(link)).forEach((link)=>{
        const relativePath = node_path.relative(root, filepath);
        if (!routeService.isExistRoute(cleanUrl(link))) errorInfos.push(`Internal link to "${link}" is dead, check it in "${relativePath}"`);
    });
    if (errorInfos.length > 0) {
        errorInfos?.forEach((err)=>{
            logger.error(err);
        });
        if (isProduction()) throw new Error('Dead link found');
    }
}
const remarkCheckDeadLinks = (checkLink)=>{
    const { root, routeService } = checkLink;
    return (tree, vfile)=>{
        const internalLinks = new Set();
        visit(tree, 'link', ({ url })=>{
            if (!url) return;
            if (internalLinks.has(url)) return;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                const { routePath: normalizeUrl } = routeService.normalizeRoutePath(url.split(node_path.sep).join('/')?.split('#')[0]);
                internalLinks.add(normalizeUrl);
            }
        });
        checkLinks(Array.from(internalLinks), vfile.path, root, routeService);
    };
};
function normalizeLink(nodeUrl, routeService, relativePath, cleanUrls) {
    if (!nodeUrl) return '';
    if (nodeUrl.startsWith('#')) return `#${nodeUrl.slice(1)}`;
    let { url, hash } = parseUrl(nodeUrl);
    if (isExternalUrl(url)) return url + (hash ? `#${hash}` : '');
    const extname = node_path.extname(url);
    if ((routeService?.extensions ?? DEFAULT_PAGE_EXTENSIONS).includes(extname)) url = url.replace(new RegExp(`\\${extname}$`), '');
    if (url.startsWith('.')) url = node_path.posix.join(shared_slash(node_path.dirname(relativePath)), url);
    else if (routeService) {
        const [pathVersion, pathLang] = routeService.getRoutePathParts(shared_slash(relativePath));
        const [urlVersion, urlLang, urlPath] = routeService.getRoutePathParts(url);
        url = addLeadingSlash(urlPath);
        if (pathLang && urlLang !== pathLang) url = `/${pathLang}${url}`;
        if (pathVersion && urlVersion !== pathVersion) url = `/${pathVersion}${url}`;
    }
    if ('boolean' == typeof cleanUrls) url = normalizeHref(url, cleanUrls);
    else {
        url = normalizeHref(url, false);
        url = url.replace(/\.html$/, cleanUrls);
    }
    if (hash) url += `#${hash}`;
    return url;
}
const normalizeImageUrl = (imageUrl)=>{
    if (isExternalUrl(imageUrl) || imageUrl.startsWith('/')) return '';
    return imageUrl;
};
const remarkPluginNormalizeLink = ({ root, cleanUrls, routeService })=>(tree, file)=>{
        const images = [];
        visit(tree, 'link', (node)=>{
            const { url: nodeUrl } = node;
            const relativePath = node_path.relative(root, file.path);
            node.url = normalizeLink(nodeUrl, routeService, relativePath, cleanUrls);
        });
        visit(tree, 'definition', (node)=>{
            const { url: nodeUrl } = node;
            const relativePath = node_path.relative(root, file.path);
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
            const srcAttr = getNodeAttribute(node, 'src', true);
            if ('string' != typeof srcAttr?.value) return;
            const imagePath = normalizeImageUrl(srcAttr.value);
            if (!imagePath) return;
            const tempVariableName = `image${images.length}`;
            Object.assign(srcAttr, getMdxSrcAttribute(tempVariableName));
            images.push(getASTNodeImport(tempVariableName, imagePath));
        });
        tree.children.unshift(...images);
    };
const parseToc = (tree)=>{
    let title = '';
    const toc = [];
    const slugger = new github_slugger();
    visitChildren((node)=>{
        if ('heading' !== node.type || !node.depth || !node.children) return;
        if (node.depth >= 1 && node.depth < 5) {
            let customId = '';
            const text = node.children.map((child)=>{
                if ('link' === child.type) return child.children?.map((item)=>item.value).join('');
                if ('strong' === child.type) return `**${child.children?.map((item)=>item.value).join('')}**`;
                if ('emphasis' === child.type) return `*${child.children?.map((item)=>item.value).join('')}*`;
                if ('delete' === child.type) return `~~${child.children?.map((item)=>item.value).join('')}~~`;
                if ('text' === child.type) {
                    const [textPart, idPart] = extractTextAndId(child.value);
                    customId = idPart;
                    return textPart;
                }
                if ('inlineCode' === child.type) return `\`${child.value}\``;
                return '';
            }).join('');
            if (1 === node.depth) {
                if (!title) title = text;
            } else {
                const id = customId ? customId : slugger.slug(text);
                const { depth } = node;
                toc.push({
                    id,
                    text,
                    depth
                });
            }
        }
    })(tree);
    return {
        title,
        toc
    };
};
const remarkPluginToc = function() {
    const data = this.data();
    return (tree)=>{
        const { toc, title } = parseToc(tree);
        data.pageMeta.toc = toc;
        if (title) data.pageMeta.title = title;
    };
};
const rehypeCodeMeta = ()=>(tree)=>{
        visit(tree, 'element', (node)=>{
            if ('pre' === node.tagName && node.children[0]?.type === 'element' && 'code' === node.children[0].tagName) {
                const codeNode = node.children[0];
                codeNode.properties.metastring = codeNode.data?.meta;
            }
        });
    };
const SHIKI_TRANSFORMER_LINE_NUMBER = 'shiki-transformer:line-number';
function transformerLineNumber(options = {}) {
    const { classActiveLine = 'line-number', classActivePre = 'has-line-number' } = options;
    return {
        name: SHIKI_TRANSFORMER_LINE_NUMBER,
        pre (pre) {
            return this.addClassToHast(pre, classActivePre);
        },
        line (node) {
            this.addClassToHast(node, classActiveLine);
        }
    };
}
const SHIKI_TRANSFORMER_ADD_TITLE = 'shiki-transformer:add-title';
function parseTitleFromMeta(meta) {
    if (!meta) return '';
    let result = meta;
    const highlightReg = /{[\d,-]*}/i;
    const highlightMeta = highlightReg.exec(meta)?.[0];
    if (highlightMeta) result = meta.replace(highlightReg, '').trim();
    result = result.split('=')[1] ?? '';
    return result?.replace(/["'`]/g, '');
}
function transformerAddTitle() {
    return {
        name: SHIKI_TRANSFORMER_ADD_TITLE,
        pre (pre) {
            const title = parseTitleFromMeta(this.options.meta?.__raw);
            if (title.length > 0) pre.properties = {
                ...pre.properties,
                title
            };
            return pre;
        }
    };
}
const cssVariablesTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    variableDefaults: {},
    fontStyle: true
});
function createRehypeShikiOptions(showLineNumbers, options) {
    const { transformers = [], ...restOptions } = options || {};
    const newTransformers = [
        transformerAddTitle(),
        ...transformers
    ];
    if (showLineNumbers && !newTransformers.some((transformerItem)=>transformerItem.name === SHIKI_TRANSFORMER_LINE_NUMBER)) newTransformers.push(transformerLineNumber());
    return {
        theme: cssVariablesTheme,
        defaultLanguage: 'txt',
        lazy: true,
        langs: [
            'tsx',
            'ts',
            'js'
        ],
        ...restOptions,
        addLanguageClass: true,
        transformers: newTransformers
    };
}
async function createMDXOptions(options) {
    const { docDirectory, config, checkDeadLinks, routeService, filepath, pluginDriver } = options;
    const format = node_path.extname(filepath).slice(1);
    const cleanUrls = config?.route?.cleanUrls ?? false;
    const { remarkPlugins: remarkPluginsFromConfig = [], rehypePlugins: rehypePluginsFromConfig = [], globalComponents: globalComponentsFromConfig = [], showLineNumbers = false, shiki } = config?.markdown || {};
    const rspressPlugins = pluginDriver?.getPlugins() ?? [];
    const remarkPluginsFromPlugins = rspressPlugins.flatMap((plugin)=>plugin.markdown?.remarkPlugins || []);
    const rehypePluginsFromPlugins = rspressPlugins.flatMap((plugin)=>plugin.markdown?.rehypePlugins || []);
    const globalComponents = [
        ...rspressPlugins.flatMap((plugin)=>plugin.markdown?.globalComponents || []),
        ...globalComponentsFromConfig
    ];
    return {
        providerImportSource: '@mdx-js/react',
        format,
        remarkPlugins: [
            remark_gfm,
            remarkPluginToc,
            [
                remarkPluginNormalizeLink,
                {
                    cleanUrls,
                    root: docDirectory,
                    routeService
                }
            ],
            checkDeadLinks && routeService && [
                remarkCheckDeadLinks,
                {
                    root: docDirectory,
                    base: config?.base || '',
                    routeService
                }
            ],
            globalComponents.length && [
                remarkBuiltin,
                {
                    globalComponents
                }
            ],
            ...remarkPluginsFromConfig,
            ...remarkPluginsFromPlugins
        ].filter(Boolean),
        rehypePlugins: [
            rehypeHeaderAnchor,
            ...'md' === format ? [
                rehypeCodeMeta,
                [
                    rehype_raw,
                    {
                        passThrough: nodeTypes
                    }
                ]
            ] : [],
            [
                rehype,
                createRehypeShikiOptions(showLineNumbers, shiki)
            ],
            [
                rehype_external_links,
                {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                }
            ],
            ...rehypePluginsFromConfig,
            ...rehypePluginsFromPlugins
        ]
    };
}
async function compile(options) {
    const { source, filepath, docDirectory, checkDeadLinks, config, routeService, pluginDriver } = options;
    const mdxOptions = await createMDXOptions({
        checkDeadLinks,
        config,
        docDirectory,
        filepath,
        pluginDriver,
        routeService
    });
    const { frontmatter, emptyLinesSource } = loadFrontMatter(source, filepath, docDirectory, true);
    const { replaceRules } = config ?? {};
    const replacedSource = applyReplaceRules(emptyLinesSource, replaceRules);
    const preprocessedContent = escapeMarkdownHeadingIds(replacedSource);
    try {
        let pageMeta = {
            title: '',
            toc: [],
            headingTitle: ''
        };
        const frontmatterTitle = extractTextAndId(frontmatter.title)[0];
        const compiler = createProcessor(mdxOptions);
        compiler.data('pageMeta', {
            toc: [],
            title: ''
        });
        const vFile = await compiler.process({
            value: preprocessedContent,
            path: filepath
        });
        const compileResult = String(vFile);
        const compilationMeta = compiler.data('pageMeta');
        const headingTitle = extractTextAndId(compilationMeta.title)[0];
        pageMeta = {
            ...compilationMeta,
            title: frontmatterTitle || headingTitle,
            headingTitle,
            frontmatter
        };
        const result = `const frontmatter = ${JSON.stringify(frontmatter)};
${compileResult}
MDXContent.__RSPRESS_PAGE_META = {};

MDXContent.__RSPRESS_PAGE_META["${encodeURIComponent(normalizePath(node_path.relative(docDirectory, filepath)))}"] = ${JSON.stringify(pageMeta)};
`;
        return result;
    } catch (e) {
        if (e instanceof Error) throw e;
        logger.error(`MDX compile error: ${e} in ${filepath}`);
        throw new Error(`MDX compile error: ${e} in ${filepath}`);
    }
}
const cache = new Map();
async function compileWithCrossCompilerCache(options) {
    const task = cache.get(options.filepath);
    if (task) return task;
    const promise = compile(options);
    cache.set(options.filepath, promise);
    return promise;
}
export { compile, compileWithCrossCompilerCache };
