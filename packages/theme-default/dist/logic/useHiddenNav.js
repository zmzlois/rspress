import { useLocation, usePageData } from "@rspress/runtime";
import { throttle } from "lodash-es";
import { useEffect, useRef, useState } from "react";
function useEnableNav() {
    const { siteData: { themeConfig }, page: { frontmatter = {} } } = usePageData();
    const initialState = (frontmatter?.navbar ?? true) && themeConfig?.hideNavbar !== 'always';
    const [enableNav, setEnableNav] = useState(initialState);
    return [
        enableNav,
        setEnableNav
    ];
}
function useHiddenNav() {
    const { siteData: { themeConfig } } = usePageData();
    const hiddenBehavior = themeConfig.hideNavbar ?? 'never';
    const [hiddenNav, setHiddenNav] = useState(false);
    const { pathname } = useLocation();
    const lastScrollTop = useRef(0);
    if ('never' === hiddenBehavior) return false;
    if ('always' === hiddenBehavior) return true;
    useEffect(()=>{
        setHiddenNav(false);
        const onScrollListen = throttle(()=>{
            const { scrollTop } = document.documentElement;
            if (scrollTop === lastScrollTop.current) return;
            const shouldHidden = lastScrollTop.current > 0 && scrollTop - lastScrollTop.current > 0;
            setHiddenNav(shouldHidden);
            lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
        }, 200);
        window.addEventListener('scroll', onScrollListen);
        return ()=>{
            window.removeEventListener('scroll', onScrollListen);
        };
    }, [
        pathname
    ]);
    return hiddenNav;
}
export { useEnableNav, useHiddenNav };
