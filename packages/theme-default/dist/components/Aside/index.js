import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useLocation } from "@rspress/runtime";
import { useEffect, useMemo } from "react";
import { scrollToTarget, useBindingAsideScroll } from "../../logic/sideEffects.js";
import { useUISwitch } from "../../logic/useUISwitch.js";
import { parseInlineMarkdownText, renderInlineMarkdown } from "../../logic/utils.js";
import "./index.css";
import { useDynamicToc } from "./useDynamicToc.js";
const TocItem = ({ header, baseHeaderLevel })=>/*#__PURE__*/ jsx("li", {
        children: /*#__PURE__*/ jsx("a", {
            href: `#${header.id}`,
            title: parseInlineMarkdownText(header.text),
            className: "aside-link rp-transition-all rp-duration-300 hover:rp-text-text-1 rp-text-text-2 rp-block",
            style: {
                marginLeft: (header.depth - baseHeaderLevel) * 12,
                fontWeight: 'semibold'
            },
            onClick: (e)=>{
                e.preventDefault();
                window.location.hash = header.id;
            },
            children: /*#__PURE__*/ jsx("span", {
                className: "aside-link-text rp-block",
                ...renderInlineMarkdown(header.text)
            })
        })
    });
function Aside({ outlineTitle }) {
    const { scrollPaddingTop } = useUISwitch();
    const headers = useDynamicToc();
    const baseHeaderLevel = 2;
    const { hash: locationHash = '', pathname } = useLocation();
    const decodedHash = useMemo(()=>decodeURIComponent(locationHash), [
        locationHash
    ]);
    useBindingAsideScroll(headers);
    useEffect(()=>{
        if (0 === decodedHash.length) window.scrollTo(0, 0);
        else {
            const target = document.getElementById(decodedHash.slice(1));
            if (target) scrollToTarget(target, false, scrollPaddingTop);
        }
    }, [
        decodedHash,
        headers,
        pathname
    ]);
    if (0 === headers.length) return /*#__PURE__*/ jsx(Fragment, {});
    return /*#__PURE__*/ jsx("div", {
        className: "rp-flex rp-flex-col",
        children: /*#__PURE__*/ jsxs("div", {
            id: "aside-container",
            className: "rp-relative rp-text-sm rp-font-medium",
            children: [
                /*#__PURE__*/ jsx("div", {
                    className: "rp-leading-7 rp-block rp-text-sm rp-font-semibold rp-pl-3",
                    children: outlineTitle
                }),
                /*#__PURE__*/ jsx("nav", {
                    className: "rp-mt-1",
                    children: /*#__PURE__*/ jsx("ul", {
                        className: "rp-relative",
                        children: headers.map((header, index)=>/*#__PURE__*/ jsx(TocItem, {
                                baseHeaderLevel: baseHeaderLevel,
                                header: header
                            }, `${header.depth}_${header.text}_${header.id}_${index}`))
                    })
                })
            ]
        })
    });
}
export { Aside };
