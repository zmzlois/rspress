import { jsx } from "react/jsx-runtime";
import "react";
const SvgSearch = (props)=>/*#__PURE__*/ jsx("svg", {
        width: 24,
        height: 24,
        viewBox: "0 0 32 32",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            fill: "var(--rp-c-gray)",
            d: "m29 27.586-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9 9.01 9.01 0 0 1-9-9"
        })
    });
var search = SvgSearch;
export { search as default };
