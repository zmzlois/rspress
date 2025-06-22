import node_net from "node:net";
import node_path, { dirname, join, resolve as external_node_path_resolve } from "node:path";
import { createRsbuild, mergeRsbuildConfig } from "@rsbuild/core";
import { pluginBabel } from "@rsbuild/plugin-babel";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSolid } from "@rsbuild/plugin-solid";
import { RSPRESS_TEMP_DIR, normalizePosixPath, removeTrailingSlash } from "@rspress/shared";
import { cloneDeep, isEqual } from "lodash";
import node_fs, { writeFileSync } from "node:fs";
const staticPath = node_path.join(__dirname, '..', 'static');
const demoBlockComponentPath = node_path.join(staticPath, 'global-components', 'DemoBlock.tsx');
const virtualDir = node_path.join(process.cwd(), 'node_modules', RSPRESS_TEMP_DIR, 'virtual-demo');
const toValidVarName = (str)=>{
    if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str)) return str;
    return str.replace(/[^0-9a-zA-Z_$]/g, '_').replace(/^([0-9])/, '_$1');
};
const generateId = (pageName, index)=>`_${toValidVarName(pageName)}_${index}`;
const injectDemoBlockImport = (str, path)=>`
    import DemoBlock from ${JSON.stringify(path)};
    ${str}
  `;
