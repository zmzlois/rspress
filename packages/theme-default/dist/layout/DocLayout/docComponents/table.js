import { jsx } from "react/jsx-runtime";
const Table = (props)=>/*#__PURE__*/ jsx("table", {
        ...props,
        className: "rp-block rp-border-collapse rp-text-base rp-my-5 rp-overflow-x-auto rp-leading-7 rp-border-gray-light-3 dark:rp-border-divider"
    });
const Tr = (props)=>/*#__PURE__*/ jsx("tr", {
        ...props,
        className: "rp-border rp-border-solid rp-transition-colors rp-duration-500 even:rp-bg-soft rp-border-gray-light-3 dark:rp-border-divider"
    });
const Td = (props)=>/*#__PURE__*/ jsx("td", {
        ...props,
        className: "rp-border rp-border-solid rp-px-4 rp-py-2 rp-border-gray-light-3 dark:rp-border-divider"
    });
const Th = (props)=>/*#__PURE__*/ jsx("th", {
        ...props,
        className: "rp-border rp-border-solid rp-px-4 rp-py-2 rp-text-text-1 rp-text-base rp-font-semibold rp-border-gray-light-3 dark:rp-border-divider"
    });
export { Table, Td, Th, Tr };
