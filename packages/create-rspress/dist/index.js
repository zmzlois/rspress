import node_path from "node:path";
import { fileURLToPath } from "node:url";
import { create } from "create-rstack";
const src_dirname = node_path.dirname(fileURLToPath(import.meta.url));
async function getTemplateName() {
    return 'basic';
}
function mapESLintTemplate() {
    return 'vanilla-ts';
}
create({
    root: node_path.resolve(src_dirname, '..'),
    name: 'rspress',
    templates: [
        'basic'
    ],
    getTemplateName,
    mapESLintTemplate
});
