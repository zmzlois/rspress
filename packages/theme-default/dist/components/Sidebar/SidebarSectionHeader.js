import { jsx, jsxs } from "react/jsx-runtime";
import { Tag } from "@theme";
import { renderInlineMarkdown } from "../../logic/utils.js";
function SidebarSectionHeader({ sectionHeaderText, tag }) {
    return /*#__PURE__*/ jsxs("div", {
        className: "rspress-sidebar-section-header",
        children: [
            /*#__PURE__*/ jsx(Tag, {
                tag: tag
            }),
            /*#__PURE__*/ jsx("span", {
                ...renderInlineMarkdown(sectionHeaderText)
            })
        ]
    });
}
export { SidebarSectionHeader };
