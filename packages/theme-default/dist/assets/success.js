import { jsx } from "react/jsx-runtime";
import "react";
const SvgSuccess = (props)=>/*#__PURE__*/ jsx("svg", {
        width: 32,
        height: 32,
        viewBox: "0 0 30 30",
        ...props,
        children: /*#__PURE__*/ jsx("path", {
            fill: "#49cd37",
            d: "m13 24-9-9 1.414-1.414L13 21.171 26.586 7.586 28 9z"
        })
    });
var success = SvgSuccess;
export { success as default };
