import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@theme";
import down from "@theme-assets/down";
import { useState } from "react";
import { button as external_index_module_js_button, buttonSpan, down as external_index_module_js_down, items, navScreenMenuGroup, open as external_index_module_js_open } from "./index.module.js";
function NavScreenMenuGroup(item) {
    const { activeValue } = item;
    const [isOpen, setIsOpen] = useState(false);
    function ActiveGroupItem({ item }) {
        return /*#__PURE__*/ jsx("div", {
            className: "rp-p-1 rp-text-center",
            children: /*#__PURE__*/ jsx("span", {
                className: "rp-text-brand",
                children: item.text
            })
        });
    }
    function NormalGroupItem({ item }) {
        return /*#__PURE__*/ jsx("div", {
            className: "rp-py-1 rp-font-medium",
            children: /*#__PURE__*/ jsx(Link, {
                href: item.link,
                children: /*#__PURE__*/ jsx("div", {
                    children: /*#__PURE__*/ jsx("div", {
                        className: "rp-flex rp-justify-center",
                        children: /*#__PURE__*/ jsx("span", {
                            children: item.text
                        })
                    })
                })
            })
        });
    }
    const renderLinkItem = (item)=>{
        if (activeValue === item.text) return /*#__PURE__*/ jsx(ActiveGroupItem, {
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
        className: `${isOpen ? external_index_module_js_open : ''} ${navScreenMenuGroup} rp-relative`,
        children: [
            /*#__PURE__*/ jsxs("button", {
                className: external_index_module_js_button,
                onClick: ()=>{
                    setIsOpen(!isOpen);
                },
                children: [
                    /*#__PURE__*/ jsx("span", {
                        className: buttonSpan,
                        children: item.text
                    }),
                    /*#__PURE__*/ jsx(down, {
                        className: `${isOpen ? external_index_module_js_open : ''} ${external_index_module_js_down} `
                    })
                ]
            }),
            /*#__PURE__*/ jsx("div", {
                children: /*#__PURE__*/ jsx("div", {
                    className: items,
                    children: item.items.map((item)=>/*#__PURE__*/ jsx("div", {
                            children: 'items' in item ? renderGroup(item) : renderLinkItem(item)
                        }, item.text))
                })
            })
        ]
    });
}
export { NavScreenMenuGroup };
