import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { socialLinksIcon } from "./index.module.js";
const LinkContent = (props)=>{
    const { link, popperStyle = {} } = props;
    const { icon, mode = 'link', content } = link;
    let IconComp = /*#__PURE__*/ jsx(Fragment, {});
    if (icon) {
        const iconMap = process.env.RSPRESS_SOCIAL_ICONS;
        const html = 'string' == typeof icon ? iconMap[icon] : icon.svg;
        IconComp = /*#__PURE__*/ jsx("div", {
            dangerouslySetInnerHTML: {
                __html: html
            }
        });
    }
    const [contentVisible, setContentVisible] = useState(false);
    const mouseEnterIcon = ()=>{
        setContentVisible(true);
    };
    const mouseLeavePopper = ()=>{
        setContentVisible(false);
    };
    if ('link' === mode) return /*#__PURE__*/ jsx("a", {
        href: content,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "social-links",
        children: /*#__PURE__*/ jsx("div", {
            className: `${socialLinksIcon}`,
            children: IconComp
        })
    }, content);
    if ('text' === mode) return /*#__PURE__*/ jsxs("div", {
        className: `${socialLinksIcon} rp-cursor-pointer rp-relative rp-mx-3`,
        onMouseEnter: mouseEnterIcon,
        onMouseLeave: mouseLeavePopper,
        children: [
            IconComp,
            contentVisible ? /*#__PURE__*/ jsx("div", {
                style: {
                    boxShadow: 'var(--rp-shadow-3)',
                    border: '1px solid var(--rp-c-divider-light)',
                    ...popperStyle
                },
                className: "rp-z-[1] rp-p-3 rp-w-50 rp-absolute rp-right-0 rp-bg-white dark:rp-bg-dark",
                children: /*#__PURE__*/ jsx("div", {
                    className: "rp-text-md",
                    children: content
                })
            }) : null
        ]
    });
    if ('img' === mode) return /*#__PURE__*/ jsxs("div", {
        className: `${socialLinksIcon} rp-cursor-pointer rp-relative`,
        onMouseEnter: mouseEnterIcon,
        onMouseLeave: mouseLeavePopper,
        children: [
            IconComp,
            contentVisible ? /*#__PURE__*/ jsx("div", {
                className: "rp-break-all rp-z-[1] rp-p-3 rp-w-[50px] rp-h-[50px] rp-absolute rp-right-0 rp-bg-white dark:rp-bg-dark rp-rounded-xl",
                style: {
                    boxShadow: 'var(--rp-shadow-3)',
                    ...popperStyle
                },
                children: /*#__PURE__*/ jsx("img", {
                    src: content,
                    alt: "img"
                })
            }) : null
        ]
    });
    if ('dom' === mode) return /*#__PURE__*/ jsxs("div", {
        className: `${socialLinksIcon} rp-cursor-pointer rp-relative`,
        onMouseEnter: mouseEnterIcon,
        onMouseLeave: mouseLeavePopper,
        children: [
            IconComp,
            contentVisible ? /*#__PURE__*/ jsx("div", {
                className: "rp-break-all rp-z-[1] rp-p-3 rp-absolute rp-right-0 rp-bg-white dark:rp-bg-dark rp-rounded-xl",
                style: {
                    boxShadow: 'var(--rp-shadow-3)',
                    ...popperStyle
                },
                children: /*#__PURE__*/ jsx("div", {
                    dangerouslySetInnerHTML: {
                        __html: content
                    }
                })
            }) : null
        ]
    });
    return /*#__PURE__*/ jsx("div", {});
};
export { LinkContent };
