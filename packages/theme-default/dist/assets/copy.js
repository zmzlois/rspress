import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SvgCopy = (props)=>/*#__PURE__*/ jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 32,
        height: 32,
        viewBox: "0 0 30 30",
        ...props,
        children: [
            /*#__PURE__*/ jsx("path", {
                fill: "currentColor",
                d: "M28 10v18H10V10zm0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2"
            }),
            /*#__PURE__*/ jsx("path", {
                fill: "currentColor",
                d: "M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"
            })
        ]
    });
var copy = SvgCopy;
export { copy as default };
