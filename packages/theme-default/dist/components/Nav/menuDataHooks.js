import { jsx } from "react/jsx-runtime";
import { useLocation, usePageData, useVersion } from "@rspress/runtime";
import { replaceLang, replaceVersion } from "@rspress/shared";
import translator from "@theme-assets/translator";
import { SvgWrapper } from "../SvgWrapper/index.js";
function useTranslationMenuData() {
    const { siteData, page } = usePageData();
    const currentVersion = useVersion();
    const { pathname, search } = useLocation();
    const defaultLang = siteData.lang || '';
    const defaultVersion = siteData.multiVersion.default || '';
    const localeLanguages = Object.values(siteData.locales || siteData.themeConfig.locales || {});
    const cleanUrls = siteData.route?.cleanUrls || false;
    const hasMultiLanguage = localeLanguages.length > 1;
    const { lang: currentLang, pageType } = page;
    const { base } = siteData;
    const translationMenuData = hasMultiLanguage ? {
        text: /*#__PURE__*/ jsx(SvgWrapper, {
            icon: translator,
            style: {
                width: '18px',
                height: '18px'
            }
        }),
        items: localeLanguages.map((item)=>({
                text: item?.label,
                link: replaceLang(pathname + search, {
                    current: currentLang,
                    target: item.lang,
                    default: defaultLang
                }, {
                    current: currentVersion,
                    default: defaultVersion
                }, base, cleanUrls, '404' === pageType)
            })),
        activeValue: localeLanguages.find((item)=>currentLang === item.lang)?.label
    } : {
        items: []
    };
    return translationMenuData;
}
function useVersionMenuData() {
    const { siteData, page } = usePageData();
    const currentVersion = useVersion();
    const { pathname } = useLocation();
    const cleanUrls = siteData.route?.cleanUrls || false;
    const defaultVersion = siteData.multiVersion.default || '';
    const versions = siteData.multiVersion.versions || [];
    const { base } = siteData;
    const versionsMenuData = {
        items: versions.map((version)=>({
                text: version,
                link: replaceVersion(pathname, {
                    current: currentVersion,
                    target: version,
                    default: defaultVersion
                }, base, cleanUrls, '404' === page.pageType)
            })),
        text: currentVersion,
        activeValue: currentVersion
    };
    return versionsMenuData;
}
export { useTranslationMenuData, useVersionMenuData };
