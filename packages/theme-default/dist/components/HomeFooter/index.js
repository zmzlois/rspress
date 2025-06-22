import { jsx } from "react/jsx-runtime";
import { usePageData } from "@rspress/runtime";
function HomeFooter() {
    const { siteData } = usePageData();
    const { message } = siteData.themeConfig.footer || {};
    if (!message) return null;
    return /*#__PURE__*/ jsx("footer", {
        className: "rp-absolute rp-bottom-0 rp-mt-12 rp-py-8 rp-px-6 sm:rp-p-8 rp-w-full rp-border-t rp-border-solid rp-border-divider-light",
        children: /*#__PURE__*/ jsx("div", {
            className: "rp-m-auto rp-w-full rp-text-center",
            children: /*#__PURE__*/ jsx("div", {
                className: "rp-font-medium rp-text-sm rp-text-text-2",
                dangerouslySetInnerHTML: {
                    __html: message
                }
            })
        })
    });
}
export { HomeFooter };
