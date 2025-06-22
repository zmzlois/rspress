import { jsx, jsxs } from "react/jsx-runtime";
import { normalizeHrefInRuntime, normalizeImagePath } from "@rspress/runtime";
import { isExternalUrl, withBase } from "@rspress/shared";
import { Button } from "@theme";
import { renderHtmlOrText } from "../../logic/utils.js";
import { clip, mask } from "./index.module.js";
const DEFAULT_HERO = {
    name: '',
    text: '',
    tagline: '',
    actions: [],
    image: void 0
};
function HomeHero({ beforeHeroActions, afterHeroActions, frontmatter, routePath }) {
    const hero = frontmatter?.hero || DEFAULT_HERO;
    const hasImage = void 0 !== hero.image;
    const textMaxWidth = hasImage ? 'sm:max-w-xl' : 'sm:max-w-4xl';
    const multiHeroText = hero.text ? hero.text.toString().split(/\n/g).filter((text)=>'' !== text) : [];
    const imageSrc = 'string' == typeof hero.image?.src ? {
        light: hero.image.src,
        dark: hero.image.src
    } : hero.image?.src || {
        light: '',
        dark: ''
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "rp-m-auto rp-pt-0 rp-px-6 rp-pb-12 sm:rp-pt-10 sm:rp-px-16 md:rp-pt-16 md:rp-px-16 md:rp-pb-16 rp-relative",
        children: [
            /*#__PURE__*/ jsx("div", {
                className: mask,
                style: {
                    left: hasImage ? '75%' : '50%'
                }
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "rp-m-auto rp-flex rp-flex-col md:rp-flex-row rp-max-w-6xl rp-min-h-[50vh] rp-mt-12 sm:rp-mt-0",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "rp-flex rp-flex-col rp-justify-center rp-items-center rp-text-center rp-max-w-xl sm:rp-max-w-4xl rp-m-auto rp-order-2 md:rp-order-1",
                        children: [
                            /*#__PURE__*/ jsx("h1", {
                                className: "rp-font-bold rp-text-3xl rp-pb-2 sm:rp-text-6xl md:rp-text-7xl rp-m-auto sm:rp-m-4 md:rp-m-0 md:rp-pb-3 lg:rp-pb-2 rp-leading-tight rp-z-10",
                                children: /*#__PURE__*/ jsx("span", {
                                    className: clip,
                                    style: {
                                        lineHeight: '1.3'
                                    },
                                    ...renderHtmlOrText(hero.name)
                                })
                            }),
                            0 !== multiHeroText.length && multiHeroText.map((heroText)=>/*#__PURE__*/ jsx("p", {
                                    className: `rspress-home-hero-text rp-mx-auto md:rp-m-0 rp-text-3xl sm:rp-text-5xl md:rp-text-6xl sm:rp-pb-2 rp-font-bold rp-z-10 ${textMaxWidth}`,
                                    style: {
                                        lineHeight: '1.2'
                                    },
                                    ...renderHtmlOrText(heroText)
                                }, heroText)),
                            /*#__PURE__*/ jsx("p", {
                                className: `rspress-home-hero-tagline rp-whitespace-pre-wrap rp-pt-4 rp-m-auto md:rp-m-0 rp-text-sm sm:rp-tex-xl md:rp-text-[1.5rem] rp-text-text-2 rp-font-medium rp-z-10 ${textMaxWidth}`,
                                ...renderHtmlOrText(hero.tagline)
                            }),
                            beforeHeroActions,
                            hero.actions?.length ? /*#__PURE__*/ jsx("div", {
                                className: "rp-grid md:rp-flex md:rp-flex-wrap md:rp-justify-center rp-gap-3 rp-pt-6 sm:rp-pt-8 rp-z-10",
                                children: hero.actions.map((action)=>{
                                    const link = isExternalUrl(action.link) ? action.link : normalizeHrefInRuntime(withBase(action.link, routePath));
                                    return /*#__PURE__*/ jsx("div", {
                                        className: "rp-flex rp-flex-shrink-0 rp-p-1",
                                        children: /*#__PURE__*/ jsx(Button, {
                                            type: "a",
                                            href: link,
                                            theme: action.theme,
                                            className: "rp-w-full",
                                            ...renderHtmlOrText(action.text)
                                        })
                                    }, link);
                                })
                            }) : null,
                            afterHeroActions
                        ]
                    }),
                    hasImage ? /*#__PURE__*/ jsxs("div", {
                        className: "rspress-home-hero-image md:rp-flex md:rp-items-center md:rp-justify-center rp-m-auto rp-order-1 md:rp-order-2 sm:rp-flex md:rp-none lg:rp-flex",
                        children: [
                            /*#__PURE__*/ jsx("img", {
                                src: normalizeImagePath(imageSrc.light),
                                alt: hero.image?.alt,
                                srcSet: normalizeSrcsetAndSizes(hero.image?.srcset),
                                sizes: normalizeSrcsetAndSizes(hero.image?.sizes),
                                width: 375,
                                height: 375,
                                className: "dark:rp-hidden"
                            }),
                            /*#__PURE__*/ jsx("img", {
                                src: normalizeImagePath(imageSrc.dark),
                                alt: hero.image?.alt,
                                srcSet: normalizeSrcsetAndSizes(hero.image?.srcset),
                                sizes: normalizeSrcsetAndSizes(hero.image?.sizes),
                                width: 375,
                                height: 375,
                                className: "rp-hidden dark:rp-block"
                            })
                        ]
                    }) : null
                ]
            })
        ]
    });
}
function normalizeSrcsetAndSizes(field) {
    const r = (Array.isArray(field) ? field : [
        field
    ]).filter(Boolean).join(', ');
    return r || void 0;
}
export { HomeHero };
