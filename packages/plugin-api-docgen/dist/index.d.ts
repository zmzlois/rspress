import type { CompilerOptions } from 'typescript';
import type { ParserOptions } from 'react-docgen-typescript';
import type { RspressPlugin } from '@rspress/shared';

declare type ApiParseTool = 'documentation' | 'react-docgen-typescript';

declare type DocumentationArgs = {
    external?: Array<string>;
    shallow?: boolean;
    order?: Array<unknown>;
    access?: Array<string>;
    hljs?: {
        highlightAuto?: boolean;
        languages?: string;
    };
    inferPrivate?: string;
    extension?: string | Array<string>;
    noReferenceLinks?: boolean;
};

declare type Entries = Record<string, string>;

declare type ParseToolOptions = {
    'react-docgen-typescript'?: ParserOptions & {
        tsconfigPath?: Record<string, string>;
        compilerOptions?: Record<string, CompilerOptions>;
    };
    documentation?: DocumentationArgs;
};

/**
 * The plugin is used to generate api doc for files.
 */
export declare function pluginApiDocgen(options?: PluginOptions): RspressPlugin;

export declare type PluginOptions = {
    /**
     * Module entries
     * @zh 传入自动生成文档的模块名称及相对路径
     */
    entries?: Entries | ToolEntries;
    /**
     * apiParseTool
     * @experimental
     * @zh 解析工具
     * @default 'react-docgen-typescript'
     */
    apiParseTool?: ApiParseTool;
    /**
     * parserToolOptions
     * @experimental
     * @zh 解析器参数
     */
    parseToolOptions?: ParseToolOptions;
    /**
     * appDirectory
     * @zh 项目根目录
     * @default process.cwd()
     */
    appDir?: string;
};

declare type ToolEntries = {
    documentation: Entries;
    'react-docgen-typescript': Entries;
};

export { }
