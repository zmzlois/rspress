import { jsx } from "react/jsx-runtime";
import "react";
const SvgRight = (props)=>/*#__PURE__*/ jsx("svg", {
        width: 32,
        height: 32,
        viewBox: "0 0 32 32",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            fill: "currentColor",
            d: "M10 6v2h12.59L6 24.59 7.41 26 24 9.41V22h2V6z"
        })
    });
var right = SvgRight;
export { right as default };
