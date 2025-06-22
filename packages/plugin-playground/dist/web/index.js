import react, { loader } from "@monaco-editor/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useDark } from "@rspress/core/runtime";
import react_0, { Component, useMemo } from "react";
const DEFAULT_MONACO_URL = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs';
function initLoader() {
    let loaderConfig = {
        paths: {
            vs: DEFAULT_MONACO_URL
        }
    };
    try {
        const keys = Object.keys(__PLAYGROUND_MONACO_LOADER__);
        if (keys.length > 0) loaderConfig = __PLAYGROUND_MONACO_LOADER__;
    } catch (_e) {}
    loader.config(loaderConfig);
}
initLoader();
function getMonacoOptions() {
    try {
        return __PLAYGROUND_MONACO_OPTIONS__;
    } catch (_e) {}
    return {};
}
function Editor(props) {
    const { options, className = '', theme: themeProp, ...rest } = props || {};
    const dark = useDark();
    const theme = useMemo(()=>{
        if (themeProp) return themeProp;
        return dark ? 'vs-dark' : 'light';
    }, [
        themeProp,
        dark
    ]);
    return /*#__PURE__*/ jsx("div", {
        className: `rspress-playground-editor ${className}`,
        children: /*#__PURE__*/ jsx(react, {
            ...rest,
            theme: theme,
            options: {
                minimap: {
                    enabled: true,
                    autohide: true
                },
                fontSize: 14,
                lineNumbersMinChars: 7,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordBasedSuggestions: true,
                quickSuggestions: true,
                scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8
                },
                scrollPredominantAxis: false,
                ...getMonacoOptions(),
                ...options
            }
        })
    });
}
function createVariableDeclaration(id, init) {
    return {
        type: 'VariableDeclaration',
        declarations: [
            {
                type: 'VariableDeclarator',
                id: 'string' == typeof id ? {
                    type: 'Identifier',
                    name: id
                } : id,
                init
            }
        ],
        kind: 'const'
    };
}
function createIdentifier(name) {
    return {
        type: 'Identifier',
        name
    };
}
function createObjectProperty(key, value) {
    return {
        type: 'ObjectProperty',
        key: createIdentifier(key),
        computed: false,
        shorthand: key === value,
        value: createIdentifier(value)
    };
}
function createObjectPattern(names) {
    return {
        type: 'ObjectPattern',
        properties: names.map((name)=>Array.isArray(name) ? createObjectProperty(name[0], name[1]) : createObjectProperty(name, name))
    };
}
function createGetImport(name, getDefault) {
    return {
        type: 'CallExpression',
        callee: {
            type: 'Identifier',
            name: '__get_import'
        },
        arguments: [
            {
                type: 'StringLiteral',
                value: name
            },
            {
                type: 'BooleanLiteral',
                value: Boolean(getDefault)
            }
        ]
    };
}
async function loadUmdBabelModule() {
    const data = await fetch(__PLAYGROUND_BABEL_URL__);
    const umdSourceCode = await data.text();
    const run = new Function('exports', 'module', 'require', `with(exports, module, require) {${umdSourceCode}}`);
    const exports = {};
    const module = {
        exports
    };
    const require = ()=>{};
    run(exports, module, require);
    return exports;
}
let loadBabelPromise = null;
async function getBabel() {
    if (window.Babel) return window.Babel;
    if (loadBabelPromise) return loadBabelPromise;
    loadBabelPromise = loadUmdBabelModule();
    try {
        const Babel = await loadBabelPromise;
        window.Babel = Babel;
        return Babel;
    } catch (e) {
        loadBabelPromise = null;
        throw e;
    }
}
const DEBOUNCE_TIME = 800;
class Runner extends Component {
    static getDerivedStateFromError(error) {
        return {
            error,
            comp: null
        };
    }
    timer = null;
    constructor(props){
        super(props);
        this.state = {
            error: void 0,
            comp: null
        };
        this.doCompile = this.doCompile.bind(this);
        this.waitCompile = this.waitCompile.bind(this);
    }
    waitCompile(targetCode) {
        if (this.timer) clearTimeout(this.timer);
        this.timer = window.setTimeout(()=>{
            this.timer = null;
            this.doCompile(targetCode);
        }, DEBOUNCE_TIME);
    }
    async doCompile(targetCode) {
        const { language, getImport } = this.props;
        const babel = await getBabel();
        try {
            const presets = [
                [
                    babel.availablePresets.react
                ],
                [
                    babel.availablePresets.env,
                    {
                        modules: 'commonjs'
                    }
                ]
            ];
            if ('tsx' === language || 'ts' === language) presets.unshift([
                babel.availablePresets.typescript,
                {
                    allExtensions: true,
                    isTSX: 'tsx' === language
                }
            ]);
            const result = babel.transform(targetCode, {
                sourceType: 'module',
                sourceMaps: 'inline',
                presets,
                plugins: [
                    {
                        pre () {
                            this.hasReactImported = false;
                        },
                        visitor: {
                            ImportDeclaration (path) {
                                const pkg = path.node.source.value;
                                const code = [];
                                const specifiers = [];
                                for (const specifier of path.node.specifiers){
                                    if ('React' === specifier.local.name) this.hasReactImported = true;
                                    if ('ImportDefaultSpecifier' === specifier.type) code.push(createVariableDeclaration(specifier.local.name, createGetImport(pkg, true)));
                                    if ('ImportNamespaceSpecifier' === specifier.type) code.push(createVariableDeclaration(specifier.local.name, createGetImport(pkg)));
                                    if ('ImportSpecifier' === specifier.type) if ('name' in specifier.imported && specifier.imported.name !== specifier.local.name) specifiers.push([
                                        specifier.imported.name,
                                        specifier.local.name
                                    ]);
                                    else specifiers.push(specifier.local.name);
                                }
                                if (specifiers.length > 0) code.push(createVariableDeclaration(createObjectPattern(specifiers), createGetImport(pkg)));
                                path.replaceWithMultiple(code);
                            }
                        },
                        post (file) {
                            if (!this.hasReactImported) file.ast.program.body.unshift(createVariableDeclaration('React', createGetImport('react', true)));
                        }
                    }
                ]
            });
            if (targetCode !== this.props.code || !result || !result.code) return;
            const runExports = {};
            const func = new Function('__get_import', 'exports', result.code);
            func(getImport, runExports);
            if (runExports.default) return void this.setState({
                error: void 0,
                comp: /*#__PURE__*/ react_0.createElement(runExports.default)
            });
            this.setState({
                error: new Error('No default export')
            });
        } catch (e) {
            if (targetCode !== this.props.code) return;
            console.error(e);
            this.setState({
                error: e
            });
        }
    }
    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);
    }
    componentDidMount() {
        this.doCompile(this.props.code);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.code !== this.props.code) this.waitCompile(this.props.code);
    }
    render() {
        const { className = '', code, language, getImport, ...rest } = this.props;
        const { error, comp } = this.state;
        return /*#__PURE__*/ jsxs("div", {
            className: `rspress-playground-runner ${className}`,
            ...rest,
            children: [
                comp,
                error && /*#__PURE__*/ jsx("pre", {
                    className: "rspress-playground-error",
                    children: error.message
                })
            ]
        });
    }
}
export { Editor, react as MonacoEditor, loader as MonacoEditorLoader, Runner };
