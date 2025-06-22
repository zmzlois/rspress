import node_path from "node:path";
import { fileURLToPath } from "node:url";
function slash(str) {
    return str.replace(/\\/g, '/');
}
function normalizePosixPath(id) {
    const path = slash(id);
    const isAbsolutePath = path.startsWith('/');
    const parts = path.split('/');
    const normalizedParts = [];
    for (const part of parts)if ('.' === part || '' === part) ;
    else if ('..' === part) {
        if (normalizedParts.length > 0 && '..' !== normalizedParts[normalizedParts.length - 1]) normalizedParts.pop();
        else if (isAbsolutePath) normalizedParts.push('..');
    } else normalizedParts.push(part);
    let normalizedPath = normalizedParts.join('/');
    if (isAbsolutePath) normalizedPath = `/${normalizedPath}`;
    return normalizedPath;
}
function pluginMediumZoom(options = {}) {
    const __dirname = normalizePosixPath(node_path.dirname(fileURLToPath(import.meta.url)));
    return {
        name: '@rspress/plugin-medium-zoom',
        globalUIComponents: [
            [
                node_path.join(__dirname, '../static/MediumZoom.tsx'),
                options
            ]
        ]
    };
}
export { pluginMediumZoom };
