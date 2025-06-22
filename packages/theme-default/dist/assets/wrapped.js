import { jsx } from "react/jsx-runtime";
import "react";
const SvgWrapped = (props)=>/*#__PURE__*/ jsx("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 32,
        height: 32,
        viewBox: "0 0 24 24",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            fill: "#22a041",
            d: "M21 5H3v2h18zM3 19h7v-2H3zm0-6h15c1 0 2 .43 2 2s-1 2-2 2h-2v-2l-4 3 4 3v-2h2c2.95 0 4-1.27 4-4 0-2.72-1-4-4-4H3z"
        })
    });
var wrapped = SvgWrapped;
export { wrapped as default };
