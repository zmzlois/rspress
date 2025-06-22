import { jsx } from "react/jsx-runtime";
import { blockquote } from "./index.module.js";
const P = (props)=>/*#__PURE__*/ jsx("p", {
        ...props,
        className: "rp-my-4 rp-leading-7"
    });
const Blockquote = (props)=>/*#__PURE__*/ jsx("blockquote", {
        ...props,
        className: `rp-border-l-2 rp-border-solid rp-border-divider rp-pl-4 rp-my-6 rp-transition-colors rp-duration-500 ${blockquote}`
    });
const Strong = (props)=>/*#__PURE__*/ jsx("strong", {
        ...props,
        className: "rp-font-semibold"
    });
export { Blockquote, P, Strong };
