import { Link } from "@theme";
import react from "react";
import * as __WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__ from "./index.module.js";
function Button(props) {
    const { theme = 'brand', size = 'big', href = '/', external = false, className = '', children, dangerouslySetInnerHTML } = props;
    let type = null;
    if ('button' === props.type) type = 'button';
    else if ('a' === props.type) type = external ? 'a' : Link;
    return /*#__PURE__*/ react.createElement(type ?? 'a', {
        className: `${__WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__.button} ${__WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__[theme]} ${__WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__[size]} ${className}`,
        href,
        ...dangerouslySetInnerHTML
    }, children);
}
export { Button };
