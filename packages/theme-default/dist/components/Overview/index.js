import { jsx, jsxs } from "react/jsx-runtime";
import { isEqualPath, normalizeHrefInRuntime, usePageData, withBase } from "@rspress/runtime";
import { Link } from "@theme";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { useSidebarData } from "../../logic/useSidebarData.js";
import { renderInlineMarkdown } from "../../logic/utils.js";
import { isSidebarDivider, isSidebarSingleFile } from "../Sidebar/utils.js";
import { findItemByRoutePath } from "./utils.js";
import * as __WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__ from "./index.module.js";
const normalizeText = (s)=>s.toLowerCase().replace(/-/g, ' ');
const matchesQuery = (text, query)=>normalizeText(text).includes(normalizeText(query));
const SearchInput = ({ query, setQuery, searchRef, filterNameText, filterPlaceholderText })=>/*#__PURE__*/ jsxs("div", {
        className: "rp-flex rp-items-center rp-justify-start rp-gap-4",
        children: [
            /*#__PURE__*/ jsx("label", {
                htmlFor: "api-filter",
                children: filterNameText
            }),
            /*#__PURE__*/ jsx("input", {
                ref: searchRef,
                type: "search",
                placeholder: filterPlaceholderText,
                id: "api-filter",
                value: query,
                onChange: (e)=>setQuery(e.target.value),
                className: "rp-border rp-border-gray-300 dark:rp-border-gray-700 rp-rounded-lg rp-px-3 rp-py-2 rp-transition-shadow rp-duration-250 rp-ease-in-out focus:rp-outline-none focus:rp-ring-2 focus:rp-ring-green-500 focus:rp-ring-opacity-50"
            })
        ]
    });
const GroupRenderer = ({ group, styles })=>/*#__PURE__*/ jsxs("div", {
        className: "rp-mb-16",
        children: [
            /*#__PURE__*/ jsx("h2", {
                ...renderInlineMarkdown(group.name)
            }),
            /*#__PURE__*/ jsx("div", {
                className: styles.overviewGroups,
                children: group.items.map((item)=>/*#__PURE__*/ jsxs("div", {
                        className: styles.overviewGroup,
                        children: [
                            /*#__PURE__*/ jsx("div", {
                                className: "rp-flex",
                                children: /*#__PURE__*/ jsx("h3", {
                                    style: {
                                        marginBottom: 8
                                    },
                                    children: /*#__PURE__*/ jsx(Link, {
                                        href: normalizeHrefInRuntime(item.link),
                                        ...renderInlineMarkdown(item.text)
                                    })
                                })
                            }),
                            /*#__PURE__*/ jsx("ul", {
                                className: "rp-list-none",
                                children: item.headers?.map((header)=>/*#__PURE__*/ jsx("li", {
                                        className: `${styles.overviewGroupLi} ${styles[`level${header.depth}`]} first:rp-mt-2`,
                                        children: /*#__PURE__*/ jsx(Link, {
                                            href: `${normalizeHrefInRuntime(item.link)}#${header.id}`,
                                            ...renderInlineMarkdown(header.text)
                                        })
                                    }, header.id))
                            })
                        ]
                    }, item.link))
            })
        ]
    }, group.name);
