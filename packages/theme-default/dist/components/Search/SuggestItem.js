import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { isProduction } from "@rspress/runtime";
import file from "@theme-assets/file";
import _theme_assets_header from "@theme-assets/header";
import jump from "@theme-assets/jump";
import title from "@theme-assets/title";
import { useRef } from "react";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { actionIcon, contentWrapper, current, mark, suggestItem, suggestItemContainer, titleForContent } from "./index.module.js";
import { getSlicedStrByByteLength, removeDomain } from "./logic/util.js";
const ICON_MAP = {
    title: title,
    header: _theme_assets_header,
    content: file
};
function SuggestItem({ suggestion, closeSearch, isCurrent, setCurrentSuggestionIndex, inCurrentDocIndex, scrollTo, onMouseMove }) {
    const HitIcon = ICON_MAP[suggestion.type];
    const link = inCurrentDocIndex && !isProduction() ? removeDomain(suggestion.link) : suggestion.link;
    const selfRef = useRef(null);
    if (isCurrent && selfRef.current?.offsetTop) scrollTo(selfRef.current?.offsetTop, selfRef.current?.offsetHeight);
    const getHighlightedFragments = (rawText, highlights)=>{
        const fragmentList = [];
        let lastIndex = 0;
        for (const highlightInfo of highlights){
            const { start, length } = highlightInfo;
            const prefix = rawText.slice(lastIndex, start);
            const queryStr = getSlicedStrByByteLength(rawText, start, length);
            fragmentList.push(prefix);
            fragmentList.push(/*#__PURE__*/ jsx("span", {
                className: mark,
                children: queryStr
            }, start));
            lastIndex = start + queryStr.length;
        }
        if (lastIndex < rawText.length) fragmentList.push(rawText.slice(lastIndex));
        return fragmentList;
    };
    const renderHeaderMatch = ()=>{
        if ('header' === suggestion.type || 'title' === suggestion.type) {
            const { header, highlightInfoList } = suggestion;
            return /*#__PURE__*/ jsx("div", {
                className: "rp-font-medium",
                children: getHighlightedFragments(header, highlightInfoList)
            });
        }
        return /*#__PURE__*/ jsx("div", {
            className: "rp-font-medium",
            children: suggestion.header
        });
    };
    const renderStatementMatch = ()=>{
        if ('content' !== suggestion.type) return /*#__PURE__*/ jsx("div", {});
        const { statement, highlightInfoList } = suggestion;
        return /*#__PURE__*/ jsx("div", {
            className: "rp-text-sm rp-text-gray-light rp-w-full",
            children: getHighlightedFragments(statement, highlightInfoList)
        });
    };
    let hitContent = null;
    switch(suggestion.type){
        case 'title':
        case 'header':
            hitContent = renderHeaderMatch();
            break;
        case 'content':
            hitContent = /*#__PURE__*/ jsxs(Fragment, {
                children: [
                    renderStatementMatch(),
                    /*#__PURE__*/ jsx("p", {
                        className: titleForContent,
                        children: suggestion.title
                    })
                ]
            });
            break;
        default:
            break;
    }
    return /*#__PURE__*/ jsx("li", {
        className: `rspress-search-suggest-item ${suggestItem} ${isCurrent ? current : ''}`,
        onMouseEnter: setCurrentSuggestionIndex,
        onMouseMove: onMouseMove,
        ref: selfRef,
        children: /*#__PURE__*/ jsx("a", {
            href: link,
            onClick: (e)=>{
                closeSearch();
                e.stopPropagation();
            },
            target: inCurrentDocIndex ? '_self' : '_blank',
            children: /*#__PURE__*/ jsxs("div", {
                className: suggestItemContainer,
                children: [
                    /*#__PURE__*/ jsx("div", {
                        children: /*#__PURE__*/ jsx(SvgWrapper, {
                            icon: HitIcon
                        })
                    }),
                    /*#__PURE__*/ jsx("div", {
                        className: contentWrapper,
                        children: /*#__PURE__*/ jsx("span", {
                            children: hitContent
                        })
                    }),
                    /*#__PURE__*/ jsx("div", {
                        className: actionIcon,
                        children: /*#__PURE__*/ jsx(SvgWrapper, {
                            icon: jump
                        })
                    })
                ]
            })
        })
    }, suggestion.link);
}
export { SuggestItem };
