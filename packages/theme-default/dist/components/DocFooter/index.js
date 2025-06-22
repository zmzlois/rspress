import { jsx, jsxs } from "react/jsx-runtime";
import { normalizeHrefInRuntime, usePageData } from "@rspress/runtime";
import { EditLink, LastUpdated, PrevNextPage } from "@theme";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { usePrevNextPage } from "../../logic/usePrevNextPage.js";
import { next, prev } from "./index.module.js";
function DocFooter() {
    const { prevPage, nextPage } = usePrevNextPage();
    const { lastUpdated: localesLastUpdated = false } = useLocaleSiteData();
    const { siteData } = usePageData();
    const { themeConfig } = siteData;
    const showLastUpdated = themeConfig.lastUpdated || localesLastUpdated;
    return /*#__PURE__*/ jsxs("footer", {
        className: "rp-mt-8",
        children: [
            /*#__PURE__*/ jsx("div", {
                className: "xs:rp-flex rp-pb-5 rp-px-2 rp-justify-end rp-items-center",
                children: showLastUpdated && /*#__PURE__*/ jsx(LastUpdated, {})
            }),
            /*#__PURE__*/ jsx("div", {
                className: "rp-flex rp-flex-col",
                children: /*#__PURE__*/ jsx(EditLink, {})
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "rp-flex rp-flex-col sm:rp-flex-row sm:rp-justify-around rp-gap-4 rp-pt-6",
                children: [
                    /*#__PURE__*/ jsx("div", {
                        className: `${prev} rp-flex rp-flex-col`,
                        children: prevPage && Boolean(prevPage.text) ? /*#__PURE__*/ jsx(PrevNextPage, {
                            type: "prev",
                            text: prevPage.text,
                            href: normalizeHrefInRuntime(prevPage.link)
                        }) : null
                    }),
                    /*#__PURE__*/ jsx("div", {
                        className: `${next} rp-flex rp-flex-col`,
                        children: nextPage && Boolean(nextPage.text) ? /*#__PURE__*/ jsx(PrevNextPage, {
                            type: "next",
                            text: nextPage.text,
                            href: normalizeHrefInRuntime(nextPage.link)
                        }) : null
                    })
                ]
            })
        ]
    });
}
export { DocFooter };
