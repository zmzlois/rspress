import { jsx } from "react/jsx-runtime";
import "./index.css";
import { renderInlineMarkdown } from "../../logic/utils.js";
import { useDynamicToc } from "../Aside/useDynamicToc.js";
import { Link } from "../Link/index.js";
const TocItem = ({ header, onItemClick })=>/*#__PURE__*/ jsx("li", {
        children: /*#__PURE__*/ jsx(Link, {
            href: `#${header.id}`,
            className: 'rspress-toc-link sm:rp-text-normal rp-text-sm',
            style: {
                marginLeft: (header.depth - 2) * 12
            },
            onClick: ()=>{
                onItemClick?.(header);
            },
            children: /*#__PURE__*/ jsx("span", {
                className: 'rspress-toc-link-text rp-block',
                ...renderInlineMarkdown(header.text)
            })
        })
    });
function Toc({ onItemClick }) {
    const headers = useDynamicToc();
    return headers.length > 0 && /*#__PURE__*/ jsx("ul", {
        children: headers.map((item)=>/*#__PURE__*/ jsx(TocItem, {
                header: item,
                onItemClick: onItemClick
            }, item.id))
    });
}
export { Toc };
