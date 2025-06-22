import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Content, usePageData } from "@rspress/runtime";
import { HomeLayout as external_theme_HomeLayout, Nav, NotFoundLayout as external_theme_NotFoundLayout } from "@theme";
import { Head, useHead } from "@unhead/react";
import react, { memo, useMemo } from "react";
import { useSetup } from "../../logic/sideEffects.js";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { useRedirect4FirstVisit } from "../../logic/useRedirect4FirstVisit.js";
import { useUISwitch } from "../../logic/useUISwitch.js";
import { DocLayout } from "../DocLayout/index.js";
const concatTitle = (title, suffix)=>{
    if (!suffix) return title;
    title = title.trim();
    suffix = suffix.trim();
    if (!suffix.startsWith('-') && !suffix.startsWith('|')) return `${title} - ${suffix}`;
    return `${title} ${suffix}`;
};
const HeadTags = /*#__PURE__*/ memo((props)=>{
    const { lang, frontmatter, description, title } = props;
    const head = frontmatter.head;
    const frontmatterTags = useMemo(()=>head?.map(([tagName, attrs])=>tagName ? /*#__PURE__*/ react.createElement(tagName, {
                ...attrs
            }) : null), [
        head
    ]);
    useHead({
        htmlAttrs: {
            lang: lang || 'en'
        },
        title: title || void 0,
        meta: [
            description ? {
                name: "description",
                content: description
            } : void 0
        ]
    });
    return /*#__PURE__*/ jsx(Head, {
        children: frontmatterTags ?? null
    });
});
function Layout(props) {
    const { top, bottom, beforeDocFooter, afterDocFooter, beforeDoc, afterDoc, beforeDocContent, afterDocContent, beforeSidebar, afterSidebar, beforeOutline, afterOutline, beforeNavTitle, afterNavTitle, navTitle, beforeNav, beforeHero, afterHero, beforeFeatures, afterFeatures, afterNavMenu, components, HomeLayout = external_theme_HomeLayout, NotFoundLayout = external_theme_NotFoundLayout } = props;
    const docProps = {
        beforeDocFooter,
        afterDocFooter,
        beforeDocContent,
        afterDocContent,
        beforeDoc,
        afterDoc,
        beforeSidebar,
        afterSidebar,
        beforeOutline,
        afterOutline,
        components
    };
    const homeProps = {
        beforeHero,
        afterHero,
        beforeFeatures,
        afterFeatures
    };
    const { siteData, page } = usePageData();
    const { pageType, lang: currentLang, title: articleTitle, frontmatter = {} } = page;
    const localesData = useLocaleSiteData();
    useSetup();
    useRedirect4FirstVisit();
    let title = frontmatter.title ?? articleTitle;
    const mainTitle = siteData.title || localesData.title || '';
    title = title && 'doc' === pageType ? concatTitle(title, frontmatter.titleSuffix || mainTitle) : 'home' === pageType ? concatTitle(mainTitle, frontmatter.titleSuffix) : '404' === pageType ? concatTitle('404', mainTitle) : mainTitle;
    const description = frontmatter?.description || siteData.description || localesData.description;
    const uiSwitch = {
        ...useUISwitch(),
        ...props.uiSwitch
    };
    const getContentLayout = ()=>{
        switch(pageType){
            case 'home':
                return /*#__PURE__*/ jsx(HomeLayout, {
                    ...homeProps
                });
            case 'doc':
                return /*#__PURE__*/ jsx(DocLayout, {
                    ...docProps,
                    uiSwitch: uiSwitch,
                    navTitle: navTitle
                });
            case '404':
                return /*#__PURE__*/ jsx(NotFoundLayout, {});
            case 'custom':
            case 'blank':
                return /*#__PURE__*/ jsx(Content, {});
            default:
                return /*#__PURE__*/ jsx(DocLayout, {
                    ...docProps
                });
        }
    };
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx(HeadTags, {
                lang: currentLang,
                title: title,
                description: description,
                frontmatter: frontmatter
            }),
            top,
            'blank' !== pageType && uiSwitch.showNavbar && /*#__PURE__*/ jsx(Nav, {
                beforeNavTitle: beforeNavTitle,
                afterNavTitle: afterNavTitle,
                navTitle: navTitle,
                beforeNav: beforeNav,
                afterNavMenu: afterNavMenu
            }),
            /*#__PURE__*/ jsx("section", {
                children: getContentLayout()
            }),
            bottom
        ]
    });
}
export { Layout };
