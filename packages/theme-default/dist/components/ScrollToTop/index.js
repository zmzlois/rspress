import { jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { entered, scrollToTop as external_index_module_js_scrollToTop } from "./index.module.js";
function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const handleScroll = ()=>{
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        setIsVisible(scrollTop > 0);
    };
    const scrollToTop = ()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    useEffect(()=>{
        window.addEventListener('scroll', handleScroll);
    }, []);
    return /*#__PURE__*/ jsx("button", {
        className: `${external_index_module_js_scrollToTop} ${isVisible ? entered : ''}`,
        onClick: scrollToTop,
        children: /*#__PURE__*/ jsx("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            className: "rp-w-6 rp-h-6",
            children: /*#__PURE__*/ jsx("path", {
                fillRule: "evenodd",
                d: "M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z",
                clipRule: "evenodd"
            })
        })
    });
}
export { ScrollToTop };
