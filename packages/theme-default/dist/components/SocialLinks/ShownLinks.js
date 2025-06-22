import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import arrow_down from "@theme-assets/arrow-down";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { LinkContent } from "./LinkContent.js";
const ShownLinks = (props)=>{
    const { links, moreIconVisible = false, mouseEnter } = props;
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx("div", {
                className: "rp-flex rp-items-center rp-justify-center rp-h-full rp-gap-x-4 rp-transition-colors rp-duration-300 md:rp-mr-2",
                children: links.map((item, index)=>/*#__PURE__*/ jsx(LinkContent, {
                        link: item,
                        popperStyle: {
                            top: '2.5rem'
                        }
                    }, index))
            }),
            moreIconVisible ? /*#__PURE__*/ jsx("div", {
                className: "md:rp-ml-1 rp-p-2",
                onMouseEnter: mouseEnter,
                children: /*#__PURE__*/ jsx(SvgWrapper, {
                    icon: arrow_down
                })
            }) : null
        ]
    });
};
export { ShownLinks };
