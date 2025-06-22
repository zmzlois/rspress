import { jsx, jsxs } from "react/jsx-runtime";
import { ThemeContext, flushSync } from "@rspress/runtime";
import moon from "@theme-assets/moon";
import sun from "@theme-assets/sun";
import { useContext } from "react";
import virtual_site_data from "virtual-site-data";
import { SvgWrapper } from "../SvgWrapper/index.js";
import "./index.css";
const supportAppearanceTransition = ()=>'function' == typeof document?.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const removeClipViewTransition = ()=>{
    const styleDom = document.createElement('style');
    styleDom.innerHTML = `
      .rspress-doc {
        view-transition-name: none !important;
      }
  `;
    document.head.appendChild(styleDom);
    return ()=>{
        document.head.removeChild(styleDom);
    };
};
function SwitchAppearance({ onClick }) {
    const { theme, setTheme = ()=>{} } = useContext(ThemeContext);
    const handleClick = (event)=>{
        const supported = supportAppearanceTransition();
        const enabled = virtual_site_data?.themeConfig?.enableAppearanceAnimation;
        const nextTheme = 'dark' === theme ? 'light' : 'dark';
        const isDark = 'dark' === nextTheme;
        if (supported && enabled) {
            const x = event.clientX;
            const y = event.clientY;
            const endRadius = Math.hypot(Math.max(x, innerWidth - x + 200), Math.max(y, innerHeight - y + 200));
            const dispose = removeClipViewTransition();
            const transition = document.startViewTransition(async ()=>{
                flushSync(()=>{
                    setTheme(nextTheme);
                    onClick?.();
                });
            });
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            transition.ready.then(()=>{
                document.documentElement.animate({
                    clipPath: isDark ? [
                        ...clipPath
                    ].reverse() : clipPath
                }, {
                    duration: 400,
                    easing: 'ease-in',
                    pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
                    id: ''
                }).finished.then(()=>{
                    dispose();
                });
            });
        } else {
            setTheme(nextTheme);
            onClick?.();
        }
    };
    return /*#__PURE__*/ jsx("div", {
        onClick: handleClick,
        className: "md:rp-mr-2 rspress-nav-appearance",
        children: /*#__PURE__*/ jsxs("div", {
            className: "rp-p-1 rp-border rp-border-solid rp-border-gray-300 rp-text-gray-400 rp-cursor-pointer rp-rounded-md hover:rp-border-gray-600 hover:rp-text-gray-600 dark:hover:rp-border-gray-200 dark:hover:rp-text-gray-200 rp-transition-all rp-duration-300 rp-w-7 rp-h-7",
            children: [
                /*#__PURE__*/ jsx(SvgWrapper, {
                    className: "dark:rp-hidden",
                    icon: sun,
                    width: "18",
                    height: "18",
                    fill: "currentColor"
                }),
                /*#__PURE__*/ jsx(SvgWrapper, {
                    className: "rp-hidden dark:rp-block",
                    icon: moon,
                    width: "18",
                    height: "18",
                    fill: "currentColor"
                })
            ]
        })
    });
}
export { SwitchAppearance };
