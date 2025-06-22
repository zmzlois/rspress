import { jsx, jsxs } from "react/jsx-runtime";
import { usePageData } from "@rspress/runtime";
import { HomeFeature, HomeFooter, HomeHero } from "@theme";
function HomeLayout(props) {
    const { beforeHero, afterHero, beforeFeatures, afterFeatures, beforeHeroActions, afterHeroActions } = props;
    const { page: { frontmatter, routePath } } = usePageData();
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-relative",
        style: {
            minHeight: 'calc(100vh - var(--rp-nav-height))',
            paddingBottom: '80px'
        },
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "rp-pb-12",
                children: [
                    beforeHero,
                    /*#__PURE__*/ jsx(HomeHero, {
                        frontmatter: frontmatter,
                        routePath: routePath,
                        beforeHeroActions: beforeHeroActions,
                        afterHeroActions: afterHeroActions
                    }),
                    afterHero,
                    beforeFeatures,
                    /*#__PURE__*/ jsx(HomeFeature, {
                        frontmatter: frontmatter,
                        routePath: routePath
                    }),
                    afterFeatures
                ]
            }),
            /*#__PURE__*/ jsx(HomeFooter, {})
        ]
    });
}
export { HomeLayout };
