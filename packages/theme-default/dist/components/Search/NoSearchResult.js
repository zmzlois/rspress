import { jsx, jsxs } from "react/jsx-runtime";
import empty from "@theme-assets/empty";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { SvgWrapper } from "../SvgWrapper/index.js";
function NoSearchResult({ query }) {
    const { searchNoResultsText = 'No results for', searchSuggestedQueryText = 'Please try again with a different keyword' } = useLocaleSiteData();
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-flex rp-flex-col rp-items-center rp-pt-8 rp-pb-2",
        children: [
            /*#__PURE__*/ jsx(SvgWrapper, {
                icon: empty,
                className: "rp-mb-4 rp-opacity-80"
            }),
            /*#__PURE__*/ jsxs("p", {
                className: "rp-mb-2",
                children: [
                    searchNoResultsText,
                    " ",
                    /*#__PURE__*/ jsxs("b", {
                        children: [
                            '"',
                            query,
                            '"'
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx("p", {
                children: searchSuggestedQueryText
            })
        ]
    });
}
export { NoSearchResult };
