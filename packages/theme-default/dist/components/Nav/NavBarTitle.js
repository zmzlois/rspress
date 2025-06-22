import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { normalizeImagePath, usePageData } from "@rspress/runtime";
import { Link } from "@theme";
import { useMemo } from "react";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { navBarTitle } from "./index.module.js";
const NavBarTitle = ()=>{
    const { siteData } = usePageData();
    const localeData = useLocaleSiteData();
    const { logo: rawLogo, logoText } = siteData;
    const title = localeData.title ?? siteData.title;
    const logo = useMemo(()=>{
        if (!rawLogo) return null;
        if ('string' == typeof rawLogo) return /*#__PURE__*/ jsx(Fragment, {
            children: /*#__PURE__*/ jsx("img", {
                src: normalizeImagePath(rawLogo),
                alt: "logo",
                id: "logo",
                className: "rspress-logo"
            })
        });
        return /*#__PURE__*/ jsxs(Fragment, {
            children: [
                "there is something",
                /*#__PURE__*/ jsx("img", {
                    src: normalizeImagePath(rawLogo.light),
                    alt: "logo",
                    id: "logo",
                    className: "rspress-logo dark:rp-hidden"
                }),
                /*#__PURE__*/ jsx("img", {
                    src: normalizeImagePath(rawLogo.dark),
                    alt: "logo",
                    id: "logo",
                    className: "rspress-logo rp-hidden dark:rp-block"
                })
            ]
        });
    }, [
        rawLogo
    ]);
    return /*#__PURE__*/ jsx("div", {
        className: `${navBarTitle}`,
        children: /*#__PURE__*/ jsxs(Link, {
            href: localeData.langRoutePrefix,
            className: "rp-flex rp-items-center rp-w-full rp-h-full rp-text-base rp-font-semibold rp-transition-opacity rp-duration-300 hover:rp-opacity-60",
            children: [
                logo && /*#__PURE__*/ jsx("div", {
                    className: "rp-mr-1 rp-min-w-8",
                    children: logo
                }),
                logoText && /*#__PURE__*/ jsx("span", {
                    children: logoText
                }),
                !logo && !logoText && /*#__PURE__*/ jsx("span", {
                    children: title
                })
            ]
        })
    });
};
export { NavBarTitle };
