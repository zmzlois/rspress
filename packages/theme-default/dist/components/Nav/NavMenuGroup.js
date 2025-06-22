import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { matchNavbar } from "@rspress/shared";
import { Link, Tag } from "@theme";
import down from "@theme-assets/down";
import { useRef, useState } from "react";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { NavMenuSingleItem } from "./NavMenuSingleItem.js";
function ActiveGroupItem({ item }) {
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-rounded-2xl rp-my-1 rp-flex",
        style: {
            padding: '0.4rem 1.5rem 0.4rem 0.75rem'
        },
        children: [
            item.tag && /*#__PURE__*/ jsx(Tag, {
                tag: item.tag
            }),
            /*#__PURE__*/ jsx("span", {
                className: "rp-text-brand",
                children: item.text
            })
        ]
    }, item.link);
}
function NormalGroupItem({ item }) {
    return /*#__PURE__*/ jsx("div", {
        className: "rp-font-medium rp-my-1",
        children: /*#__PURE__*/ jsx(Link, {
            href: item.link,
            children: /*#__PURE__*/ jsx("div", {
                className: "rp-rounded-2xl hover:rp-bg-mute",
                style: {
                    padding: '0.4rem 1.5rem 0.4rem 0.75rem'
                },
                children: /*#__PURE__*/ jsxs("div", {
                    className: "rp-flex",
                    children: [
                        item.tag && /*#__PURE__*/ jsx(Tag, {
                            tag: item.tag
                        }),
                        /*#__PURE__*/ jsx("span", {
                            children: item.text
                        })
                    ]
                })
            })
        })
    }, item.link);
}
function NavMenuGroup(item) {
    const { activeValue, items: groupItems, base = '', link = '', pathname = '' } = item;
    const [isOpen, setIsOpen] = useState(false);
    const closeTimerRef = useRef(null);
    const clearCloseTimer = ()=>{
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };
    const handleMouseLeave = ()=>{
        closeTimerRef.current = window.setTimeout(()=>{
            setIsOpen(false);
        }, 150);
    };
    const handleMouseEnter = ()=>{
        clearCloseTimer();
        setIsOpen(true);
    };
    const renderLinkItem = (item)=>{
        const isLinkActive = matchNavbar(item, pathname, base);
        if (activeValue === item.text || !activeValue && isLinkActive) return /*#__PURE__*/ jsx(ActiveGroupItem, {
            item: item
        }, item.link);
        return /*#__PURE__*/ jsx(NormalGroupItem, {
            item: item
        }, item.link);
    };
    const renderGroup = (item)=>/*#__PURE__*/ jsxs("div", {
            children: [
                'link' in item ? renderLinkItem(item) : /*#__PURE__*/ jsx("p", {
                    className: "rp-font-bold rp-text-gray-400 rp-my-1 not:first:rp-border",
                    children: item.text
                }),
                item.items.map(renderLinkItem)
            ]
        });
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-relative rp-flex rp-items-center rp-justify-center rp-h-14",
        onMouseLeave: handleMouseLeave,
        children: [
            /*#__PURE__*/ jsx("div", {
                onMouseEnter: handleMouseEnter,
                className: "rspress-nav-menu-group-button rp-flex rp-justify-center rp-items-center rp-font-medium rp-text-sm rp-text-text-1 hover:rp-text-text-2 rp-transition-colors rp-duration-200 rp-cursor-pointer",
                children: link ? /*#__PURE__*/ jsx(NavMenuSingleItem, {
                    ...item,
                    rightIcon: /*#__PURE__*/ jsx(SvgWrapper, {
                        icon: down
                    })
                }) : /*#__PURE__*/ jsxs(Fragment, {
                    children: [
                        /*#__PURE__*/ jsxs("span", {
                            className: "rp-text-sm rp-font-medium rp-flex",
                            style: {
                                marginRight: '2px'
                            },
                            children: [
                                /*#__PURE__*/ jsx(Tag, {
                                    tag: item.tag
                                }),
                                item.text
                            ]
                        }),
                        /*#__PURE__*/ jsx(SvgWrapper, {
                            icon: down
                        })
                    ]
                })
            }),
            /*#__PURE__*/ jsx("div", {
                className: "rspress-nav-menu-group-content rp-absolute rp-mx-0.8 rp-transition-opacity rp-duration-300",
                style: {
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    right: 0,
                    top: '52px'
                },
                onMouseEnter: clearCloseTimer,
                children: /*#__PURE__*/ jsx("div", {
                    className: "rp-p-3 rp-pr-2 rp-w-full rp-h-full rp-max-h-100vh rp-whitespace-nowrap",
                    style: {
                        boxShadow: 'var(--rp-shadow-3)',
                        zIndex: 100,
                        border: '1px solid var(--rp-c-divider-light)',
                        borderRadius: 'var(--rp-radius-large)',
                        background: 'var(--rp-c-bg)'
                    },
                    children: groupItems.map((item)=>/*#__PURE__*/ jsx("div", {
                            children: 'items' in item ? renderGroup(item) : renderLinkItem(item)
                        }, item.text))
                })
            })
        ]
    });
}
export { NavMenuGroup };
