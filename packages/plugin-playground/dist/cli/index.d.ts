import type { EditorProps } from '@monaco-editor/react';
import type { loader } from '@monaco-editor/react';
import type { RouteMeta } from '@rspress/shared';
import type { RspressPlugin } from '@rspress/shared';

declare interface PlaygroundOptions {
    render: string;
    include: Array<string | [string, string]>;
    defaultDirection: 'horizontal' | 'vertical';
    editorPosition: 'left' | 'right';
    babelUrl: string;
    monacoLoader: Parameters<typeof loader.config>[0];
    monacoOptions: EditorProps['options'];
    /**
     * determine how to handle a internal code block without meta
     * @default 'playground'
     */
    defaultRenderMode?: 'pure' | 'playground';
}

/**
 * The plugin is used to preview component.
 */
export declare function pluginPlayground(options?: Partial<PlaygroundOptions>): RspressPlugin;

export declare let routeMeta: RouteMeta[];

export { }
