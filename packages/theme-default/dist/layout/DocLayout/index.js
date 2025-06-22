import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { MDXProvider } from "@mdx-js/react";
import { Content, NoSSR, usePageData } from "@rspress/runtime";
import { Overview, ScrollToTop, getCustomMDXComponent } from "@theme";
import { slug } from "github-slugger";
import { useMemo, useState } from "react";
import { Aside } from "../../components/Aside/index.js";
import { useWatchToc } from "../../components/Aside/useDynamicToc.js";
import { DocFooter } from "../../components/DocFooter/index.js";
import { Sidebar } from "../../components/Sidebar/index.js";
import { SidebarMenu } from "../../components/SidebarMenu/index.js";
import { TabDataContext } from "../../logic/TabDataContext.js";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { A } from "./docComponents/a.js";
import { H1 } from "./docComponents/title.js";
import { asideContainer, content, docLayout } from "./index.module.js";
function DocLayout(props) {
    const { beforeDocFooter, afterDocFooter, beforeDoc, afterDoc, beforeDocContent, afterDocContent, beforeOutline, afterOutline, beforeSidebar, afterSidebar, uiSwitch, navTitle, components } = props;
    const { siteData, page } = usePageData();
    const { headingTitle, title, frontmatter } = page;
    const [tabData, setTabData] = useState({});
    const { themeConfig } = siteData;
    const enableScrollToTop = themeConfig.enableScrollToTop ?? false;
    const localesData = useLocaleSiteData();
    const outlineTitle = localesData?.outlineTitle || themeConfig?.outlineTitle || 'ON THIS PAGE';
    const isOverviewPage = frontmatter?.overview ?? false;
    const mdxComponents = {
        ...getCustomMDXComponent(),
        ...components
    };
    const docContent = /*#__PURE__*/ jsx(TabDataContext.Provider, {
        value: {
            tabData,
            setTabData
        },
        children: /*#__PURE__*/ jsx(MDXProvider, {
            components: mdxComponents,
            children: /*#__PURE__*/ jsx(Content, {})
        })
    });
    const fallbackTitle = useMemo(()=>{
        const titleSlug = title && slug(title);
        return false !== siteData.themeConfig.fallbackHeadingTitle && !headingTitle && titleSlug && /*#__PURE__*/ jsxs(H1, {
            id: titleSlug,
            children: [
                title,
                /*#__PURE__*/ jsx(A, {
                    className: "header-anchor",
                    href: `#${titleSlug}`,
                    "aria-hidden": true,
                    children: "#"
                })
            ]
        });
    }, [
        headingTitle,
        title,
        siteData.themeConfig.fallbackHeadingTitle
    ]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const rspressDocRef = useWatchToc();
    return /*#__PURE__*/ jsxs("div", {
        className: `${docLayout} rp-pt-0`,
        style: {
            ...uiSwitch?.showNavbar ? {} : {
                marginTop: 0
            }
        },
        children: [
            beforeDoc,
            uiSwitch?.showSidebar && /*#__PURE__*/ jsx(Sidebar, {
                isSidebarOpen: isSidebarOpen,
                beforeSidebar: beforeSidebar,
                afterSidebar: afterSidebar,
                uiSwitch: uiSwitch,
                navTitle: navTitle
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "rp-flex-1 rp-relative rp-min-w-0",
                children: [
                    /*#__PURE__*/ jsx(SidebarMenu, {
                        isSidebarOpen: isSidebarOpen,
                        onIsSidebarOpenChange: setIsSidebarOpen,
                        outlineTitle: outlineTitle,
                        uiSwitch: uiSwitch
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: `${content} rspress-doc-container rp-flex`,
                        children: [
                            /*#__PURE__*/ jsx("div", {
                                className: `rp-flex-1 ${isOverviewPage ? '' : 'rp-overflow-x-auto'}`,
                                children: isOverviewPage ? /*#__PURE__*/ jsxs(Fragment, {
                                    children: [
                                        beforeDocContent,
                                        /*#__PURE__*/ jsx(Overview, {
                                            content: docContent
                                        }),
                                        afterDocContent
                                    ]
                                }) : /*#__PURE__*/ jsxs(Fragment, {
                                    children: [
                                        /*#__PURE__*/ jsxs("div", {
                                            className: "rspress-doc",
                                            ref: rspressDocRef,
                                            children: [
                                                beforeDocContent,
                                                fallbackTitle,
                                                docContent,
                                                afterDocContent
                                            ]
                                        }),
                                        /*#__PURE__*/ jsxs("div", {
                                            className: "rspress-doc-footer",
                                            children: [
                                                beforeDocFooter,
                                                uiSwitch?.showDocFooter && /*#__PURE__*/ jsx(DocFooter, {}),
                                                afterDocFooter
                                            ]
                                        })
                                    ]
                                })
                            }),
                            enableScrollToTop && /*#__PURE__*/ jsx(NoSSR, {
                                children: /*#__PURE__*/ jsx(ScrollToTop, {})
                            }),
                            uiSwitch?.showAside && /*#__PURE__*/ jsxs("div", {
                                className: asideContainer,
                                style: uiSwitch?.showNavbar ? void 0 : {
                                    marginTop: 0,
                                    paddingTop: '32px'
                                },
                                children: [
                                    beforeOutline,
                                    /*#__PURE__*/ jsx(Aside, {
                                        outlineTitle: outlineTitle
                                    }),
                                    afterOutline
                                ]
                            })
                        ]
                    })
                ]
            }),
            afterDoc
        ]
    });
}
export { DocLayout };
