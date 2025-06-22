import { jsx, jsxs } from "react/jsx-runtime";
function Card({ content, title, icon, style }) {
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-border rp-border-gray-400 rp-rounded-lg rp-p-6",
        style: style,
        children: [
            /*#__PURE__*/ jsxs("p", {
                className: "rp-flex rp-items-center rp-gap-2 rp-mb-4",
                children: [
                    icon && /*#__PURE__*/ jsx("div", {
                        children: icon
                    }),
                    title && /*#__PURE__*/ jsx("span", {
                        className: "rp-text-2xl rp-font-bold",
                        children: title
                    })
                ]
            }),
            /*#__PURE__*/ jsx("div", {
                className: "rp-text-base rp-overflow-auto",
                children: content
            })
        ]
    });
}
export { Card };
