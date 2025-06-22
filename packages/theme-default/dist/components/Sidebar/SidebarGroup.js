import { jsx, jsxs } from "react/jsx-runtime";
import { createElement, useEffect, useRef } from "react";
import { normalizeHrefInRuntime, useNavigate, withBase } from "@rspress/runtime";
import { Tag } from "@theme";
import arrow_right from "@theme-assets/arrow-right";
import { highlightTitleStyle } from "./index.js";
import { renderInlineMarkdown } from "../../logic/utils.js";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { SidebarDivider } from "./SidebarDivider.js";
import { SidebarItem } from "./SidebarItem.js";
import { collapseContainer, menuItem, menuItemActive } from "./index.module.js";
import { isSidebarDivider, preloadLink } from "./utils.js";
function SidebarGroup(props) {
    const { item, depth = 0, activeMatcher, id, setSidebarData } = props;
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const transitionRef = useRef(null);
    const innerRef = useRef(null);
    const initialRender = useRef(true);
    const initialState = useRef('collapsed' in item && item.collapsed);
    const active = item.link && activeMatcher(item.link);
    const { collapsed, collapsible = true } = item;
    const collapsibleIcon = /*#__PURE__*/ jsx("div", {
        style: {
            cursor: 'pointer',
            transition: 'transform 0.2s ease-out',
            transform: collapsed ? 'rotate(0deg)' : 'rotate(90deg)'
        },
        children: /*#__PURE__*/ jsx(SvgWrapper, {
            icon: arrow_right
        })
    });
    useEffect(()=>{
        if (initialRender.current) return;
        if (!containerRef.current || !innerRef.current) return;
        if (transitionRef.current) clearTimeout(transitionRef.current);
        const container = containerRef.current;
        const inner = innerRef.current;
        const contentHeight = inner.clientHeight + 4;
        if (collapsed) {
            container.style.maxHeight = `${contentHeight}px`;
            container.style.transitionDuration = '0.5s';
            inner.style.opacity = '0';
            transitionRef.current = window.setTimeout(()=>{
                if (containerRef.current) containerRef.current.style.maxHeight = '0px';
            }, 0);
        } else {
            container.style.maxHeight = `${contentHeight}px`;
            container.style.transitionDuration = '0.3s';
            inner.style.opacity = '1';
            transitionRef.current = window.setTimeout(()=>{
                if (containerRef.current) containerRef.current.style.removeProperty('max-height');
            }, 300);
        }
    }, [
        collapsed
    ]);
    useEffect(()=>{
        initialRender.current = false;
    }, []);
    const toggleCollapse = (e)=>{
        e.stopPropagation();
        setSidebarData((sidebarData)=>{
            const newSidebarData = [
                ...sidebarData
            ];
            const indexes = id.split('-').map(Number);
            const initialIndex = indexes.shift();
            const root = newSidebarData[initialIndex];
            let current = root;
            for (const index of indexes)current = current.items[index];
            if ('items' in current) current.collapsed = !current.collapsed;
            return newSidebarData;
        });
    };
    return /*#__PURE__*/ jsxs("section", {
        className: "rspress-sidebar-section rp-mt-0.5 rp-block",
        "data-context": item.context,
        style: {
            marginLeft: 0 === depth ? 0 : '18px'
        },
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: `rspress-sidebar-collapse rp-flex rp-justify-between rp-items-center ${active ? menuItemActive : menuItem}`,
                "data-context": item.context,
                onMouseEnter: ()=>item.link && preloadLink(item.link),
                onClick: (e)=>{
                    if (item.link) navigate(withBase(normalizeHrefInRuntime(item.link)));
                    collapsible && toggleCollapse(e);
                },
                style: {
                    borderRadius: 0 === depth ? '0 var(--rp-radius) var(--rp-radius) 0' : void 0,
                    cursor: collapsible || item.link ? 'pointer' : 'normal'
                },
                children: [
                    /*#__PURE__*/ jsxs("h2", {
                        className: "rp-py-2 rp-px-3 rp-text-sm rp-font-medium rp-flex",
                        style: {
                            ...0 === depth ? highlightTitleStyle : {}
                        },
                        children: [
                            /*#__PURE__*/ jsx(Tag, {
                                tag: item.tag
                            }),
                            /*#__PURE__*/ jsx("span", {
                                className: "rp-flex rp-items-center rp-justify-center",
                                style: {
                                    fontSize: 0 === depth ? '14px' : '13px'
                                },
                                ...renderInlineMarkdown(item.text)
                            })
                        ]
                    }),
                    collapsible && /*#__PURE__*/ jsx("div", {
                        className: `${collapseContainer} rp-p-2 rp-rounded-xl`,
                        onClick: toggleCollapse,
                        children: collapsibleIcon
                    })
                ]
            }),
            /*#__PURE__*/ jsx("div", {
                ref: containerRef,
                className: "rp-transition-all rp-duration-300 rp-ease-in-out",
                style: {
                    overflow: 'hidden',
                    maxHeight: initialState.current ? 0 : void 0
                },
                children: /*#__PURE__*/ jsx("div", {
                    ref: innerRef,
                    className: "rspress-sidebar-group rp-transition-opacity rp-duration-500 rp-ease-in-out",
                    style: {
                        opacity: initialState.current ? 0 : 1,
                        marginLeft: 0 === depth ? '12px' : 0
                    },
                    children: item?.items?.map((item, index)=>isSidebarDivider(item) ? /*#__PURE__*/ jsx(SidebarDivider, {
                            depth: depth + 1,
                            dividerType: item.dividerType
                        }, index) : /*#__PURE__*/ createElement(SidebarItem, {
                            ...props,
                            key: index,
                            item: item,
                            depth: depth + 1,
                            id: `${id}-${index}`
                        }))
                })
            })
        ]
    }, id);
}
export { SidebarGroup };
