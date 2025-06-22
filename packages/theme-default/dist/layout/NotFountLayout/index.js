import { jsx, jsxs } from "react/jsx-runtime";
import { usePageData, withBase } from "@rspress/runtime";
function NotFoundLayout() {
    const { siteData, page } = usePageData();
    const defaultLang = siteData.lang;
    const defaultVersion = siteData.multiVersion.default;
    if (defaultLang && 'undefined' != typeof window) {
        const regexp = new RegExp(`/${defaultLang}(\\/|$)`);
        if (regexp.test(location.pathname)) {
            const redirectUrl = location.pathname.replace(regexp, '/');
            window.location.replace(redirectUrl);
            return null;
        }
    }
    let root = '/';
    if (defaultVersion && page.version !== defaultVersion) root += `${page.version}/`;
    if (defaultLang && page.lang !== defaultLang) root += `${page.lang}/`;
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-m-auto rp-mt-50 rp-p-16 sm:rp-p-8 sm:rp-pt-24 sm:rp-pb-40 rp-text-center rp-flex rp-items-center rp-justify-center rp-flex-col",
        children: [
            /*#__PURE__*/ jsx("p", {
                className: "rp-text-6xl rp-font-semibold",
                children: "404"
            }),
            /*#__PURE__*/ jsx("h1", {
                className: "rp-leading-5 rp-pt-3 rp-text-xl rp-font-bold",
                children: "PAGE NOT FOUND"
            }),
            /*#__PURE__*/ jsx("div", {
                style: {
                    height: '1px'
                },
                className: "rp-mt-6 rp-mx-auto rp-mb-4.5 rp-w-16 rp-bg-gray-light-1"
            }),
            /*#__PURE__*/ jsx("div", {
                className: "rp-pt-5",
                children: /*#__PURE__*/ jsx("a", {
                    className: "rp-py-2 rp-px-4 rp-rounded-2xl rp-inline-block rp-border-solid rp-border-brand rp-text-brand rp-font-medium hover:rp-border-brand-dark hover:rp-text-brand-dark rp-transition-colors rp-duration-300",
                    href: withBase(root),
                    "aria-label": "go to home",
                    children: "Take me home"
                })
            })
        ]
    });
}
export { NotFoundLayout };
