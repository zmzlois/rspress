import { jsx } from "react/jsx-runtime";
import { useEditLink } from "../../logic/useEditLink.js";
import { editLink } from "./index.module.js";
function EditLink() {
    const editLinkObj = useEditLink();
    if (!editLinkObj) return null;
    const { text, link } = editLinkObj;
    return /*#__PURE__*/ jsx("a", {
        href: link,
        target: "_blank",
        className: editLink,
        children: text
    });
}
export { EditLink };
