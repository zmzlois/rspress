import node_path from "node:path";
import { fileURLToPath } from "node:url";
import gray_matter from "gray-matter";
import { logger } from "@rsbuild/core";
const extractTextAndId = (title)=>{
    if (!title) return [
        '',
        ''
    ];
    const customIdReg = /\\?{#.*}/;
    if (customIdReg.test(title)) {
        const text = title.replace(customIdReg, '').trimEnd();
        const customId = title.match(customIdReg)?.[0]?.slice(2, -1) || '';
        return [
            text,
            customId
        ];
    }
    return [
        title,
        ''
    ];
};
function getIconUrlPath(icon) {
    if (!icon) return;
    icon = icon.toString();
    if (icon.startsWith('file://')) icon = fileURLToPath(icon);
    if (!node_path.isAbsolute(icon)) return icon;
    return `/${node_path.basename(icon)}`;
}
function getNodeAttribute(node, attrName, attribute) {
    const found = node.attributes.find((attr)=>'name' in attr && attr.name === attrName);
    return attribute ? found : found?.value;
}
function loadFrontMatter(source, filepath, root, outputWarning = false) {
    try {
        const { content, data } = gray_matter(source);
        const rawFrontMatter = source.slice(0, source.length - content.length);
        const emptyLinesSource = rawFrontMatter.length ? `${rawFrontMatter.replace(/[^\n]/g, '')}${content}` : content;
        return {
            content,
            frontmatter: data,
            emptyLinesSource
        };
    } catch (e) {
        if (outputWarning) logger.warn(`Parse frontmatter error in ${node_path.relative(root, filepath)}: \n`, e);
    }
    return {
        content: '',
        frontmatter: {},
        emptyLinesSource: source
    };
}
const castArray = (value)=>Array.isArray(value) ? value : [
        value
    ];
const mergeDocConfig = async (...configs)=>{
    const { mergeWith } = await import("lodash-es");
    return mergeWith({}, ...configs, (target, source)=>{
        const pair = [
            target,
            source
        ];
        if (pair.some((item)=>void 0 === item)) return;
        if (pair.some((item)=>Array.isArray(item))) return [
            ...castArray(target),
            ...castArray(source)
        ];
    });
};
export { extractTextAndId, getIconUrlPath, getNodeAttribute, loadFrontMatter, mergeDocConfig };
