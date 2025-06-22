import { jsx, jsxs } from "react/jsx-runtime";
import copy from "@theme-assets/copy";
import success from "@theme-assets/success";
import copy_to_clipboard from "copy-to-clipboard";
import { useRef } from "react";
import { SvgWrapper } from "../../../../components/SvgWrapper/index.js";
import { codeCopied, codeCopyButton, iconCopy, iconSuccess } from "./index.module.js";
const timeoutIdMap = new Map();
function copyCode(codeBlockElement, copyButtonElement) {
    let text = '';
    if (!codeBlockElement) return;
    const walk = document.createTreeWalker(codeBlockElement, NodeFilter.SHOW_TEXT, null);
    let node = walk.nextNode();
    while(node){
        if (!node.parentElement.classList.contains('linenumber')) text += node.nodeValue;
        node = walk.nextNode();
    }
    const isCopied = copy_to_clipboard(text);
    if (isCopied && copyButtonElement) {
        copyButtonElement.classList.add(codeCopied);
        clearTimeout(timeoutIdMap.get(copyButtonElement));
        const timeoutId = setTimeout(()=>{
            copyButtonElement.classList.remove(codeCopied);
            copyButtonElement.blur();
            timeoutIdMap.delete(copyButtonElement);
        }, 2000);
        timeoutIdMap.set(copyButtonElement, timeoutId);
    }
}
function CopyCodeButton({ codeBlockRef }) {
    const copyButtonRef = useRef(null);
    return /*#__PURE__*/ jsxs("button", {
        className: codeCopyButton,
        onClick: ()=>copyCode(codeBlockRef.current, copyButtonRef.current),
        ref: copyButtonRef,
        title: "Copy code",
        children: [
            /*#__PURE__*/ jsx(SvgWrapper, {
                icon: copy,
                className: iconCopy
            }),
            /*#__PURE__*/ jsx(SvgWrapper, {
                icon: success,
                className: iconSuccess
            })
        ]
    });
}
export { CopyCodeButton };
