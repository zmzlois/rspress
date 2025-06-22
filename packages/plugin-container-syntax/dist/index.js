import node_path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizePosixPath } from "@rspress/shared";
const DIRECTIVE_TYPES = [
    'tip',
    'note',
    'warning',
    'caution',
    'danger',
    'info',
    'details'
];
const REGEX_BEGIN = /^\s*:::\s*(\w+)\s*(.*)?/;
const REGEX_END = /\s*:::$/;
const REGEX_GH_BEGIN = /^\s*\s*\[!(\w+)\]\s*(.*)?/;
const TITLE_REGEX_IN_MD = /{\s*title=["']?(.+)}\s*/;
const TITLE_REGEX_IN_MDX = /\s*title=["']?(.+)\s*/;
const trimTailingQuote = (str)=>str.replace(/['"]$/g, '');
const parseTitle = (rawTitle = '', isMDX = false)=>{
    const matched = rawTitle?.match(isMDX ? TITLE_REGEX_IN_MDX : TITLE_REGEX_IN_MD);
    return trimTailingQuote(matched?.[1] || rawTitle);
};
const createContainer = (type, title, children)=>{
    const isDetails = 'details' === type;
    const rootHName = isDetails ? 'details' : 'div';
    const titleHName = isDetails ? 'summary' : 'div';
    return {
        type: 'containerDirective',
        data: {
            hName: rootHName,
            hProperties: {
                class: `rspress-directive ${type}`
            }
        },
        children: [
            {
                type: 'paragraph',
                data: {
                    hName: titleHName,
                    hProperties: {
                        class: 'rspress-directive-title'
                    }
                },
                children: [
                    {
                        type: 'text',
                        value: title || type.toUpperCase()
                    }
                ]
            },
            {
                type: 'paragraph',
                data: {
                    hName: 'div',
                    hProperties: {
                        class: 'rspress-directive-content'
                    }
                },
                children: children
            }
        ]
    };
};
function transformer(tree) {
    let i = 0;
    try {
        while(i < tree.children.length){
            const node = tree.children[i];
            if ('children' in node) transformer(node);
            if ('containerDirective' === node.type) {
                const type = node.name;
                if (DIRECTIVE_TYPES.includes(type)) tree.children.splice(i, 1, createContainer(type, node.attributes?.title ?? type.toUpperCase(), node.children));
            } else if ('blockquote' === node.type && node.children[0]?.type === 'paragraph' && node.children[0].children?.[0] && 'value' in node.children[0].children[0]) {
                const initiatorTag = node.children[0].children[0].value;
                const match = initiatorTag.match(REGEX_GH_BEGIN);
                if (match) {
                    const [, type] = match;
                    if (!DIRECTIVE_TYPES.includes(type.toLowerCase())) {
                        i++;
                        continue;
                    }
                    if (1 === node.children.length && 'paragraph' === node.children[0].type) node.children[0].children[0].value = match[2] ?? '';
                    const newChild = createContainer(type.toLowerCase(), type.toUpperCase(), 0 === node.children.slice(1).length ? node.children.slice(0) : node.children.slice(1));
                    tree.children.splice(i, 1, newChild);
                }
            }
            if ('paragraph' !== node.type || 'text' !== node.children[0].type) {
                i++;
                continue;
            }
            const firstTextNode = node.children[0];
            const text = firstTextNode.value;
            const metaText = text.split('\n')[0];
            const content = text.slice(metaText.length);
            const match = metaText.match(REGEX_BEGIN);
            if (!match) {
                i++;
                continue;
            }
            const [, type, rawTitle] = match;
            let title = parseTitle(rawTitle);
            const titleExpressionNode = node.children[1] && 'mdxTextExpression' === node.children[1].type ? node.children[1] : null;
            if (titleExpressionNode) {
                title = parseTitle(titleExpressionNode.value, true);
                node.children.splice(1, 1);
            }
            if (!DIRECTIVE_TYPES.includes(type)) {
                i++;
                continue;
            }
            const wrappedChildren = [];
            if (content?.endsWith(':::')) {
                wrappedChildren.push({
                    type: 'paragraph',
                    children: [
                        {
                            type: 'text',
                            value: content.replace(REGEX_END, '')
                        }
                    ]
                });
                const newChild = createContainer(type, title, wrappedChildren);
                tree.children.splice(i, 1, newChild);
            } else {
                const paragraphChild = {
                    type: 'paragraph',
                    children: []
                };
                wrappedChildren.push(paragraphChild);
                if (content.length) paragraphChild.children.push({
                    type: 'text',
                    value: content
                });
                paragraphChild.children.push(...node.children.slice(1, -1));
                if (0 === paragraphChild.children.length) wrappedChildren.pop();
                const lastChildInNode = node.children[node.children.length - 1];
                if ('text' === lastChildInNode.type && REGEX_END.test(lastChildInNode.value)) {
                    const lastChildInNodeText = lastChildInNode.value;
                    const matchedEndContent = lastChildInNodeText.slice(0, -3).trimEnd();
                    if (wrappedChildren.length) wrappedChildren[0].children.push({
                        type: 'text',
                        value: matchedEndContent
                    });
                    else if (matchedEndContent) wrappedChildren.push({
                        type: 'paragraph',
                        children: [
                            {
                                type: 'text',
                                value: matchedEndContent
                            }
                        ]
                    });
                    const newChild = createContainer(type, title, wrappedChildren);
                    tree.children.splice(i, 1, newChild);
                    i++;
                    continue;
                }
                if (lastChildInNode !== firstTextNode && wrappedChildren.length) wrappedChildren[0].children.push(lastChildInNode);
                let j = i + 1;
                while(j < tree.children.length){
                    const currentParagraph = tree.children[j];
                    if ('paragraph' !== currentParagraph.type) {
                        wrappedChildren.push(currentParagraph);
                        j++;
                        continue;
                    }
                    const lastChild = currentParagraph.children[currentParagraph.children.length - 1];
                    if (lastChild === firstTextNode || 'text' === lastChild.type && REGEX_END.test(lastChild.value)) {
                        const lastChildText = lastChild.value;
                        const matchedEndContent = lastChildText.slice(0, -3).trimEnd();
                        const filteredChildren = currentParagraph.children.filter((child)=>child !== firstTextNode && child !== lastChild);
                        if (matchedEndContent) wrappedChildren.push({
                            type: 'paragraph',
                            children: [
                                ...filteredChildren,
                                {
                                    type: 'text',
                                    value: matchedEndContent
                                }
                            ]
                        });
                        else wrappedChildren.push(...filteredChildren);
                        const newChild = createContainer(type, title, wrappedChildren);
                        tree.children.splice(i, j - i + 1, newChild);
                        break;
                    }
                    wrappedChildren.push({
                        ...currentParagraph,
                        children: currentParagraph.children.filter((child)=>child !== firstTextNode)
                    });
                    j++;
                }
            }
            i++;
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}
const remarkPluginContainer = ()=>transformer;
const src_dirname = normalizePosixPath(node_path.dirname(fileURLToPath(import.meta.url)));
function pluginContainerSyntax() {
    return {
        name: '@rspress/plugin-container-syntax',
        markdown: {
            remarkPlugins: [
                remarkPluginContainer
            ]
        },
        globalStyles: node_path.posix.join(src_dirname, '../container.css')
    };
}
export { pluginContainerSyntax };
