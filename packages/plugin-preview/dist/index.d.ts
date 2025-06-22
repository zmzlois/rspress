import type { RsbuildConfig } from '@rsbuild/core';
import { RspressPlugin } from '@rspress/shared';

declare interface CustomEntry {
    entryCssPath: string;
    demoPath: string;
}

declare type IframeOptions = {
    /**
     * framework in the iframe
     * @default 'react'
     */
    framework?: 'react' | 'solid';
    /**
     * position of the iframe
     * @default 'follow'
     */
    position?: 'fixed' | 'follow';
    /**
     * dev server port for the iframe
     * @default 7890
     */
    devPort?: number;
    builderConfig?: RsbuildConfig;
    /**
     * custom support for other web frameworks
     */
    customEntry?: (meta: CustomEntry) => string;
};

export declare type Options = {
    /**
     * @deprecated Use previewMode instead.
     * true = 'iframe'
     * false = 'internal'
     */
    isMobile?: boolean;
    /**
     * @deprecated Use iframeOptions.position instead.
     */
    iframePosition?: 'fixed' | 'follow';
    /**
     * internal mode: component will be rendered inside the documentation, only support react.
     *
     * iframe mode: component will be rendered in iframe, note that aside will hide.
     * @default 'internal'
     */
    previewMode?: 'internal' | 'iframe';
    /**
     * enable when preview mode is iframe.
     */
    iframeOptions?: IframeOptions;
    /**
     * determine how to handle a internal code block without meta
     * @default 'preview'
     */
    defaultRenderMode?: 'pure' | 'preview';
    /**
     * Supported languages to be previewed
     */
    previewLanguages?: string[];
    /**
     * Transform previewed code in custom way
     */
    previewCodeTransform?: (codeInfo: {
        language: string;
        code: string;
    }) => string;
};

/**
 * The plugin is used to preview component.
 */
export declare function pluginPreview(options?: Options): RspressPlugin;

export { }
