import { jsx } from "react/jsx-runtime";
import { LinkContent } from "./LinkContent.js";
const HiddenLinks = (props)=>{
    const { links } = props;
    return /*#__PURE__*/ jsx("div", {
        style: {
            boxShadow: 'var(--rp-shadow-3)',
            marginRight: '-2px',
            border: '1px solid var(--rp-c-divider-light)',
            background: 'var(--rp-c-bg)'
        },
        className: "rp-absolute rp-top-8 rp-right-0 rp-z-1 rp-p-3 rp-w-32 rp-rounded-2xl rp-flex rp-flex-wrap rp-gap-4",
        children: links.map((item)=>/*#__PURE__*/ jsx(LinkContent, {
                link: item,
                popperStyle: {
                    top: '1.25rem'
                }
            }, item.content))
    });
};
export { HiddenLinks };
