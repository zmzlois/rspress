import { jsx } from "react/jsx-runtime";
import * as __WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__ from "./index.module.js";
function Badge({ children, type = 'tip', text, outline = false }) {
    const content = children || text;
    return /*#__PURE__*/ jsx("span", {
        className: `rp-inline-flex rp-items-center rp-justify-center rp-rounded-full rp-border rp-border-solid ${outline ? 'rp-border-current' : 'rp-border-transparent'} rp-font-semibold rp-align-middle rp-px-2.5 rp-h-6 rp-gap-1 rp-text-xs ${__WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__.badge} ${__WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__[type]} ${outline ? __WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__.outline : ''}`,
        children: content
    });
}
export { Badge };
