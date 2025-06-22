import { fileURLToPath as __webpack_fileURLToPath__ } from "node:url";
import { dirname as __webpack_dirname__ } from "node:path";
import node_path from "node:path";
var src_dirname = __webpack_dirname__(__webpack_fileURLToPath__(import.meta.url));
function pluginClientRedirects(options = {}) {
    return {
        name: '@rspress/plugin-client-redirects',
        globalUIComponents: [
            [
                node_path.join(src_dirname, '../static/Redirect.tsx'),
                options
            ]
        ]
    };
}
export { pluginClientRedirects };
