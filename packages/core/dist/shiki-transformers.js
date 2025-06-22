/*! For license information please see shiki-transformers.js.LICENSE.txt */
import __rslib_shim_module__ from 'module';
/*#__PURE__*/ import.meta.url;
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
/**
 * these codes are copied from @shiki/transformers, transformerMetaHighlight
 * @source https://github.com/shikijs/shiki/blob/f5cf06f55a0b4643d7b02f15ee2c5033be6f1245/packages/transformers/src/transformers/meta-highlight.ts#L56
 * @license MIT
 */ function parseMetaHighlightString(meta) {
    if (!meta) return null;
    const match = meta.match(/\{([\d,-]+)\}/);
    if (!match) return null;
    const lines = match[1].split(',').flatMap((v)=>{
        const num = v.split('-').map((v)=>Number.parseInt(v, 10));
        if (1 === num.length) return [
            num[0]
        ];
        return Array.from({
            length: num[1] - num[0] + 1
        }, (_, i)=>i + num[0]);
    });
    return lines;
}
const symbol = Symbol('highlighted-lines');
const SHIKI_TRANSFORMER_META_HIGHLIGHT = 'shiki-transformer:compatible-meta-highlight';
function transformerCompatibleMetaHighlight(options = {}) {
    const { classActiveLine = 'highlighted', classActivePre = 'has-highlighted' } = options;
    return {
        name: '@shikijs/transformers:meta-highlight',
        line (node, line) {
            if (!this.options.meta?.__raw) return;
            const meta = this.meta;
            meta[symbol] ??= parseMetaHighlightString(this.options.meta.__raw);
            const lines = meta[symbol] ?? [];
            if (lines.includes(line)) this.addClassToHast(node, classActiveLine);
            return node;
        },
        pre (hast) {
            this.addClassToHast(hast, classActivePre);
            return hast;
        }
    };
}
export { SHIKI_TRANSFORMER_ADD_TITLE, SHIKI_TRANSFORMER_LINE_NUMBER, SHIKI_TRANSFORMER_META_HIGHLIGHT, transformerAddTitle, transformerCompatibleMetaHighlight, transformerLineNumber };
