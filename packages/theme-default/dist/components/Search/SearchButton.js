import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import search from "@theme-assets/search";
import { useEffect, useState } from "react";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { mobileNavSearchButton, navSearchButton, searchWord } from "./index.module.js";
function SearchButton({ setFocused }) {
    const [metaKey, setMetaKey] = useState(null);
    const { searchPlaceholderText = 'Search' } = useLocaleSiteData();
    useEffect(()=>{
        setMetaKey(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "\u2318" : 'Ctrl');
    }, []);
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx("div", {
                className: `rspress-nav-search-button ${navSearchButton}`,
                onClick: ()=>setFocused(true),
                children: /*#__PURE__*/ jsxs("button", {
                    children: [
                        /*#__PURE__*/ jsx(SvgWrapper, {
                            icon: search,
                            width: "18",
                            height: "18"
                        }),
                        /*#__PURE__*/ jsx("p", {
                            className: searchWord,
                            children: searchPlaceholderText
                        }),
                        /*#__PURE__*/ jsxs("div", {
                            style: {
                                opacity: metaKey ? 1 : 0
                            },
                            children: [
                                /*#__PURE__*/ jsx("span", {
                                    children: metaKey
                                }),
                                /*#__PURE__*/ jsx("span", {
                                    children: "K"
                                })
                            ]
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsx("div", {
                className: mobileNavSearchButton,
                onClick: ()=>setFocused(true),
                children: /*#__PURE__*/ jsx(SvgWrapper, {
                    icon: search
                })
            })
        ]
    });
}
export { SearchButton };
