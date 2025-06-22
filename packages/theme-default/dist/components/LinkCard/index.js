import { jsx, jsxs } from "react/jsx-runtime";
import arrow_right from "@theme-assets/arrow-right";
import { link as external_index_module_js_link, linkCard } from "./index.module.js";
function LinkCard(props) {
    const { href, title, description, style } = props;
    return /*#__PURE__*/ jsxs("div", {
        className: `rp-relative rp-border rp-border-gray-400 rp-rounded-lg rp-p-6 rp-flex rp-justify-between rp-items-start hover:rp-border-gray-500 rp-transition-all rp-duration-300 ${linkCard}`,
        style: style,
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "rp-flex rp-flex-col",
                children: [
                    /*#__PURE__*/ jsx("a", {
                        href: href,
                        className: `rp-flex rp-items-center rp-gap-2 rp-mb-4 ${external_index_module_js_link}`,
                        children: title && /*#__PURE__*/ jsx("span", {
                            className: "rp-text-2xl rp-font-bold",
                            children: title
                        })
                    }),
                    /*#__PURE__*/ jsx("span", {
                        className: "rp-text-base rp-overflow-auto",
                        children: description
                    })
                ]
            }),
            /*#__PURE__*/ jsx(arrow_right, {})
        ]
    });
}
export { LinkCard };
