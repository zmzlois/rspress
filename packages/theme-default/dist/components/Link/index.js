import { jsx } from "react/jsx-runtime";
import { normalizeHrefInRuntime, pathnameToRouteService, useLocation, useNavigate, withBase } from "@rspress/runtime";
import { isExternalUrl } from "@rspress/shared";
import nprogress from "nprogress";
import { useMemo } from "react";
import { isActive } from "../../logic/getSidebarDataGroup.js";
import { scrollToTarget } from "../../logic/sideEffects.js";
import { useUISwitch } from "../../logic/useUISwitch.js";
import { preloadLink } from "../Sidebar/utils.js";
import { link as external_index_module_js_link } from "./index.module.js";
const scrollToAnchor = (smooth, scrollPaddingTop)=>{
    const currentUrl = window.location;
    const { hash: rawHash } = currentUrl;
    const hash = decodeURIComponent(rawHash);
    const target = hash.length > 1 && document.getElementById(hash.slice(1));
    if (hash && target) scrollToTarget(target, smooth, scrollPaddingTop);
};
nprogress.configure({
    showSpinner: false
});
function Link(props) {
    const { href = '/', children, className = '', onNavigate, onClick } = props;
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { scrollPaddingTop } = useUISwitch();
    const withBaseUrl = useMemo(()=>withBase(normalizeHrefInRuntime(href)), [
        href
    ]);
    const isExternal = isExternalUrl(href);
    const isHashOnlyLink = href.startsWith('#');
    if (isExternal) return /*#__PURE__*/ jsx("a", {
        ...props,
        href: href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: `${external_index_module_js_link} ${className}`,
        children: children
    });
    if (isHashOnlyLink) return /*#__PURE__*/ jsx("a", {
        ...props,
        href: href,
        className: `${external_index_module_js_link} ${className}`,
        children: children
    });
    const handleNavigate = async (e)=>{
        if (0 !== e.button || e.currentTarget.target && '_self' !== e.currentTarget.target || e.metaKey || e.shiftKey || e.altKey || e.ctrlKey) return;
        e.preventDefault();
        const inCurrentPage = isActive(withBaseUrl, pathname);
        if (!process.env.__SSR__ && !inCurrentPage) {
            const matchedRoute = pathnameToRouteService(withBaseUrl);
            if (matchedRoute) {
                const timer = setTimeout(()=>{
                    nprogress.start();
                }, 200);
                await matchedRoute.preload();
                clearTimeout(timer);
                nprogress.done();
            }
        }
        onNavigate?.();
        navigate(withBaseUrl, {
            replace: false
        });
        setTimeout(()=>{
            scrollToAnchor(false, scrollPaddingTop);
        }, 100);
    };
    return /*#__PURE__*/ jsx("a", {
        ...props,
        href: withBaseUrl,
        className: `${external_index_module_js_link} ${className}`,
        onMouseEnter: ()=>preloadLink(withBaseUrl),
        onClick: (event)=>{
            onClick?.(event);
            handleNavigate(event);
        },
        children: children
    });
}
export { Link };
