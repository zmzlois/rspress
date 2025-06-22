import { jsx } from "react/jsx-runtime";
import { rspressSteps } from "./index.module.js";
function Steps({ children }) {
    return /*#__PURE__*/ jsx("div", {
        className: `rp-ml-4 rp-mb-11 rp-border-l rp-pl-6 ${rspressSteps} [counter-reset:step]`,
        children: children
    });
}
export { Steps };
