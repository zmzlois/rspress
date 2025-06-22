import { jsx, jsxs } from "react/jsx-runtime";
import { normalizeHrefInRuntime } from "@rspress/runtime";
import { withoutBase } from "@rspress/shared";
import { Link, Tag } from "@theme";
import { activeItem, singleItem } from "./index.module.js";
function NavMenuSingleItem(item) {
    const { pathname, base } = item;
    const isActive = new RegExp(item.activeMatch || item.link).test(withoutBase(pathname, base));
    return /*#__PURE__*/ jsx(Link, {
        href: normalizeHrefInRuntime(item.link),
        onClick: item.onClick,
        children: /*#__PURE__*/ jsxs("div", {
            className: `rspress-nav-menu-item ${singleItem} ${isActive ? `${activeItem} rspress-nav-menu-item-active` : ''} rp-text-sm rp-font-medium rp-mx-0.5 rp-px-3 rp-py-2 rp-flex rp-items-center`,
            children: [
                /*#__PURE__*/ jsx(Tag, {
                    tag: item.tag
                }),
                item.text,
                item.rightIcon
            ]
        }, item.text)
    });
}
export { NavMenuSingleItem };