const getLangFileExt = (lang)=>{
    switch(lang){
        case 'jsx':
        case 'tsx':
            return 'tsx';
        case 'json':
            return 'tsx';
        default:
            return lang;
    }
};
function generateEntry(demos, framework, position, customEntry) {
    const sourceEntry = {};
    const entryCssPath = join(staticPath, 'global-styles', 'entry.css');
    if ('follow' === position) Object.values(demos).forEach((routes)=>{
        routes.forEach((route)=>{
            const { id, path: demoPath } = route;
            const entry = join(virtualDir, `${id}.entry.tsx`);
            const solidEntry = `
        import { render } from 'solid-js/web';
        import ${JSON.stringify(entryCssPath)};
        import Demo from ${JSON.stringify(demoPath)};
        render(() => <Demo />, document.getElementById('root'));
        `;
            const reactEntry = `
        import { createRoot } from 'react-dom/client';
        import ${JSON.stringify(entryCssPath)};
        import Demo from ${JSON.stringify(demoPath)};
        const container = document.getElementById('root');
        createRoot(container).render(<Demo />);
        `;
            const entryContent = customEntry ? customEntry({
                entryCssPath,
                demoPath
            }) : 'react' === framework ? reactEntry : solidEntry;
            writeFileSync(entry, entryContent);
            sourceEntry[id] = entry;
        });
    });
    else Object.entries(demos).forEach(([key, routes])=>{
        if (0 === routes.length) return;
        const reactContent = `
        import { createRoot } from 'react-dom/client';
        import ${JSON.stringify(entryCssPath)};
        ${routes.map((demo, index)=>`import Demo_${index} from ${JSON.stringify(demo.path)}`).join('\n')}
        function App() {
          return (
            <div className="preview-container">
              <div className="preview-nav">{"${routes[0].title}"}</div>
              ${routes.map((_demo, index)=>`<Demo_${index} />`).join('\n')}
            </div>
          )
        }
        const container = document.getElementById('root');
        createRoot(container).render(<App />);
      `;
        const solidContent = `
        import { render } from 'solid-js/web';
        import ${JSON.stringify(entryCssPath)};
        ${routes.map((demo, index)=>`import Demo_${index} from ${JSON.stringify(demo.path)}`).join('\n')}
        function App() {
          return (
            <div class="preview-container">
              <div class="preview-nav">{"${routes[0].title}"}</div>
              ${routes.map((_, index)=>`<Demo_${index} />`).join('\n')}
            </div>
          )
        }
        render(() => <App /> , document.getElementById('root'));
      `;
        const renderContent = 'solid' === framework ? solidContent : reactContent;
        const id = `_${toValidVarName(key)}`;
        const entry = join(virtualDir, `${id}.entry.tsx`);
        writeFileSync(entry, renderContent);
        sourceEntry[id] = entry;
    });
    return sourceEntry;
}
const convert = function(test) {
    if (null == test) return ok;
    if ('function' == typeof test) return castFactory(test);
    if ('object' == typeof test) return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
    if ('string' == typeof test) return typeFactory(test);
    throw new Error('Expected function, string, or object as test');
};
function anyFactory(tests) {
    const checks = [];
    let index = -1;
    while(++index < tests.length)checks[index] = convert(tests[index]);
    return castFactory(any);
    function any(...parameters) {
        let index = -1;
        while(++index < checks.length)if (checks[index].apply(this, parameters)) return true;
        return false;
    }
}
function propsFactory(check) {
    const checkAsRecord = check;
    return castFactory(all);
    function all(node) {
        const nodeAsRecord = node;
        let key;
        for(key in check)if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
        return true;
    }
}
function typeFactory(check) {
    return castFactory(type);
    function type(node) {
        return node && node.type === check;
    }
}
function castFactory(testFunction) {
    return check;
    function check(value, index, parent) {
        return Boolean(looksLikeANode(value) && testFunction.call(this, value, 'number' == typeof index ? index : void 0, parent || void 0));
    }
}
function ok() {
    return true;
}
function looksLikeANode(value) {
    return null !== value && 'object' == typeof value && 'type' in value;
}
function color(d) {
    return '\u001B[33m' + d + '\u001B[39m';
}
const empty = [];
const CONTINUE = true;
const EXIT = false;
const SKIP = 'skip';
function visitParents(tree, test, visitor, reverse) {
    let check;
    if ('function' == typeof test && 'function' != typeof visitor) {
        reverse = visitor;
        visitor = test;
    } else check = test;
    const is = convert(check);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node, index, parents) {
        const value = node && 'object' == typeof node ? node : {};
        if ('string' == typeof value.type) {
            const name = 'string' == typeof value.tagName ? value.tagName : 'string' == typeof value.name ? value.name : void 0;
            Object.defineProperty(visit, 'name', {
                value: 'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
            });
        }
        return visit;
        function visit() {
            let result = empty;
            let subresult;
            let offset;
            let grandparents;
            if (!test || is(node, index, parents[parents.length - 1] || void 0)) {
                result = toResult(visitor(node, parents));
                if (result[0] === EXIT) return result;
            }
            if ('children' in node && node.children) {
                const nodeAsParent = node;
                if (nodeAsParent.children && result[0] !== SKIP) {
                    offset = (reverse ? nodeAsParent.children.length : -1) + step;
                    grandparents = parents.concat(nodeAsParent);
                    while(offset > -1 && offset < nodeAsParent.children.length){
                        const child = nodeAsParent.children[offset];
                        subresult = factory(child, offset, grandparents)();
                        if (subresult[0] === EXIT) return subresult;
                        offset = 'number' == typeof subresult[1] ? subresult[1] : offset + step;
                    }
                }
            }
            return result;
        }
    }
}
function toResult(value) {
    if (Array.isArray(value)) return value;
    if ('number' == typeof value) return [
        CONTINUE,
        value
    ];
    return null == value ? empty : [
        value
    ];
}
function lib_visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
    let reverse;
    let test;
    let visitor;
    if ('function' == typeof testOrVisitor && 'function' != typeof visitorOrReverse) {
        test = void 0;
        visitor = testOrVisitor;
        reverse = visitorOrReverse;
    } else {
        test = testOrVisitor;
        visitor = visitorOrReverse;
        reverse = maybeReverse;
    }
    visitParents(tree, test, overload, reverse);
    function overload(node, parents) {
        const parent = parents[parents.length - 1];
        const index = parent ? parent.children.indexOf(node) : void 0;
        return visitor(node, index, parent);
    }
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
const getExternalDemoContent = (tempVar)=>({
        type: 'mdxJsxFlowElement',
        name: '',
        attributes: [],
        children: [
            {
                type: 'mdxJsxFlowElement',
                name: 'pre',
                attributes: [],
                children: [
                    {
                        type: 'mdxJsxFlowElement',
                        name: 'code',
                        attributes: [
                            {
                                type: 'mdxJsxAttribute',
                                name: 'className',
                                value: 'language-tsx'
                            },
                            {
                                type: 'mdxJsxAttribute',
                                name: 'children',
                                value: {
                                    type: 'mdxJsxExpressionAttribute',
                                    value: tempVar,
                                    data: {
                                        estree: {
                                            type: 'Program',
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
                            }
                        ]
                    }
                ]
            }
        ]
    });
const remarkPlugin_demos = {};
const remarkCodeToDemo = function({ getRouteMeta, previewMode, defaultRenderMode, position, previewLanguages, previewCodeTransform }) {
    const routeMeta = getRouteMeta();
    node_fs.mkdirSync(virtualDir, {
        recursive: true
    });
    const data = this.data();
    return (tree, vfile)=>{
        const demoMdx = [];
        const route = routeMeta.find((meta)=>normalizePosixPath(meta.absolutePath) === normalizePosixPath(vfile.path || vfile.history[0]));
        if (!route) return;
        const { pageName } = route;
        remarkPlugin_demos[pageName] = [];
        let title = pageName;
        let index = 1;
        function constructDemoNode(demoId, demoPath, currentNode, isMobileMode, externalDemoIndex) {
            if (isMobileMode) {
                const relativePathReg = new RegExp(/^\.\.?\/.*$/);
                remarkPlugin_demos[pageName].push({
                    title,
                    id: demoId,
                    path: relativePathReg.test(demoPath) ? external_node_path_resolve(vfile.dirname || dirname(vfile.path), demoPath) : demoPath
                });
            } else demoMdx.push(getASTNodeImport(`Demo${demoId}`, demoPath));
            const tempVar = `externalDemoContent${externalDemoIndex}`;
            if (void 0 !== externalDemoIndex) demoMdx.push(getASTNodeImport(tempVar, `!!${demoPath}?raw`));
            if (isMobileMode && 'fixed' === position) void 0 !== externalDemoIndex && Object.assign(currentNode, getExternalDemoContent(tempVar));
            else Object.assign(currentNode, {
                type: 'mdxJsxFlowElement',
                name: 'Container',
                attributes: [
                    {
                        type: 'mdxJsxAttribute',
                        name: 'isMobile',
                        value: isMobileMode
                    },
                    {
                        type: 'mdxJsxAttribute',
                        name: 'demoId',
                        value: demoId
                    }
                ],
                children: [
                    void 0 === externalDemoIndex ? {
                        ...currentNode,
                        hasVisited: true
                    } : getExternalDemoContent(tempVar),
                    isMobileMode ? {
                        type: 'mdxJsxFlowElement',
                        name: null
                    } : {
                        type: 'mdxJsxFlowElement',
                        name: `Demo${demoId}`
                    }
                ]
            });
        }
        lib_visit(tree, 'heading', (node)=>{
            if (1 === node.depth) {
                const firstChild = node.children[0];
                title = firstChild && 'value' in firstChild && firstChild.value || title;
            }
        });
        lib_visit(tree, 'code', (node)=>{
            if ('hasVisited' in node) return;
            if (node.lang && previewLanguages.includes(node.lang)) {
                if (node.meta?.includes('pure') || !node.meta?.includes('preview') && 'pure' === defaultRenderMode) return;
                const isJsx = 'jsx' === node.lang || 'tsx' === node.lang;
                const value = isJsx ? injectDemoBlockImport(previewCodeTransform({
                    language: node.lang,
                    code: node.value
                }), demoBlockComponentPath) : previewCodeTransform({
                    language: node.lang,
                    code: node.value
                });
                const isMobileMode = node.meta?.includes('mobile') || node.meta?.includes('iframe') || !node.meta?.includes('web') && !node.meta?.includes('internal') && 'iframe' === previewMode;
                const id = generateId(pageName, index++);
                const virtualModulePath = join(virtualDir, `${id}.${getLangFileExt(node.lang)}`);
                constructDemoNode(id, virtualModulePath, node, isMobileMode);
                if (node_fs.existsSync(virtualModulePath)) {
                    const content = node_fs.readFileSync(virtualModulePath, 'utf-8');
                    if (content === value) return;
                }
                node_fs.writeFileSync(virtualModulePath, value);
            }
        });
        tree.children.unshift(...demoMdx);
        if (remarkPlugin_demos[pageName].length > 0) data.pageMeta.haveDemos = true;
    };
};
let src_routeMeta;
const DEFAULT_PREVIEW_LANGUAGES = [
    'jsx',
    'tsx'
];
function pluginPreview(options) {
    const { isMobile = false, iframeOptions = {}, iframePosition = 'follow', defaultRenderMode = 'preview', previewLanguages = DEFAULT_PREVIEW_LANGUAGES, previewCodeTransform = ({ code })=>code } = options ?? {};
    const previewMode = options?.previewMode ?? (isMobile ? 'iframe' : 'internal');
    const { devPort = 7890, framework = 'react', position = iframePosition, builderConfig = {}, customEntry } = iframeOptions;
    const globalUIComponents = 'fixed' === position ? [
        join(staticPath, 'global-components', 'Device.tsx')
    ] : [];
    const getRouteMeta = ()=>src_routeMeta;
    let lastDemos;
    let devServer;
    let clientConfig;
    const port = devPort;
    return {
        name: '@rspress/plugin-preview',
        config (config) {
            config.markdown = config.markdown || {};
            return config;
        },
        routeGenerated (routes) {
            src_routeMeta = routes;
        },
        async beforeBuild (_, isProd) {
            if (!isProd) try {
                await new Promise((resolve, reject)=>{
                    const server = node_net.createServer();
                    server.unref();
                    server.on('error', reject);
                    server.listen({
                        port,
                        host: '0.0.0.0'
                    }, ()=>{
                        server.close(resolve);
                    });
                });
            } catch (e) {
                if (!!e && 'object' == typeof e && 'code' in e && 'EADDRINUSE' !== e.code) throw e;
                throw new Error(`Port "${port}" is occupied, please choose another one.`);
            }
        },
        async afterBuild (config, isProd) {
            if (isEqual(remarkPlugin_demos, lastDemos)) return;
            lastDemos = cloneDeep(remarkPlugin_demos);
            await devServer?.server?.close();
            devServer = void 0;
            const sourceEntry = generateEntry(remarkPlugin_demos, framework, position, customEntry);
            const outDir = join(config.outDir ?? 'doc_build', '~demo');
            if (0 === Object.keys(sourceEntry).length) return;
            const { html, source, output, performance } = clientConfig ?? {};
            const rsbuildConfig = mergeRsbuildConfig({
                dev: {
                    progressBar: false
                },
                server: {
                    port: devPort,
                    printUrls: ()=>void 0,
                    strictPort: true
                },
                performance: {
                    ...performance,
                    printFileSize: false
                },
                html,
                source: {
                    ...source,
                    entry: sourceEntry
                },
                output: {
                    ...output,
                    assetPrefix: output?.assetPrefix ? `${removeTrailingSlash(output.assetPrefix)}/~demo` : '/~demo',
                    distPath: {
                        root: outDir
                    },
                    copy: void 0
                },
                plugins: config?.builderPlugins
            }, builderConfig);
            const rsbuildInstance = await createRsbuild({
                callerName: 'rspress',
                rsbuildConfig
            });
            const { pluginSass } = await import("@rsbuild/plugin-sass");
            const { pluginLess } = await import("@rsbuild/plugin-less");
            rsbuildInstance.addPlugins([
                pluginSass(),
                pluginLess()
            ]);
            if ('solid' === framework) rsbuildInstance.addPlugins([
                pluginBabel({
                    include: /\.(?:jsx|tsx)$/
                }),
                pluginSolid()
            ]);
            if ('react' === framework) rsbuildInstance.addPlugins([
                pluginReact()
            ]);
            if (isProd) rsbuildInstance.build();
            else devServer = await rsbuildInstance.startDevServer();
        },
        builderConfig: {
            source: {
                include: [
                    join(__dirname, '..')
                ]
            },
            tools: {
                bundlerChain (chain) {
                    chain.module.rule('Raw').resourceQuery(/raw/).type('asset/source').end();
                    chain.resolve.extensions.prepend('.md').prepend('.mdx');
                },
                rspack: {
                    watchOptions: {
                        ignored: /\.git/
                    }
                }
            },
            plugins: [
                {
                    name: 'close-demo-server',
                    setup: (api)=>{
                        api.modifyRsbuildConfig((config)=>{
                            if (config.output?.target === 'web') clientConfig = config;
                        });
                        api.onCloseDevServer(async ()=>{
                            await devServer?.server?.close();
                            devServer = void 0;
                        });
                    }
                }
            ]
        },
        extendPageData (pageData, isProd) {
            if (!isProd) pageData.devPort = port;
        },
        markdown: {
            remarkPlugins: [
                [
                    remarkCodeToDemo,
                    {
                        getRouteMeta,
                        position,
                        previewMode,
                        defaultRenderMode,
                        previewLanguages,
                        previewCodeTransform
                    }
                ]
            ],
            globalComponents: [
                join(staticPath, 'global-components', 'Container.tsx')
            ]
        },
        globalUIComponents,
        globalStyles: join(staticPath, 'global-styles', `${previewMode}.css`)
    };
}
export { pluginPreview };
