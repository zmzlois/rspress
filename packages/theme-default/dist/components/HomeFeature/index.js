import { jsx, jsxs } from "react/jsx-runtime";
import { normalizeHrefInRuntime } from "@rspress/runtime";
import { isExternalUrl, withBase } from "@rspress/shared";
import { renderHtmlOrText } from "../../logic/utils.js";
import { featureCard, grid2, grid3, grid4, grid6 } from "./index.module.js";
const getGridClass = (feature)=>{
    const { span } = feature;
    switch(span){
        case 2:
            return grid2;
        case 3:
            return grid3;
        case 4:
            return grid4;
        case 6:
            return grid6;
        case void 0:
            return grid4;
        default:
            return '';
    }
};
function HomeFeature({ frontmatter, routePath }) {
    const features = frontmatter?.features;
    return /*#__PURE__*/ jsx("div", {
        className: "rp-overflow-hidden rp-m-auto rp-flex rp-flex-wrap rp-max-w-6xl",
        children: features?.map((feature)=>{
            const { icon, title, details, link: rawLink } = feature;
            let link = rawLink;
            if (rawLink) link = isExternalUrl(rawLink) ? rawLink : normalizeHrefInRuntime(withBase(rawLink, routePath));
            return /*#__PURE__*/ jsx("div", {
                className: `${getGridClass(feature)} rp-rounded hover:rp-var(--rp-c-brand)`,
                children: /*#__PURE__*/ jsx("div", {
                    className: "rp-h-full rp-p-2",
                    children: /*#__PURE__*/ jsxs("article", {
                        className: `rspress-home-feature-card ${featureCard} rp-h-full rp-p-8 rp-rounded-4xl rp-border-transparent`,
                        style: {
                            cursor: link ? 'pointer' : 'auto'
                        },
                        onClick: ()=>{
                            if (link) window.location.href = link;
                        },
                        children: [
                            icon ? /*#__PURE__*/ jsx("div", {
                                className: "rp-flex rp-items-center rp-justify-center",
                                children: /*#__PURE__*/ jsx("div", {
                                    className: "rspress-home-feature-icon rp-w-12 rp-h-12 rp-text-3xl rp-text-center",
                                    ...renderHtmlOrText(icon)
                                })
                            }) : null,
                            /*#__PURE__*/ jsx("h2", {
                                className: "rspress-home-feature-title rp-font-bold rp-text-center",
                                children: title
                            }),
                            /*#__PURE__*/ jsx("p", {
                                className: "rspress-home-feature-detail rp-leading-6 rp-pt-2 rp-text-sm rp-text-text-2 rp-font-medium",
                                ...renderHtmlOrText(details)
                            })
                        ]
                    }, title)
                })
            }, title);
        })
    });
}
export { HomeFeature };
