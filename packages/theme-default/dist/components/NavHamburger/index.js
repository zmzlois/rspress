import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import small_menu from "@theme-assets/small-menu";
import { useNavScreen } from "../../logic/useNav.js";
import { NavScreen } from "../NavScreen/index.js";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { active, navHamburger } from "./index.module.js";
function NavHamburger(props) {
    const { siteData, pathname } = props;
    const { isScreenOpen, toggleScreen } = useNavScreen();
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx(NavScreen, {
                isScreenOpen: isScreenOpen,
                toggleScreen: toggleScreen,
                siteData: siteData,
                pathname: pathname
            }),
            /*#__PURE__*/ jsx("button", {
                onClick: toggleScreen,
                "aria-label": "mobile hamburger",
                className: `${isScreenOpen ? active : ''} rspress-mobile-hamburger ${navHamburger} rp-text-gray-500`,
                children: /*#__PURE__*/ jsx(SvgWrapper, {
                    icon: small_menu,
                    fill: "currentColor"
                })
            })
        ]
    });
}
export { NavHamburger };
