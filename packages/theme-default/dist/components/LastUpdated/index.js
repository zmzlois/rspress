import { jsx, jsxs } from "react/jsx-runtime";
import { usePageData } from "@rspress/runtime";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
function LastUpdated() {
    const { lastUpdatedText: localesLastUpdatedText = 'Last Updated' } = useLocaleSiteData();
    const { page: { lastUpdatedTime }, siteData } = usePageData();
    const { themeConfig } = siteData;
    const lastUpdatedText = themeConfig?.lastUpdatedText || localesLastUpdatedText;
    return /*#__PURE__*/ jsx("div", {
        className: "rp-flex rp-text-sm rp-text-text-2 rp-leading-6 sm:rp-leading-8 rp-font-medium",
        children: /*#__PURE__*/ jsxs("p", {
            children: [
                lastUpdatedText,
                ": ",
                /*#__PURE__*/ jsx("span", {
                    children: lastUpdatedTime
                })
            ]
        })
    });
}
export { LastUpdated };
