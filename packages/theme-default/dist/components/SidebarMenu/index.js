import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useLocation } from "@rspress/runtime";
import arrow_right from "@theme-assets/arrow-right";
import menu from "@theme-assets/menu";
import { useCallback, useEffect, useRef, useState } from "react";
import { SvgWrapper } from "../SvgWrapper/index.js";
import { Toc } from "../Toc/index.js";
import "./index.css";
import { useDynamicToc } from "../Aside/useDynamicToc.js";
function SidebarMenu({ isSidebarOpen, onIsSidebarOpenChange, outlineTitle, uiSwitch }) {
    const tocContainerRef = useRef(null);
    const outlineButtonRef = useRef(null);
    const [isTocOpen, setIsTocOpen] = useState(false);
    const { pathname } = useLocation();
    function openSidebar() {
        onIsSidebarOpenChange(true);
    }
    function closeSidebar() {
        onIsSidebarOpenChange(false);
    }
    useEffect(()=>{
        onIsSidebarOpenChange(false);
    }, [
        pathname
    ]);
    useEffect(()=>{
        document.addEventListener('mouseup', handleClickOutsideForToc);
        document.addEventListener('touchend', handleClickOutsideForToc);
        return ()=>{
            document.addEventListener('mouseup', handleClickOutsideForToc);
            document.removeEventListener('touchend', handleClickOutsideForToc);
        };
    }, []);
    const handleClickOutsideForToc = useCallback((e)=>{
        const { current: outlineButton } = outlineButtonRef;
        if (outlineButton?.contains(e.target)) return;
        const { current: tocContainer } = tocContainerRef;
        if (tocContainer && !tocContainer.contains(e.target)) setIsTocOpen(false);
    }, []);
    const toggleTocItem = useCallback(()=>{
        setIsTocOpen(false);
    }, []);
    const toc = useDynamicToc();
    const hasToc = toc.length > 0;
    return /*#__PURE__*/ jsx("div", {
        className: `rspress-sidebar-menu-container ${hasToc ? '' : 'no-toc'}`,
        children: /*#__PURE__*/ jsxs("div", {
            className: "rspress-sidebar-menu",
            children: [
                uiSwitch?.showSidebar && /*#__PURE__*/ jsxs(Fragment, {
                    children: [
                        /*#__PURE__*/ jsxs("button", {
                            type: "button",
                            onClick: openSidebar,
                            className: "rp-flex rp-items-center rp-justify-center rp-mr-auto",
                            children: [
                                /*#__PURE__*/ jsx("div", {
                                    className: "rp-text-md rp-mr-2",
                                    children: /*#__PURE__*/ jsx(SvgWrapper, {
                                        icon: menu
                                    })
                                }),
                                /*#__PURE__*/ jsx("span", {
                                    className: "rp-text-sm",
                                    children: "Menu"
                                })
                            ]
                        }),
                        isSidebarOpen && /*#__PURE__*/ jsx("div", {
                            onClick: closeSidebar,
                            className: "rspress-sidebar-back-drop",
                            style: {
                                background: 'rgba(0, 0, 0, 0.6)'
                            }
                        })
                    ]
                }),
                uiSwitch?.showAside && hasToc && /*#__PURE__*/ jsxs(Fragment, {
                    children: [
                        /*#__PURE__*/ jsxs("button", {
                            type: "button",
                            onClick: ()=>setIsTocOpen((tocOpened)=>!tocOpened),
                            className: "rp-flex rp-items-center rp-justify-center rp-ml-auto",
                            ref: outlineButtonRef,
                            children: [
                                /*#__PURE__*/ jsx("span", {
                                    className: "rp-text-sm",
                                    children: outlineTitle
                                }),
                                /*#__PURE__*/ jsx("div", {
                                    className: "rp-text-md rp-mr-2",
                                    style: {
                                        transform: isTocOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.2s ease-out',
                                        marginTop: '2px'
                                    },
                                    children: /*#__PURE__*/ jsx(SvgWrapper, {
                                        icon: arrow_right
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ jsx("div", {
                            className: `rspress-local-toc-container ${isTocOpen ? 'rspress-local-toc-container-show' : ''}`,
                            children: /*#__PURE__*/ jsx(Toc, {
                                onItemClick: toggleTocItem
                            })
                        })
                    ]
                })
            ]
        })
    });
}
export { SidebarMenu };
