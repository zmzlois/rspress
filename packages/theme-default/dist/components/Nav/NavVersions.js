import { jsx } from "react/jsx-runtime";
import { NavMenuGroup } from "./NavMenuGroup.js";
import { menuItem } from "./index.module.js";
import { useVersionMenuData } from "./menuDataHooks.js";
function NavVersions() {
    const versionsMenuData = useVersionMenuData();
    return /*#__PURE__*/ jsx("div", {
        className: `translation ${menuItem} rp-flex rp-text-sm rp-font-bold rp-items-center rp-px-3 rp-py-2`,
        children: /*#__PURE__*/ jsx("div", {
            children: /*#__PURE__*/ jsx(NavMenuGroup, {
                ...versionsMenuData
            })
        })
    });
}
export { NavVersions };