function Overview(props) {
    const { siteData, page: { routePath, title, frontmatter } } = usePageData();
    const { content, groups: customGroups, defaultGroupTitle: _ = 'Others' } = props;
    const [query, setQuery] = useState('');
    const searchRef = useRef(null);
    useEffect(()=>{
        searchRef.current?.focus();
    }, []);
    const subFilter = (link)=>withBase(link).startsWith(routePath.replace(/overview$/, '')) && !isEqualPath(withBase(link), routePath);
    const getChildLink = (traverseItem)=>{
        if ('link' in traverseItem && traverseItem.link) return traverseItem.link;
        if ('items' in traverseItem) return getChildLink(traverseItem.items[0]);
        return '';
    };
    const { pages } = siteData;
    const overviewModules = pages.filter((page)=>subFilter(page.routePath));
    let overviewSidebarGroups = useSidebarData();
    const { overview: { filterNameText = 'Filter', filterPlaceholderText = 'Enter keyword', filterNoResultText = 'No matching API found' } = {} } = useLocaleSiteData();
    if (overviewSidebarGroups[0]?.link !== routePath) overviewSidebarGroups = findItemByRoutePath(overviewSidebarGroups, routePath);
    function normalizeSidebarItem(item, sidebarGroup, frontmatter) {
        if (isSidebarDivider(item)) return false;
        if (withBase(item.link) === `${routePath}index` && frontmatter?.overview === true) return false;
        const overviewHeaders = props?.overviewHeaders ?? item.overviewHeaders ?? frontmatter?.overviewHeaders ?? sidebarGroup?.overviewHeaders ?? [
            2
        ];
        const pageModule = overviewModules.find((m)=>isEqualPath(m.routePath, withBase(item.link || '')));
        const link = getChildLink(item);
        return {
            ...item,
            link,
            headers: pageModule?.toc?.filter((header)=>overviewHeaders.some((depth)=>header.depth === depth)) || []
        };
    }
    const groups = customGroups ?? useMemo(()=>{
        const group = overviewSidebarGroups.filter((normalizedSidebarGroup)=>{
            const sidebarGroup = normalizedSidebarGroup;
            if (Array.isArray(sidebarGroup?.items)) return sidebarGroup.items.filter((item)=>subFilter(getChildLink(item))).length > 0;
            if (isSidebarSingleFile(sidebarGroup) && subFilter(getChildLink(sidebarGroup))) return true;
            return false;
        }).map((normalizedSidebarGroup)=>{
            const sidebarGroup = normalizedSidebarGroup;
            let items = [];
            if (sidebarGroup?.items) items = sidebarGroup?.items?.map((item)=>normalizeSidebarItem(item, sidebarGroup, frontmatter)).filter(Boolean);
            else if (isSidebarSingleFile(sidebarGroup)) items = [
                normalizeSidebarItem({
                    link: sidebarGroup.link,
                    text: sidebarGroup.text || '',
                    tag: sidebarGroup.tag,
                    _fileKey: sidebarGroup._fileKey,
                    overviewHeaders: sidebarGroup.overviewHeaders
                }, void 0, frontmatter)
            ];
            return {
                name: sidebarGroup.text || '',
                items
            };
        });
        return group;
    }, [
        overviewSidebarGroups,
        routePath,
        frontmatter
    ]);
    const filtered = useMemo(()=>{
        if (!query) return groups;
        return groups.map((group)=>{
            if (matchesQuery(group.name, query)) return group;
            const matchedItems = group.items.map((item)=>{
                if (matchesQuery(item.text || '', query)) return item;
                const matchedHeaders = item.headers?.filter(({ text })=>matchesQuery(text, query));
                return matchedHeaders?.length ? {
                    ...item,
                    headers: matchedHeaders
                } : null;
            }).filter(Boolean);
            return matchedItems.length ? {
                ...group,
                items: matchedItems
            } : null;
        }).filter(Boolean);
    }, [
        groups,
        query
    ]);
    const overviewTitle = title || 'Overview';
    return /*#__PURE__*/ jsxs("div", {
        className: "overview-index rp-mx-auto",
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "rp-flex rp-flex-col sm:rp-flex-row rp-items-start sm:rp-items-center rp-justify-between rp-mb-10",
                children: [
                    /*#__PURE__*/ jsx("h1", {
                        className: "rp-text-3xl rp-leading-10 rp-tracking-tight",
                        children: overviewTitle
                    }),
                    /*#__PURE__*/ jsx(SearchInput, {
                        query: query,
                        setQuery: setQuery,
                        searchRef: searchRef,
                        filterNameText: filterNameText,
                        filterPlaceholderText: filterPlaceholderText
                    })
                ]
            }),
            content,
            filtered.length > 0 ? filtered.map((group)=>/*#__PURE__*/ jsx(GroupRenderer, {
                    group: group,
                    styles: __WEBPACK_EXTERNAL_MODULE__index_module_js_6796f91d__
                }, group?.name)) : /*#__PURE__*/ jsx("div", {
                className: "rp-text-lg rp-text-gray-500 rp-text-center rp-mt-9 rp-pt-9 rp-border-t rp-border-gray-200 dark:rp-border-gray-800",
                children: `${filterNoResultText}: ${query}`
            })
        ]
    });
}
export { Overview };
