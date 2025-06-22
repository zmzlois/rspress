import { pathnameToRouteService, useLocation } from "@rspress/runtime";
import { isExternalUrl } from "@rspress/shared";
import { useCallback } from "react";
import { isActive } from "../../logic/getSidebarDataGroup.js";
const isSidebarDivider = (item)=>'dividerType' in item;
const isSidebarSingleFile = (item)=>!('items' in item) && 'link' in item;
const isSidebarSectionHeader = (item)=>'sectionHeaderText' in item;
const isSideBarCustomLink = (item)=>'link' in item && isExternalUrl(item.link);
const preloadLink = (link)=>{
    const route = pathnameToRouteService(link);
    if (route) route.preload();
};
const useActiveMatcher = ()=>{
    const { pathname: rawPathname } = useLocation();
    const activeMatcher = useCallback((link)=>{
        const pathname = decodeURIComponent(rawPathname);
        return isActive(link, pathname);
    }, [
        rawPathname
    ]);
    return activeMatcher;
};
export { isSideBarCustomLink, isSidebarDivider, isSidebarSectionHeader, isSidebarSingleFile, preloadLink, useActiveMatcher };
