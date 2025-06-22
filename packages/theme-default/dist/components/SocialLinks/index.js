import { jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import { HiddenLinks } from "./HiddenLinks.js";
import { ShownLinks } from "./ShownLinks.js";
import { menuItem } from "./index.module.js";
const MORE_LENGTH = 5;
const SocialLinks = ({ socialLinks })=>{
    const isMore = socialLinks.length > MORE_LENGTH;
    const shownLinks = socialLinks.slice(0, MORE_LENGTH);
    const hiddenLinks = socialLinks.slice(MORE_LENGTH);
    const [hiddenLinksVisible, setHiddenLinksVisible] = useState(false);
    const hide = useCallback(()=>{
        setHiddenLinksVisible(false);
    }, [
        setHiddenLinksVisible
    ]);
    const show = useCallback(()=>{
        setHiddenLinksVisible(true);
    }, [
        setHiddenLinksVisible
    ]);
    return /*#__PURE__*/ jsxs("div", {
        className: `social-links ${menuItem} rp-flex rp-items-center rp-justify-center rp-relative`,
        onMouseLeave: hide,
        children: [
            /*#__PURE__*/ jsx(ShownLinks, {
                links: shownLinks,
                moreIconVisible: isMore,
                mouseEnter: show
            }),
            hiddenLinksVisible ? /*#__PURE__*/ jsx(HiddenLinks, {
                links: hiddenLinks
            }) : null
        ]
    });
};
export { SocialLinks };
