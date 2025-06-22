import { useLocation, usePageData, useWindowSize } from "@rspress/runtime";
import { useEffect, useState } from "react";
import { useEnableNav, useHiddenNav } from "./useHiddenNav.js";
import { useLocaleSiteData } from "./useLocaleSiteData.js";
function useUISwitch() {
    const { page, siteData } = usePageData();
    const { frontmatter } = page;
    const { themeConfig } = siteData;
    const localesData = useLocaleSiteData();
    const location = useLocation();
    const isOverviewPage = frontmatter?.overview ?? false;
    const getShowAside = ()=>{
        const defaultHasAside = 'undefined' == typeof window ? true : window.top === window.self;
        return (frontmatter?.outline ?? themeConfig?.outline ?? defaultHasAside) && !isOverviewPage;
    };
    const [showNavbar, setShowNavbar] = useEnableNav();
    const hiddenNav = useHiddenNav();
    const [showAside, setShowAside] = useState(getShowAside());
    const [showDocFooter, setShowDocFooter] = useState(frontmatter?.footer ?? true);
    const sidebar = localesData.sidebar || {};
    const showSidebar = frontmatter?.sidebar !== false && Object.keys(sidebar).length > 0;
    const { width } = useWindowSize();
    const showSidebarMenu = width <= 960 || width <= 1280 && page.toc.length > 0;
    useEffect(()=>{
        setShowAside(getShowAside());
    }, [
        page,
        siteData
    ]);
    useEffect(()=>{
        const query = new URLSearchParams(location.search);
        const documentStyle = document.documentElement.style;
        const originalSidebarWidth = documentStyle.getPropertyValue('--rp-sidebar-width');
        const originalAsideWidth = documentStyle.getPropertyValue('--rp-aside-width');
        const originNavbar = showNavbar;
        const originDocFooter = showDocFooter;
        const navbar = query.get('navbar');
        const sidebar = query.get('sidebar');
        const aside = query.get('outline');
        const footer = query.get('footer');
        if ("0" === navbar) setShowNavbar(false);
        if ("0" === sidebar) document.documentElement.style.setProperty('--rp-sidebar-width', '0px');
        if ("0" === aside) document.documentElement.style.setProperty('--rp-aside-width', '0px');
        if ("0" === footer) setShowDocFooter(false);
        return ()=>{
            document.documentElement.style.setProperty('--rp-sidebar-width', originalSidebarWidth);
            document.documentElement.style.setProperty('--rp-aside-width', originalAsideWidth);
            setShowNavbar(originNavbar);
            setShowDocFooter(originDocFooter);
        };
    }, [
        location.search
    ]);
    const navbarHeight = hiddenNav ? 0 : width <= 768 ? 56 : 72;
    const sidebarMenuHeight = showSidebarMenu ? 46 : 0;
    const scrollPaddingTop = navbarHeight + sidebarMenuHeight;
    return {
        showAside,
        showNavbar,
        showSidebar,
        showSidebarMenu,
        showDocFooter,
        navbarHeight,
        sidebarMenuHeight,
        scrollPaddingTop
    };
}
export { useUISwitch };
