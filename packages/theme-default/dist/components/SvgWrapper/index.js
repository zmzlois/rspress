import { jsx } from "react/jsx-runtime";
function SvgWrapper({ icon: Icon, ...rest }) {
    if (!Icon) return null;
    if ('string' == typeof Icon) return /*#__PURE__*/ jsx("img", {
        src: Icon,
        alt: "",
        ...rest
    });
    return /*#__PURE__*/ jsx(Icon, {
        ...rest
    });
}
export { SvgWrapper };
