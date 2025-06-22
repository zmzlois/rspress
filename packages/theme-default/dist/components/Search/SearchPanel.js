import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createPortal, usePageData } from "@rspress/runtime";
import { isProduction } from "@rspress/shared";
import _theme_assets_close from "@theme-assets/close";
import loading from "@theme-assets/loading";
import _theme_assets_search from "@theme-assets/search";
import { debounce } from "lodash-es";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { Tab, Tabs } from "../Tabs/index.js";
import { NoSearchResult } from "./NoSearchResult.js";
import { SuggestItem } from "./SuggestItem.js";
import { close as external_index_module_js_close, input, inputForm, mask, modal, searchHits, tabClassName } from "./index.module.js";
import { PageSearcher } from "./logic/search.js";
import { RenderType } from "./logic/types.js";
import { normalizeSearchIndexes, removeDomain } from "./logic/util.js";
import * as __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__ from "virtual-search-hooks";
const KEY_CODE = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ENTER: 'Enter',
    SEARCH: 'KeyK',
    ESC: 'Escape'
};
const useDebounce = (cb)=>{
    const cbRef = useRef(cb);
    cbRef.current = cb;
    const debounced = useCallback(debounce((...args)=>cbRef.current(...args), 150), []);
    return debounced;
};
function SearchPanel({ focused, setFocused }) {
    const [query, setQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const searchInputRef = useRef(null);
    const [isSearching, setIsSearching] = useState(false);
    const [resultTabIndex, setResultTabIndex] = useState(0);
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
    const pageSearcherRef = useRef(null);
    const pageSearcherConfigRef = useRef(null);
    const [initStatus, setInitStatus] = useState('initial');
    const searchResultRef = useRef(null);
    const searchResultTabRef = useRef(null);
    const mousePositionRef = useRef({
        pageX: null,
        pageY: null
    });
    const [canScroll, setCanScroll] = useState(false);
    const scrollTo = (offsetTop, offsetHeight)=>{
        const currentOffsetHeight = searchResultRef.current?.offsetHeight;
        const currentScrollTop = searchResultRef.current?.scrollTop;
        if (canScroll && void 0 !== currentOffsetHeight && void 0 !== currentScrollTop) {
            const scrollDown = offsetTop + offsetHeight - currentOffsetHeight - (1 === searchResult.length ? 50 : -10);
            if (scrollDown > currentScrollTop) searchResultRef.current?.scrollTo({
                top: scrollDown
            });
            const scrollUp = 1 === searchResult.length ? offsetTop - 70 : offsetTop - 10;
            if (scrollUp < currentScrollTop) searchResultRef.current?.scrollTo({
                top: scrollUp
            });
        }
    };
    const { siteData, page: { lang, version } } = usePageData();
    const { searchPlaceholderText = 'Search docs' } = useLocaleSiteData();
    const { search, title: siteTitle } = siteData;
    const versionedSearch = search && 'remote' !== search.mode && search.versioned;
    const DEFAULT_RESULT = [
        {
            group: siteTitle,
            result: [],
            renderType: RenderType.Default
        }
    ];
    const currentSuggestions = searchResult[resultTabIndex]?.result ?? [];
    const currentRenderType = searchResult[resultTabIndex]?.renderType ?? RenderType.Default;
    if (false === search) return null;
    const createSearcher = ()=>{
        if (pageSearcherRef.current) return pageSearcherRef.current;
        const pageSearcherConfig = {
            currentLang: lang,
            currentVersion: version
        };
        const pageSearcher = new PageSearcher({
            indexName: siteTitle,
            ...search,
            ...pageSearcherConfig
        });
        pageSearcherRef.current = pageSearcher;
        pageSearcherConfigRef.current = pageSearcherConfig;
        return pageSearcherRef.current;
    };
    async function initSearch() {
        if ('initial' !== initStatus) return;
        const searcher = createSearcher();
        setInitStatus('initing');
        await searcher.init();
        setInitStatus('inited');
        const query = searchInputRef.current?.value;
        if (query) {
            const matched = await searcher.match(query);
            setSearchResult(matched || DEFAULT_RESULT);
            setIsSearching(false);
        }
    }
    const clearSearchState = ()=>{
        setFocused(false);
        setResultTabIndex(0);
        setCurrentSuggestionIndex(0);
    };
    useEffect(()=>{
        const onKeyDown = (e)=>{
            switch(e.code){
                case KEY_CODE.SEARCH:
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        setFocused(!focused);
                    }
                    break;
                case KEY_CODE.ARROW_DOWN:
                    if (e.isComposing) return;
                    if (focused) {
                        e.preventDefault();
                        if (currentSuggestions && currentRenderType === RenderType.Default) {
                            setCanScroll(true);
                            setCurrentSuggestionIndex((currentSuggestionIndex + 1) % currentSuggestions.length);
                        }
                    }
                    break;
                case KEY_CODE.ARROW_UP:
                    if (e.isComposing) return;
                    if (focused) {
                        e.preventDefault();
                        if (currentRenderType === RenderType.Default) {
                            const currentSuggestionsLength = currentSuggestions.length;
                            setCanScroll(true);
                            setCurrentSuggestionIndex((currentSuggestionIndex - 1 + currentSuggestionsLength) % currentSuggestionsLength);
                        }
                    }
                    break;
                case KEY_CODE.ENTER:
                    if (e.isComposing) return;
                    if (currentSuggestionIndex >= 0 && currentRenderType === RenderType.Default) {
                        const flatSuggestions = [
                            ...Object.values(normalizeSuggestions(currentSuggestions))
                        ].flat();
                        const suggestion = flatSuggestions[currentSuggestionIndex];
                        const isCurrent = 0 === resultTabIndex;
                        if (isCurrent) window.location.href = isProduction() ? suggestion.link : removeDomain(suggestion.link);
                        else window.open(suggestion.link);
                        clearSearchState();
                    }
                    break;
                case KEY_CODE.ESC:
                    clearSearchState();
                    break;
                default:
                    break;
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return ()=>{
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [
        setCurrentSuggestionIndex,
        setFocused,
        focused,
        resultTabIndex,
        currentSuggestions,
        currentSuggestionIndex
    ]);
    useEffect(()=>{
        if (focused) {
            setSearchResult(DEFAULT_RESULT);
            initSearch();
        } else setQuery('');
    }, [
        focused
    ]);
    useEffect(()=>{
        if ('requestIdleCallback' in window && !pageSearcherRef.current) window.requestIdleCallback(()=>{
            const searcher = createSearcher();
            searcher.fetchSearchIndex();
        });
    }, []);
    useEffect(()=>{
        const { currentLang, currentVersion } = pageSearcherConfigRef.current ?? {};
        const isLangChanged = lang !== currentLang;
        const isVersionChanged = versionedSearch && version !== currentVersion;
        if (isLangChanged || isVersionChanged) {
            setInitStatus('initial');
            pageSearcherRef.current = null;
            const searcher = createSearcher();
            searcher.fetchSearchIndex();
        }
    }, [
        lang,
        version,
        versionedSearch
    ]);
    const handleQueryChangedImpl = async (value)=>{
        let newQuery = value;
        setQuery(newQuery);
        if (search && 'remote' === search.mode && search.searchLoading) setIsSearching(true);
        if (newQuery) {
            const searchResult = [];
            if ('beforeSearch' in __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__) {
                const key = 'beforeSearch';
                const transformedQuery = await __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__[key](newQuery);
                if (transformedQuery) newQuery = transformedQuery;
            }
            const defaultSearchResult = await pageSearcherRef.current?.match(newQuery);
            if (defaultSearchResult) searchResult.push(...defaultSearchResult);
            if ('onSearch' in __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__) {
                const key = 'onSearch';
                const customSearchResult = await __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__[key](newQuery, searchResult);
                if (customSearchResult) searchResult.push(...customSearchResult.map((item)=>({
                        renderType: RenderType.Custom,
                        ...item
                    })));
            }
            if ('afterSearch' in __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__) {
                const key = 'afterSearch';
                await __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__[key](newQuery, searchResult);
            }
            const currQuery = searchInputRef.current?.value;
            if (currQuery === newQuery) {
                setSearchResult(searchResult || DEFAULT_RESULT);
                setIsSearching(false);
            }
        }
    };
    const handleQueryChange = useDebounce(handleQueryChangedImpl);
    const normalizeSuggestions = (suggestions)=>suggestions.reduce((groups, item)=>{
            const group = item.title;
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
            return groups;
        }, {});
    const renderSearchResult = (result, searchOptions, isSearching)=>{
        if (1 === result.length) {
            const currentSearchResult = result[0].result;
            if (0 === currentSearchResult.length && !isSearching) return /*#__PURE__*/ jsx(NoSearchResult, {
                query: query
            });
            return /*#__PURE__*/ jsx("div", {
                ref: searchResultTabRef,
                children: renderSearchResultItem(currentSearchResult, query, isSearching)
            });
        }
        const tabValues = result.map((item)=>{
            if (!searchOptions || 'remote' !== searchOptions.mode) return item.group;
            const indexItem = normalizeSearchIndexes(searchOptions.searchIndexes || []).find((indexInfo)=>indexInfo.value === item.group);
            return indexItem.label;
        });
        const renderKey = 'render';
        return /*#__PURE__*/ jsx(Tabs, {
            values: tabValues,
            tabContainerClassName: tabClassName,
            onChange: (index)=>{
                setResultTabIndex(index);
                setCurrentSuggestionIndex(0);
            },
            ref: searchResultTabRef,
            children: result.map((item)=>/*#__PURE__*/ jsxs(Tab, {
                    children: [
                        item.renderType === RenderType.Default && renderSearchResultItem(item.result, query, isSearching),
                        item.renderType === RenderType.Custom && __WEBPACK_EXTERNAL_MODULE_virtual_search_hooks_9d01d01f__[renderKey](item.result)
                    ]
                }, item.group))
        });
    };
    const renderSearchResultItem = (suggestionList, query, isSearching)=>{
        if (isSearching) return /*#__PURE__*/ jsx("div", {
            className: "rp-flex rp-flex-col rp-items-center",
            children: /*#__PURE__*/ jsx(SvgWrapper, {
                icon: loading,
                className: "m-8 opacity-80"
            })
        });
        if (0 === suggestionList.length && 'inited' === initStatus) return /*#__PURE__*/ jsx(NoSearchResult, {
            query: query
        });
        const normalizedSuggestions = normalizeSuggestions(suggestionList);
        let accumulateIndex = -1;
        return /*#__PURE__*/ jsx("ul", {
            children: Object.keys(normalizedSuggestions).map((group)=>{
                const groupSuggestions = normalizedSuggestions[group] || [];
                return /*#__PURE__*/ jsx("li", {
                    children: /*#__PURE__*/ jsx("ul", {
                        className: "rp-pb-2",
                        children: groupSuggestions.map((suggestion)=>{
                            accumulateIndex++;
                            const suggestionIndex = accumulateIndex;
                            return /*#__PURE__*/ jsx(SuggestItem, {
                                suggestion: suggestion,
                                isCurrent: suggestionIndex === currentSuggestionIndex,
                                setCurrentSuggestionIndex: (event)=>{
                                    if (mousePositionRef.current.pageX === event.pageX && mousePositionRef.current.pageY === event.pageY) return;
                                    setCanScroll(false);
                                    setCurrentSuggestionIndex(suggestionIndex);
                                },
                                onMouseMove: (event)=>{
                                    mousePositionRef.current = {
                                        pageX: event.pageX,
                                        pageY: event.pageY
                                    };
                                },
                                closeSearch: ()=>{
                                    clearSearchState();
                                },
                                inCurrentDocIndex: 0 === resultTabIndex,
                                scrollTo: scrollTo
                            }, `${suggestion.title}-${suggestionIndex}`);
                        })
                    })
                }, group);
            })
        });
    };
    return /*#__PURE__*/ jsx(Fragment, {
        children: focused && createPortal(/*#__PURE__*/ jsx("div", {
            className: mask,
            onClick: ()=>{
                clearSearchState();
            },
            children: /*#__PURE__*/ jsxs("div", {
                className: `${modal}`,
                onClick: (e)=>{
                    setFocused(true);
                    e.stopPropagation();
                },
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "rp-flex rp-items-center",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                className: inputForm,
                                children: [
                                    /*#__PURE__*/ jsx("label", {
                                        children: /*#__PURE__*/ jsx(SvgWrapper, {
                                            icon: _theme_assets_search
                                        })
                                    }),
                                    /*#__PURE__*/ jsx("input", {
                                        className: `rspress-search-panel-input ${input}`,
                                        ref: searchInputRef,
                                        placeholder: searchPlaceholderText,
                                        "aria-label": "SearchPanelInput",
                                        autoComplete: "off",
                                        autoFocus: true,
                                        onChange: (e)=>handleQueryChange(e.target.value)
                                    }),
                                    /*#__PURE__*/ jsx("label", {
                                        children: /*#__PURE__*/ jsx(SvgWrapper, {
                                            icon: _theme_assets_close,
                                            className: external_index_module_js_close,
                                            onClick: (e)=>{
                                                if (searchInputRef.current) {
                                                    e.stopPropagation();
                                                    if (query) {
                                                        searchInputRef.current.value = '';
                                                        setQuery('');
                                                    } else clearSearchState();
                                                }
                                            }
                                        })
                                    })
                                ]
                            }),
                            /*#__PURE__*/ jsx("h2", {
                                className: "rp-text-brand rp-ml-2 sm:rp-hidden rp-cursor-pointer",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    clearSearchState();
                                },
                                children: "Cancel"
                            })
                        ]
                    }),
                    query && 'inited' === initStatus ? /*#__PURE__*/ jsx("div", {
                        className: `${searchHits}  rspress-scrollbar`,
                        ref: searchResultRef,
                        children: renderSearchResult(searchResult, search, isSearching)
                    }) : null
                ]
            })
        }), document.getElementById('search-container'))
    });
}
export { SearchPanel };
