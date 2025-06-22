import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { isValidElement, useRef } from "react";
import { CodeButtonGroup, useCodeButtonGroup } from "./code/CodeButtonGroup.js";
function ShikiPre({ child, containerElementClassName, preElementRef, title, className, codeButtonGroupProps, ...otherProps }) {
    const { codeWrap, toggleCodeWrap } = useCodeButtonGroup();
    return /*#__PURE__*/ jsxs("div", {
        className: containerElementClassName,
        children: [
            title && /*#__PURE__*/ jsx("div", {
                className: "rspress-code-title",
                children: title
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "rspress-code-content rspress-scrollbar",
                children: [
                    /*#__PURE__*/ jsx("div", {
                        children: /*#__PURE__*/ jsx("pre", {
                            ref: preElementRef,
                            className: [
                                codeWrap ? 'rp-force-wrap' : '',
                                className
                            ].filter(Boolean).join(' '),
                            ...otherProps,
                            children: child
                        })
                    }),
                    /*#__PURE__*/ jsx(CodeButtonGroup, {
                        ...codeButtonGroupProps,
                        preElementRef: preElementRef,
                        codeWrap: codeWrap,
                        toggleCodeWrap: toggleCodeWrap
                    })
                ]
            })
        ]
    });
}
function PreWithCodeButtonGroup({ containerElementClassName, children, className, title, codeButtonGroupProps, ...otherProps }) {
    const preElementRef = useRef(null);
    const renderChild = (child)=>{
        const { className: codeElementClassName } = child.props;
        return /*#__PURE__*/ jsx(ShikiPre, {
            ...otherProps,
            child: child,
            className: className,
            title: title,
            preElementRef: preElementRef,
            codeButtonGroupProps: codeButtonGroupProps,
            containerElementClassName: containerElementClassName ?? codeElementClassName
        });
    };
    if (Array.isArray(children)) return /*#__PURE__*/ jsx(Fragment, {
        children: children.map((child)=>renderChild(child))
    });
    if (!/*#__PURE__*/ isValidElement(children)) return null;
    return renderChild(children);
}
export { PreWithCodeButtonGroup };
