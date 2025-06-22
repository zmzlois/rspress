import { fileURLToPath as __webpack_fileURLToPath__ } from "node:url";
import { dirname as __webpack_dirname__ } from "node:path";
import node_fs from "node:fs";
import node_path, { dirname, join, resolve } from "node:path";
import { getNodeAttribute } from "@rspress/shared/node-utils";
import { RspackVirtualModulePlugin } from "rspack-plugin-virtual-module";
import { visit as external_unist_util_visit_visit } from "unist-util-visit";
import napi from "@oxidation-compiler/napi";
const DEFAULT_BABEL_URL = 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.22.20/babel.min.js';
const DEFAULT_MONACO_URL = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs';
function normalizeUrl(u) {
    return u.replace(/\/\//g, '/');
}
const parseImports = (code, sourceExt)=>{
    const parsed = napi.parseSync(code, {
        sourceType: 'module',
        sourceFilename: `index.${sourceExt}`
    });
    const ast = JSON.parse(parsed.program);
    const result = [];
    ast.body.forEach((statement)=>{
        if ('ImportDeclaration' === statement.type) result.push(statement.source.value);
    });
    return result;
};
const getNodeMeta = (node, metaName)=>{
    if (!node.meta) return;
    const meta = node.meta.split(' ');
    const item = meta.find((x)=>x.startsWith(metaName));
    if (item?.startsWith(`${metaName}=`)) return item.slice(metaName.length + 1);
    return item;
};
function createPlaygroundNode(currentNode, attrs) {
    Object.assign(currentNode, {
        type: 'mdxJsxFlowElement',
        name: 'Playground',
        attributes: attrs.map((it)=>({
                type: 'mdxJsxAttribute',
                name: it[0],
                value: it[1]
            }))
    });
}
const remarkPlugin = ({ getRouteMeta, editorPosition, defaultRenderMode })=>{
    const routeMeta = getRouteMeta();
    return (tree, vfile)=>{
        const route = routeMeta.find((meta)=>resolve(meta.absolutePath) === resolve(vfile.path || vfile.history[0]));
        if (!route) return;
        external_unist_util_visit_visit(tree, 'mdxJsxFlowElement', (node)=>{
            if ('code' === node.name) {
                const src = getNodeAttribute(node, 'src');
                if ('string' != typeof src) return;
                const demoPath = join(dirname(route.absolutePath), src);
                if (!node_fs.existsSync(demoPath)) return;
                const direction = getNodeAttribute(node, 'direction') || '';
                const code = node_fs.readFileSync(demoPath, {
                    encoding: 'utf8'
                });
                const language = src.slice(src.lastIndexOf('.') + 1);
                createPlaygroundNode(node, [
                    [
                        'code',
                        code
                    ],
                    [
                        'language',
                        language
                    ],
                    [
                        'direction',
                        direction
                    ],
                    [
                        'editorPosition',
                        editorPosition
                    ]
                ]);
            }
        });
        external_unist_util_visit_visit(tree, 'code', (node)=>{
            if ('jsx' === node.lang || 'tsx' === node.lang) {
                const hasPureMeta = node.meta?.includes('pure');
                const hasPlaygroundMeta = node.meta?.includes('playground');
                let noTransform;
                switch(defaultRenderMode){
                    case 'pure':
                        noTransform = !hasPlaygroundMeta;
                        break;
                    case 'playground':
                        noTransform = hasPureMeta;
                        break;
                    default:
                        break;
                }
                if (noTransform) return;
                const direction = getNodeMeta(node, 'direction') || '';
                createPlaygroundNode(node, [
                    [
                        'code',
                        node.value
                    ],
                    [
                        'language',
                        node.lang
                    ],
                    [
                        'direction',
                        direction
                    ],
                    [
                        'editorPosition',
                        editorPosition
                    ]
                ]);
            }
        });
    };
};
var cli_dirname = __webpack_dirname__(__webpack_fileURLToPath__(import.meta.url));
const pkgRootPath = node_path.join(cli_dirname, '../../');
const staticPath = node_path.join(pkgRootPath, 'static');
let cli_routeMeta;
function pluginPlayground(options) {
    const { render = '', include, defaultDirection = 'horizontal', editorPosition = 'left', babelUrl = DEFAULT_BABEL_URL, monacoLoader = {}, monacoOptions = {}, defaultRenderMode = 'playground' } = options || {};
    const playgroundVirtualModule = new RspackVirtualModulePlugin({});
    const getRouteMeta = ()=>cli_routeMeta;
    if (render && !/Playground\.(jsx?|tsx?)$/.test(render)) throw new Error('[Playground]: render should ends with Playground.(jsx?|tsx?)');
    const preloads = [];
    const monacoPrefix = monacoLoader.paths?.vs || DEFAULT_MONACO_URL;
    preloads.push(normalizeUrl(`${monacoPrefix}/loader.js`));
    preloads.push(normalizeUrl(`${monacoPrefix}/editor/editor.main.js`));
    return {
        name: '@rspress/plugin-playground',
        config (config, { removePlugin }) {
            config.markdown = config.markdown || {};
            removePlugin('@rspress/plugin-preview');
            return config;
        },
        async routeGenerated (routes) {
            cli_routeMeta = routes;
            const files = routes.map((route)=>route.absolutePath);
            const imports = {};
            await Promise.all(files.map(async (filepath, _index)=>{
                const isMdxFile = /\.mdx?$/.test(filepath);
                if (!isMdxFile) return;
                const { createProcessor } = await import("@mdx-js/mdx");
                const { visit } = await import("unist-util-visit");
                const { default: remarkGFM } = await import("remark-gfm");
                try {
                    const processor = createProcessor({
                        format: node_path.extname(filepath).slice(1),
                        remarkPlugins: [
                            remarkGFM
                        ]
                    });
                    const source = await node_fs.promises.readFile(filepath, 'utf-8');
                    const ast = processor.parse(source);
                    visit(ast, 'mdxJsxFlowElement', (node)=>{
                        if ('code' === node.name) {
                            const src = getNodeAttribute(node, 'src');
                            if ('string' != typeof src) return;
                            const demoPath = join(node_path.dirname(filepath), src);
                            if (!node_fs.existsSync(demoPath)) return;
                            const code = node_fs.readFileSync(demoPath, {
                                encoding: 'utf8'
                            });
                            const thisImports = parseImports(code, node_path.extname(demoPath));
                            thisImports.forEach((x)=>{
                                if (void 0 === imports[x]) imports[x] = x;
                            });
                        }
                    });
                    visit(ast, 'code', (node)=>{
                        if ('jsx' === node.lang || 'tsx' === node.lang) {
                            const { value, meta } = node;
                            const hasPureMeta = meta?.includes('pure');
                            const hasPlaygroundMeta = meta?.includes('playground');
                            let noTransform;
                            switch(defaultRenderMode){
                                case 'pure':
                                    noTransform = !hasPlaygroundMeta;
                                    break;
                                case 'playground':
                                    noTransform = hasPureMeta;
                                    break;
                                default:
                                    break;
                            }
                            if (noTransform) return;
                            const thisImports = parseImports(value, node.lang);
                            thisImports.forEach((x)=>{
                                if (void 0 === imports[x]) imports[x] = x;
                            });
                        }
                    });
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            }));
            if (include) include.forEach((item)=>{
                if ('string' == typeof item) imports[item] = item;
                else imports[item[0]] = item[1];
            });
            if (!('react' in imports)) imports.react = 'react';
            const importKeys = Object.keys(imports);
            const code = [
                ...importKeys.map((x, index)=>`import * as i_${index} from '${imports[x]}';`),
                'const imports = new Map();',
                ...importKeys.map((x, index)=>`imports.set('${x}', i_${index});`),
                'function getImport(name, getDefault) {',
                '  if (!imports.has(name)) {',
                '    throw new Error("Module " + name + " not found");',
                '  }',
                '  const result = imports.get(name);',
                '  if (getDefault && typeof result === "object") {',
                '    return result.default || result;',
                '  }',
                '  return result;',
                '}',
                'export { imports };',
                'export default getImport;'
            ].join('\n');
            playgroundVirtualModule.writeModule('_rspress_playground_imports', code);
        },
        builderConfig: {
            source: {
                define: {
                    __PLAYGROUND_DIRECTION__: JSON.stringify(defaultDirection),
                    __PLAYGROUND_MONACO_LOADER__: JSON.stringify(monacoLoader),
                    __PLAYGROUND_MONACO_OPTIONS__: JSON.stringify(monacoOptions),
                    __PLAYGROUND_BABEL_URL__: JSON.stringify(babelUrl)
                },
                include: [
                    pkgRootPath
                ]
            },
            html: {
                tags: preloads.map((url)=>({
                        tag: 'link',
                        head: true,
                        attrs: {
                            rel: 'preload',
                            href: url,
                            as: "script"
                        }
                    }))
            },
            tools: {
                rspack: {
                    plugins: [
                        playgroundVirtualModule
                    ]
                }
            }
        },
        markdown: {
            remarkPlugins: [
                [
                    remarkPlugin,
                    {
                        getRouteMeta,
                        editorPosition,
                        defaultRenderMode
                    }
                ]
            ],
            globalComponents: [
                render ? render : node_path.join(staticPath, 'global-components', 'Playground.tsx')
            ]
        },
        globalStyles: node_path.join(staticPath, 'global-styles', 'web.css')
    };
}
export { pluginPlayground, cli_routeMeta as routeMeta };
