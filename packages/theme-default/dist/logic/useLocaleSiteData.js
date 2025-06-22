import { usePageData } from "@rspress/runtime";
import { addTrailingSlash } from "@rspress/shared";
function useLocaleSiteData() {
    const pageData = usePageData();
    const { page: { lang } } = pageData;
    const themeConfig = pageData?.siteData?.themeConfig ?? {};
    const defaultLang = pageData.siteData.lang ?? '';
    const locales = themeConfig?.locales;
    if (!locales || 0 === locales.length) return {
        nav: themeConfig.nav,
        sidebar: themeConfig.sidebar,
        prevPageText: themeConfig.prevPageText,
        nextPageText: themeConfig.nextPageText,
        sourceCodeText: themeConfig.sourceCodeText,
        searchPlaceholderText: themeConfig.searchPlaceholderText,
        searchNoResultsText: themeConfig.searchNoResultsText,
        searchSuggestedQueryText: themeConfig.searchSuggestedQueryText,
        overview: themeConfig.overview
    };
    const localeInfo = locales.find((locale)=>locale.lang === lang);
    return {
        ...localeInfo,
        langRoutePrefix: lang === defaultLang ? '/' : addTrailingSlash(lang)
    };
}
export { useLocaleSiteData };
