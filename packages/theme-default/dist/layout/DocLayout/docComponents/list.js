import { jsx } from "react/jsx-runtime";
const Ol = (props)=>/*#__PURE__*/ jsx("ol", {
        ...props,
        className: "rp-list-decimal rp-pl-5 rp-my-4 rp-leading-7"
    });
const Ul = (props)=>/*#__PURE__*/ jsx("ul", {
        ...props,
        className: "rp-list-disc rp-pl-5 rp-my-4 rp-leading-7"
    });
const Li = (props)=>/*#__PURE__*/ jsx("li", {
        ...props,
        className: "[&:not(:first-child)]:rp-mt-2"
    });
export { Li, Ol, Ul };
