import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useLocation } from "@rspress/runtime";
import { inBrowser } from "@rspress/shared";
import { useEffect, useState } from "react";
import { NavBarTitle } from "../Nav/NavBarTitle.js";
import { SidebarDivider } from "./SidebarDivider.js";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarSectionHeader } from "./SidebarSectionHeader.js";
import { useSidebarData } from "../../logic/useSidebarData.js";
import { navTitleMask, open as external_index_module_js_open, sidebar, sidebarContent } from "./index.module.js";
import { isSideBarCustomLink, isSidebarDivider, isSidebarSectionHeader, useActiveMatcher } from "./utils.js";
const highlightTitleStyle = {
    fontSize: '14px',
    paddingLeft: '24px',
    fontWeight: 'bold'
};
let bodyStyleOverflow;
let matchCache = new WeakMap();
function Sidebar(props) {
    const { isSidebarOpen, beforeSidebar, afterSidebar, uiSwitch, navTitle } = props;
    const { pathname: rawPathname } = useLocation();
    const rawSidebarData = useSidebarData();
    const [sidebarData, setSidebarData] = useState(()=>rawSidebarData.filter(Boolean).flat());
    const pathname = decodeURIComponent(rawPathname);
    const activeMatcher = useActiveMatcher();
    useEffect(()=>{
        if (inBrowser()) if (isSidebarOpen) {
            bodyStyleOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
        } else document.body.style.overflow = bodyStyleOverflow || '';
        return ()=>{
            if (inBrowser()) document.body.style.overflow = bodyStyleOverflow || '';
        };
    }, [
        isSidebarOpen
    ]);
    useEffect(()=>{
        if (rawSidebarData === sidebarData) return;
        matchCache = new WeakMap();
        const match = (item)=>{
            if (matchCache.has(item)) return matchCache.get(item);
            if ('link' in item && item.link && activeMatcher(item.link)) {
                matchCache.set(item, true);
                return true;
            }
            if ('items' in item) {
                const result = item.items.some((child)=>match(child));
                if (result) {
                    matchCache.set(item, true);
                    return true;
                }
            }
            matchCache.set(item, false);
            return false;
        };
        const traverse = (item)=>{
            if ('items' in item) {
                item.items.forEach(traverse);
                if (match(item)) item.collapsed = false;
            }
        };
        const newSidebarData = rawSidebarData.filter(Boolean).flat();
        newSidebarData.forEach(traverse);
        setSidebarData(newSidebarData);
    }, [
        rawSidebarData,
        pathname
    ]);
    return /*#__PURE__*/ jsxs("aside", {
        className: `${sidebar} rspress-sidebar ${isSidebarOpen ? external_index_module_js_open : ''}`,
        children: [
            uiSwitch?.showNavbar ? /*#__PURE__*/ jsx("div", {
                className: navTitleMask,
                children: navTitle || /*#__PURE__*/ jsx(NavBarTitle, {})
            }) : null,
            /*#__PURE__*/ jsx("div", {
                className: `rspress-scrollbar ${sidebarContent}`,
                children: /*#__PURE__*/ jsxs("nav", {
                    className: "rp-pb-2",
                    children: [
                        beforeSidebar,
                        /*#__PURE__*/ jsx(SidebarList, {
                            sidebarData: sidebarData,
                            setSidebarData: setSidebarData
                        }),
                        afterSidebar
                    ]
                })
            })
        ]
    });
}
function SidebarList({ sidebarData, setSidebarData }) {
    const activeMatcher = useActiveMatcher();
    return /*#__PURE__*/ jsx(Fragment, {
        children: sidebarData.map((item, index)=>/*#__PURE__*/ jsx(SidebarListItem, {
                item: item,
                index: index,
                setSidebarData: setSidebarData,
                activeMatcher: activeMatcher
            }, index))
    });
}
function SidebarListItem(props) {
    const { item, index, setSidebarData, activeMatcher } = props;
    if (isSidebarDivider(item)) return /*#__PURE__*/ jsx(SidebarDivider, {
        depth: 0,
        dividerType: item.dividerType
    }, index);
    if (isSidebarSectionHeader(item)) return /*#__PURE__*/ jsx(SidebarSectionHeader, {
        sectionHeaderText: item.sectionHeaderText,
        tag: item.tag
    }, index);
    if (isSideBarCustomLink(item)) return /*#__PURE__*/ jsx(SidebarItem, {
        id: String(index),
        item: item,
        depth: 0,
        collapsed: item.collapsed ?? true,
        setSidebarData: setSidebarData,
        activeMatcher: activeMatcher,
        contextContainerClassName: "rspress-sidebar-custom-link"
    }, index);
    return /*#__PURE__*/ jsx(SidebarItem, {
        id: String(index),
        item: item,
        depth: 0,
        activeMatcher: activeMatcher,
        collapsed: item.collapsed ?? true,
        setSidebarData: setSidebarData
    }, index);
}
export { Sidebar, SidebarList, bodyStyleOverflow, highlightTitleStyle, matchCache };
