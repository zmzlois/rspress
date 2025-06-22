import { jsx, jsxs } from "react/jsx-runtime";
import github from "@theme-assets/github";
import gitlab from "@theme-assets/gitlab";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { sourceCode } from "./index.module.js";
function SourceCode(props) {
    const { href, platform = 'github' } = props;
    const { sourceCodeText = 'Source' } = useLocaleSiteData();
    return /*#__PURE__*/ jsx("div", {
        className: `rp-inline-block rp-rounded rp-border rp-border-solid rp-border-gray-light-3 dark:rp-border-divider rp-text-gray-400 ${sourceCode}`,
        children: /*#__PURE__*/ jsxs("a", {
            href: href,
            target: "_blank",
            className: "rp-flex rp-items-center rp-content-center rp-transition-all rp-duration-300 rp-text-xs rp-px-2 rp-py-1",
            children: [
                /*#__PURE__*/ jsx("span", {
                    className: "rp-mr-2 rp-inline-flex rp-w-4 rp-h-4",
                    children: /*#__PURE__*/ jsx(SvgWrapper, {
                        icon: 'gitlab' === platform ? gitlab : github
                    })
                }),
                /*#__PURE__*/ jsx("span", {
                    children: sourceCodeText
                })
            ]
        })
    });
}
export { SourceCode };
