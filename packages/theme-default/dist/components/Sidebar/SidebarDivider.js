import { jsx } from "react/jsx-runtime";
function SidebarDivider(props) {
    const { depth, dividerType } = props;
    const borderTypeStyle = 'dashed' === dividerType ? 'rp-border-dashed' : 'rp-border-solid';
    return /*#__PURE__*/ jsx("div", {
        className: `${borderTypeStyle} rp-border-t rp-border-divider-light rp-my-3`,
        style: {
            marginLeft: 0 === depth ? 0 : '18px'
        }
    });
}
export { SidebarDivider };
