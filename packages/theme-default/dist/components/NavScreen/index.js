import { jsx, jsxs } from "react/jsx-runtime";
import { NoSSR } from "@rspress/runtime";
import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { useEffect, useRef } from "react";
import { useNavData } from "../../logic/useNav.js";
import { NavMenuSingleItem } from "../Nav/NavMenuSingleItem.js";
import { useTranslationMenuData, useVersionMenuData } from "../Nav/menuDataHooks.js";
import { SocialLinks } from "../SocialLinks/index.js";
import { SwitchAppearance } from "../SwitchAppearance/index.js";
import { NavScreenMenuGroup } from "./NavScreenMenuGroup.js";
import { active, container, navAppearance, navMenu, navMenuItem, navScreen } from "./index.module.js";
const NavScreenTranslations = ()=>{
    const translationMenuData = useTranslationMenuData();
    return /*#__PURE__*/ jsx("div", {
        className: "rp-flex rp-text-sm rp-font-bold rp-justify-center",
        children: /*#__PURE__*/ jsx("div", {
            className: "rp-mx-1.5 rp-my-1",
            children: /*#__PURE__*/ jsx(NavScreenMenuGroup, {
                ...translationMenuData
            })
        })
    });
};
const NavScreenVersions = ()=>{
    const versionMenuData = useVersionMenuData();
    return /*#__PURE__*/ jsx("div", {
        className: 'rp-flex rp-text-sm rp-font-bold rp-justify-center',
        children: /*#__PURE__*/ jsx("div", {
            className: "rp-mx-1.5 rp-my-1",
            children: /*#__PURE__*/ jsx(NavScreenMenuGroup, {
                ...versionMenuData
            })
        })
    });
};
const NavScreenAppearance = ()=>/*#__PURE__*/ jsx("div", {
        className: `rp-mt-2 ${navAppearance} rp-flex rp-justify-center`,
        children: /*#__PURE__*/ jsx(NoSSR, {
            children: /*#__PURE__*/ jsx(SwitchAppearance, {})
        })
    });
const NavScreenMenu = ({ menuItems, pathname, base, langs, toggleScreen })=>/*#__PURE__*/ jsx("div", {
        className: navMenu,
        children: menuItems.map((item)=>/*#__PURE__*/ jsx("div", {
                className: `${navMenuItem} rp-w-full`,
                children: 'link' in item ? /*#__PURE__*/ jsx(NavMenuSingleItem, {
                    pathname: pathname,
                    base: base,
                    langs: langs,
                    onClick: toggleScreen,
                    ...item
                }, item.text) : /*#__PURE__*/ jsx("div", {
                    className: "rp-mx-3 last:rp-mr-0",
                    children: /*#__PURE__*/ jsx(NavScreenMenuGroup, {
                        ...item,
                        items: 'items' in item ? item.items : item
                    })
                }, item.text)
            }, item.text))
    });
function NavScreen(props) {
    const { isScreenOpen, toggleScreen, siteData, pathname } = props;
    const screen = useRef(null);
    const localesData = siteData.themeConfig.locales || [];
    const hasMultiLanguage = localesData.length > 1;
    const hasMultiVersion = siteData.multiVersion.versions.length > 1;
    const menuItems = useNavData();
    const hasAppearanceSwitch = false !== siteData.themeConfig.darkMode;
    const socialLinks = siteData?.themeConfig?.socialLinks || [];
    const hasSocialLinks = socialLinks.length > 0;
    const langs = localesData.map((item)=>item.lang || 'zh') || [];
    const { base } = siteData;
    useEffect(()=>{
        screen.current && isScreenOpen && disableBodyScroll(screen.current, {
            reserveScrollBarGap: true
        });
        return ()=>{
            clearAllBodyScrollLocks();
        };
    }, [
        isScreenOpen
    ]);
    return /*#__PURE__*/ jsx("div", {
        className: `${navScreen} ${isScreenOpen ? active : ''} rspress-nav-screen`,
        ref: screen,
        id: "navScreen",
        children: /*#__PURE__*/ jsxs("div", {
            className: container,
            children: [
                /*#__PURE__*/ jsx(NavScreenMenu, {
                    menuItems: menuItems,
                    base: base,
                    langs: langs,
                    pathname: pathname,
                    toggleScreen: toggleScreen
                }),
                /*#__PURE__*/ jsxs("div", {
                    className: "rp-flex rp-items-center rp-justify-center rp-flex-col rp-gap-2",
                    children: [
                        hasAppearanceSwitch && /*#__PURE__*/ jsx(NavScreenAppearance, {}),
                        hasMultiLanguage && /*#__PURE__*/ jsx(NavScreenTranslations, {}),
                        hasMultiVersion && /*#__PURE__*/ jsx(NavScreenVersions, {}),
                        hasSocialLinks && /*#__PURE__*/ jsx(SocialLinks, {
                            socialLinks: socialLinks
                        })
                    ]
                })
            ]
        })
    });
}
export { NavScreen };
