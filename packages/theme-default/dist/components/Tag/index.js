import { jsx } from "react/jsx-runtime";
const Tag = ({ tag })=>{
    if (!tag) return null;
    const isSvgTagString = tag.trim().startsWith('<svg');
    if (isSvgTagString) return /*#__PURE__*/ jsx("div", {
        dangerouslySetInnerHTML: {
            __html: tag
        },
        style: {
            width: 20,
            marginRight: 4
        }
    });
    return /*#__PURE__*/ jsx("img", {
        src: tag
    });
};
export { Tag };
