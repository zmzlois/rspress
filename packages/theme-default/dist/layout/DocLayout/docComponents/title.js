import { jsx } from "react/jsx-runtime";
import { title } from "./index.module.js";
const H1 = (props)=>/*#__PURE__*/ jsx("h1", {
        ...props,
        className: `rspress-doc-title rp-text-3xl rp-mb-10 rp-leading-10 rp-tracking-tight ${title}`
    });
const H2 = (props)=>/*#__PURE__*/ jsx("h2", {
        ...props,
        className: `rspress-doc-outline rp-mt-12 rp-mb-6 rp-pt-8 rp-text-2xl rp-tracking-tight rp-border-t rp-border-divider-light ${title}`
    });
const H3 = (props)=>/*#__PURE__*/ jsx("h3", {
        ...props,
        className: `rspress-doc-outline rp-mt-10 rp-mb-2 rp-leading-7 rp-text-xl ${title}`
    });
const H4 = (props)=>/*#__PURE__*/ jsx("h4", {
        ...props,
        className: `rspress-doc-outline rp-mt-8 rp-leading-6 rp-text-lg ${title}`
    });
const H5 = (props)=>/*#__PURE__*/ jsx("h5", {
        ...props,
        className: `rspress-doc-outline ${title}`
    });
const H6 = (props)=>/*#__PURE__*/ jsx("h6", {
        ...props,
        className: `rspress-doc-outline ${title}`
    });
export { H1, H2, H3, H4, H5, H6 };
