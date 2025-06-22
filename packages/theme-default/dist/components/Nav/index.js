import { jsx, jsxs } from "react/jsx-runtime";
import { useLocation, usePageData, useWindowSize } from "@rspress/runtime";
import { Search } from "@theme";
import { useHiddenNav } from "../../logic/useHiddenNav.js";
import { useNavData } from "../../logic/useNav.js";
import { NavHamburger } from "../NavHamburger/index.js";
import { SocialLinks } from "../SocialLinks/index.js";
import { SwitchAppearance } from "../SwitchAppearance/index.js";
import { NavBarTitle } from "./NavBarTitle.js";
import { NavMenuGroup } from "./NavMenuGroup.js";
import { NavMenuSingleItem } from "./NavMenuSingleItem.js";
import { NavTranslations } from "./NavTranslations.js";
import { NavVersions } from "./NavVersions.js";
import { container, hidden as external_index_module_js_hidden, leftNav as external_index_module_js_leftNav, mobileNavMenu, navContainer, relative, rightNav as external_index_module_js_rightNav, sticky } from "./index.module.js";
const DEFAULT_NAV_POSITION = 'right';
function Nav(props) {
    const { beforeNavTitle, afterNavTitle, beforeNav, afterNavMenu, navTitle } = props;
    const { siteData, page } = usePageData();
    const { base } = siteData;
    const { pathname } = useLocation();
    const { width } = useWindowSize();
    const hiddenNav = useHiddenNav();
    const isMobile = width < 1280;
    const localeLanguages = Object.values(siteData.locales || siteData.themeConfig.locales || {});
    const hasMultiLanguage = localeLanguages.length > 1;
    const hasMultiVersion = siteData.multiVersion.versions.length > 1;
    const socialLinks = siteData.themeConfig.socialLinks || [];
    const hasSocialLinks = socialLinks.length > 0;
    const langs = localeLanguages.map((item)=>item.lang || '') || [];
    const NavMenu = ({ menuItems })=>/*#__PURE__*/ jsx("div", {
            className: "rspress-nav-menu rp-flex rp-justify-around rp-items-center rp-text-sm rp-font-bold rp-h-14",
            children: menuItems.map((item)=>'items' in item || Array.isArray(item) ? /*#__PURE__*/ jsx("div", {
                    className: "rp-mx-3 last:rp-mr-0",
                    children: /*#__PURE__*/ jsx(NavMenuGroup, {
                        ...item,
                        base: base,
                        pathname: pathname,
                        langs: langs,
                        items: 'items' in item ? item.items : item
                    })
                }, item.text) : /*#__PURE__*/ jsx(NavMenuSingleItem, {
                    pathname: pathname,
                    langs: langs,
                    base: base,
                    ...item
                }, item.link))
        });
    const menuItems = useNavData();
    const getPosition = (menuItem)=>menuItem.position ?? DEFAULT_NAV_POSITION;
    const leftMenuItems = menuItems.filter((item)=>'left' === getPosition(item));
    const rightMenuItems = menuItems.filter((item)=>'right' === getPosition(item));
    const hasSearch = siteData?.themeConfig?.search !== false;
    const hasAppearanceSwitch = false !== siteData.themeConfig.darkMode;
    const leftNav = ()=>leftMenuItems.length > 0 ? /*#__PURE__*/ jsx("div", {
            className: external_index_module_js_leftNav,
            children: /*#__PURE__*/ jsx(NavMenu, {
                menuItems: leftMenuItems
            })
        }) : null;
    const rightNav = ()=>/*#__PURE__*/ jsxs("div", {
            className: external_index_module_js_rightNav,
            children: [
                hasSearch && /*#__PURE__*/ jsx("div", {
                    className: "rp-flex sm:rp-flex-1 rp-items-center sm:rp-pl-4 sm:rp-pr-2",
                    children: /*#__PURE__*/ jsx(Search, {})
                }),
                /*#__PURE__*/ jsx(NavMenu, {
                    menuItems: rightMenuItems
                }),
                /*#__PURE__*/ jsxs("div", {
                    className: "rp-flex rp-items-center rp-justify-center rp-flex-row",
                    children: [
                        hasMultiLanguage && /*#__PURE__*/ jsx(NavTranslations, {}),
                        hasMultiVersion && /*#__PURE__*/ jsx(NavVersions, {}),
                        hasAppearanceSwitch && /*#__PURE__*/ jsx("div", {
                            className: "rp-mx-2",
                            children: /*#__PURE__*/ jsx(SwitchAppearance, {})
                        }),
                        hasSocialLinks && /*#__PURE__*/ jsx(SocialLinks, {
                            socialLinks: socialLinks
                        })
                    ]
                })
            ]
        });
    const computeNavPosition = ()=>{
        if (!isMobile || !hiddenNav || 'doc' !== page.pageType) return sticky;
        return relative;
    };
    return /*#__PURE__*/ jsxs("div", {
        className: " border-red-500 border-b-2",
        children: [
            beforeNav,
            /*#__PURE__*/ jsx("div", {
                className: `${navContainer} rspress-nav rp-px-6 ${hiddenNav ? external_index_module_js_hidden : ''} ${computeNavPosition()}`,
                children: /*#__PURE__*/ jsxs("div", {
                    className: `${container} rp-flex rp-justify-between rp-items-center rp-h-full`,
                    children: [
                        beforeNavTitle,
                        navTitle || /*#__PURE__*/ jsx(NavBarTitle, {}),
                        "after nav title",
                        afterNavTitle,
                        "end of container",
                        /*#__PURE__*/ jsxs("div", {
                            className: "rp-flex rp-flex-1 rp-justify-end rp-items-center",
                            children: [
                                leftNav(),
                                rightNav(),
                                afterNavMenu,
                                /*#__PURE__*/ jsxs("div", {
                                    className: mobileNavMenu,
                                    children: [
                                        hasSearch && /*#__PURE__*/ jsx(Search, {}),
                                        /*#__PURE__*/ jsx(NavHamburger, {
                                            siteData: siteData,
                                            pathname: pathname
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            })
        ]
    });
}
export { Nav };
