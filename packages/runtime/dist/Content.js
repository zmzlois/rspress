import { Fragment, jsx } from "react/jsx-runtime";
import { Suspense, memo, useMemo } from "react";
import { useLocation } from "react-router-dom";
import virtual_site_data from "virtual-site-data";
import { useViewTransition } from "./hooks.js";
import { pathnameToRouteService } from "./route.js";
function TransitionContentImpl(props) {
    let element = props.el;
    if (virtual_site_data?.themeConfig?.enableContentAnimation) element = useViewTransition(props.el);
    return element;
}
const TransitionContent = /*#__PURE__*/ memo(TransitionContentImpl, (prevProps, nextProps)=>prevProps.el === nextProps.el);
const Content = ({ fallback = /*#__PURE__*/ jsx(Fragment, {}) })=>{
    const { pathname } = useLocation();
    const matchedElement = useMemo(()=>{
        const route = pathnameToRouteService(pathname);
        return route?.element;
    }, [
        pathname
    ]);
    return /*#__PURE__*/ jsx(Suspense, {
        fallback: fallback,
        children: /*#__PURE__*/ jsx(TransitionContent, {
            el: matchedElement
        })
    });
};
export { Content };
