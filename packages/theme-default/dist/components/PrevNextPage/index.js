import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@theme";
import { useLocaleSiteData } from "../../logic/useLocaleSiteData.js";
import { desc, next, pagerLink, title } from "./index.module.js";
function PrevNextPage(props) {
    const { type, text, href } = props;
    const { prevPageText = 'Previous Page', nextPageText = 'Next Page' } = useLocaleSiteData();
    const pageText = 'prev' === type ? prevPageText : nextPageText;
    const linkClassName = 'prev' === type ? pagerLink : `${pagerLink} ${next}`;
    return /*#__PURE__*/ jsxs(Link, {
        href: href,
        className: linkClassName,
        children: [
            /*#__PURE__*/ jsx("span", {
                className: desc,
                children: pageText
            }),
            /*#__PURE__*/ jsx("span", {
                className: title,
                children: text
            })
        ]
    });
}
export { PrevNextPage };
