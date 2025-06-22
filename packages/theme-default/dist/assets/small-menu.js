import { jsx, jsxs } from "react/jsx-runtime";
import "react";
const SvgSmallMenu = (props)=>/*#__PURE__*/ jsxs("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: 32,
        height: 32,
        viewBox: "0 0 32 32",
        ...props,
        children: [
            /*#__PURE__*/ jsx("circle", {
                cx: 8,
                cy: 16,
                r: 2,
                fill: "currentColor"
            }),
            /*#__PURE__*/ jsx("circle", {
                cx: 16,
                cy: 16,
                r: 2,
                fill: "currentColor"
            }),
            /*#__PURE__*/ jsx("circle", {
                cx: 24,
                cy: 16,
                r: 2,
                fill: "currentColor"
            })
        ]
    });
var small_menu = SvgSmallMenu;
export { small_menu as default };
