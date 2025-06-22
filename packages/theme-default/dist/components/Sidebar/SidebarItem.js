import { jsx, jsxs } from "react/jsx-runtime";
import { normalizeHrefInRuntime } from "@rspress/runtime";
import { Link, Tag } from "@theme";
import { useEffect, useRef } from "react";
import { highlightTitleStyle } from "./index.js";
import { renderInlineMarkdown } from "../../logic/utils.js";
import { SidebarGroup } from "./SidebarGroup.js";
import { menuItem, menuItemActive, menuLink } from "./index.module.js";
function SidebarItem(props) {
    const { item, depth = 0, activeMatcher, id, setSidebarData } = props;
    const active = 'link' in item && item.link && activeMatcher(item.link);
    const ref = useRef(null);
    useEffect(()=>{
        if (active) ref.current?.scrollIntoView({
            block: 'center'
        });
    }, []);
    if ('items' in item) return /*#__PURE__*/ jsx(SidebarGroup, {
        id: id,
        activeMatcher: activeMatcher,
        item: item,
        depth: depth,
        collapsed: item.collapsed,
        setSidebarData: setSidebarData
    }, `${item.text}-${id}`);
    return /*#__PURE__*/ jsx(LinkContextContainer, {
        context: item.context,
        className: props.contextContainerClassName,
        children: /*#__PURE__*/ jsx(Link, {
            href: normalizeHrefInRuntime(item.link),
            className: menuLink,
            children: /*#__PURE__*/ jsxs("div", {
                ref: ref,
                className: `${active ? `${menuItemActive} rspress-sidebar-item-active` : menuItem} rp-mt-0.5 rp-py-2 rp-px-3 rp-font-medium rp-flex`,
                style: {
                    fontSize: 0 === depth ? '14px' : '13px',
                    marginLeft: 0 === depth ? 0 : '18px',
                    borderRadius: '0 var(--rp-radius) var(--rp-radius) 0',
                    ...0 === depth ? highlightTitleStyle : {}
                },
                children: [
                    /*#__PURE__*/ jsx(Tag, {
                        tag: item.tag
                    }),
                    /*#__PURE__*/ jsx("span", {
                        ...renderInlineMarkdown(item.text)
                    })
                ]
            })
        })
    });
}
function LinkContextContainer(props) {
    return /*#__PURE__*/ jsx("div", {
        className: [
            'rspress-sidebar-item',
            props.className
        ].filter(Boolean).join(' '),
        ...props.context ? {
            'data-context': props.context
        } : {},
        children: props.children
    });
}
export { SidebarItem };
