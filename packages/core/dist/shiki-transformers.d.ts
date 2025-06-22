import type { ShikiTransformer } from 'shiki';

declare interface ITransformerLineNumberOptions {
    classActivePre?: string;
    classActiveLine?: string;
}

export declare const SHIKI_TRANSFORMER_ADD_TITLE = "shiki-transformer:add-title";

export declare const SHIKI_TRANSFORMER_LINE_NUMBER = "shiki-transformer:line-number";

export declare const SHIKI_TRANSFORMER_META_HIGHLIGHT = "shiki-transformer:compatible-meta-highlight";

export declare function transformerAddTitle(): ShikiTransformer;

/**
 * Allow using `{1,3-5}` in the code snippet meta to mark highlighted lines.
 * @deprecated This is a workaround when migrating to Rspress 2.0, you should migrate to `import { transformerNotationHighlight } from '@shikijs/transformers'` instead.
 */
export declare function transformerCompatibleMetaHighlight(options?: TransformerMetaHighlightOptions): ShikiTransformer;

export declare function transformerLineNumber(options?: ITransformerLineNumberOptions): ShikiTransformer;

declare interface TransformerMetaHighlightOptions {
    /**
     * Class for highlighted lines
     *
     * @default 'highlighted'
     */
    classActiveLine?: string;
    /**
     *
     * @default 'has-highlighted'
     */
    classActivePre?: string;
}

export { }
