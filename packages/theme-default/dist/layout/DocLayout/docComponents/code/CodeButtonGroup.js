import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { usePageData } from "@rspress/runtime";
import wrap from "@theme-assets/wrap";
import wrapped from "@theme-assets/wrapped";
import { useState } from "react";
import { SvgWrapper } from "../../../../components/SvgWrapper/index.js";
import { CopyCodeButton } from "./CopyCodeButton.js";
import { codeButtonGroup, iconWrap, iconWrapped, wrappedBtn } from "./index.module.js";
const useCodeButtonGroup = ()=>{
    const { siteData } = usePageData();
    const { defaultWrapCode } = siteData.markdown;
    const [codeWrap, setCodeWrap] = useState(defaultWrapCode);
    const toggleCodeWrap = ()=>{
        setCodeWrap(!codeWrap);
    };
    return {
        codeWrap,
        toggleCodeWrap
    };
};
function CodeButtonGroup({ codeWrap, toggleCodeWrap, preElementRef, showCodeWrapButton = true, showCopyButton = true }) {
    return /*#__PURE__*/ jsx(Fragment, {
        children: /*#__PURE__*/ jsxs("div", {
            className: codeButtonGroup,
            children: [
                showCodeWrapButton && /*#__PURE__*/ jsxs("button", {
                    className: codeWrap ? wrappedBtn : '',
                    onClick: ()=>toggleCodeWrap(),
                    title: "Toggle code wrap",
                    children: [
                        /*#__PURE__*/ jsx(SvgWrapper, {
                            icon: wrapped,
                            className: iconWrapped
                        }),
                        /*#__PURE__*/ jsx(SvgWrapper, {
                            icon: wrap,
                            className: iconWrap
                        })
                    ]
                }),
                showCopyButton && /*#__PURE__*/ jsx(CopyCodeButton, {
                    codeBlockRef: preElementRef
                })
            ]
        })
    });
}
export { CodeButtonGroup, useCodeButtonGroup };
