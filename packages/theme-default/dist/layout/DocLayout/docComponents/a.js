import { jsx } from "react/jsx-runtime";
import { Link } from "@theme";
import { inlineLink, link as external_index_module_js_link } from "./index.module.js";
import { normalizeHrefInRuntime, removeBase, useLang, usePageData, useVersion, withBase } from "@rspress/runtime";
import { isExternalUrl } from "@rspress/shared";
function usePathUtils() {
    const currentLang = useLang();
    const currentVersion = useVersion();
    const pageData = usePageData();
    const defaultLang = pageData.siteData.lang;
    const defaultVersion = pageData.siteData.multiVersion.default;
    const normalizeLinkHref = (rawHref)=>{
        let href = rawHref;
        if ((defaultLang || defaultVersion) && !isExternalUrl(href) && !href.startsWith('#')) {
            href = removeBase(href);
            const linkParts = href.split('/').filter(Boolean);
            let versionPart = '';
            let langPart = '';
            let purePathPart = '';
            if (defaultVersion) {
                if (currentVersion !== defaultVersion) {
                    versionPart = currentVersion;
                    if (linkParts[0] === currentVersion) linkParts.shift();
                } else if (linkParts[0] === defaultVersion) linkParts.shift();
            }
            if (defaultLang) {
                if (currentLang !== defaultLang) {
                    langPart = currentLang;
                    if (linkParts[0] === currentLang) linkParts.shift();
                } else if (linkParts[0] === defaultLang) linkParts.shift();
            }
            purePathPart = linkParts.join('/');
            return normalizeHrefInRuntime(withBase([
                versionPart,
                langPart,
                purePathPart
            ].filter(Boolean).join('/')));
        }
        return href;
    };
    return {
        normalizeLinkHref
    };
}
const A = (props)=>{
    const { href = '', className = '' } = props;
    const { normalizeLinkHref } = usePathUtils();
    return /*#__PURE__*/ jsx(Link, {
        ...props,
        className: `${className} ${external_index_module_js_link} ${inlineLink}`,
        href: normalizeLinkHref(href)
    });
};
export { A };
