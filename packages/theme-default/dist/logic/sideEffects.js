import { inBrowser } from "@rspress/shared";
import { throttle } from "lodash-es";
import { useEffect } from "react";
import { useUISwitch } from "./useUISwitch.js";
function getTargetTop(element, scrollPaddingTop) {
    const targetPadding = Number.parseInt(window.getComputedStyle(element).paddingTop, 10);
    const targetTop = window.scrollY + element.getBoundingClientRect().top - scrollPaddingTop - targetPadding;
    return Math.round(targetTop);
}
function scrollToTarget(target, isSmooth, scrollPaddingTop) {
    window.scrollTo({
        left: 0,
        top: getTargetTop(target, scrollPaddingTop),
        ...isSmooth ? {
            behavior: 'smooth'
        } : {}
    });
}
function scrollTo(el, hash, isSmooth = false, scrollPaddingTop) {
    let target = null;
    try {
        target = el.classList.contains('header-anchor') ? el : document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (e) {
        console.warn(e);
    }
    if (target) scrollToTarget(target, isSmooth, scrollPaddingTop);
}
function useBindingWindowScroll() {
    const { scrollPaddingTop } = useUISwitch();
    useEffect(()=>{
        window.addEventListener('click', (e)=>{
            const link = e.target.closest('a');
            if (!link) return;
            const { origin, hash, target, pathname, search } = link;
            const currentUrl = window.location;
            if (hash && '_blank' !== target && origin === currentUrl.origin) if (pathname === currentUrl.pathname && search === currentUrl.search && hash && link.classList.contains('header-anchor')) {
                e.preventDefault();
                history.pushState(null, '', hash);
                scrollTo(link, hash, true, scrollPaddingTop);
                window.dispatchEvent(new Event('hashchange'));
            } else window.addEventListener('RspressReloadContent', ()=>{
                if (location.hash.length > 1) {
                    const ele = document.getElementById(location.hash.slice(1));
                    scrollToTarget(ele, false, scrollPaddingTop);
                }
            });
        }, {
            capture: true
        });
        window.addEventListener('hashchange', (e)=>{
            e.preventDefault();
        });
    }, [
        scrollPaddingTop
    ]);
}
function useBindingAsideScroll(headers) {
    const { scrollPaddingTop } = useUISwitch();
    function isBottom() {
        return document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;
    }
    useEffect(()=>{
        const aside = document.getElementById('aside-container');
        const links = Array.from(document.querySelectorAll('.rspress-doc .header-anchor')).filter((item)=>item.parentElement?.tagName !== 'H1');
        if (!aside || !links.length || !headers.length) return;
        let prevActiveLink = null;
        const activate = (links, index)=>{
            if (links[index]) {
                const id = links[index].getAttribute('href');
                const currentLink = aside?.querySelector(`a[href="#${id?.slice(1)}"]`);
                if (currentLink) {
                    if (prevActiveLink) prevActiveLink.classList.remove('aside-active');
                    prevActiveLink = currentLink;
                    prevActiveLink.classList.add('aside-active');
                }
            }
        };
        const setActiveLink = ()=>{
            if (isBottom()) activate(links, links.length - 1);
            else for(let i = 0; i < links.length; i++){
                const currentAnchor = links[i];
                const nextAnchor = links[i + 1];
                const scrollTop = Math.ceil(window.scrollY);
                const currentAnchorTop = getTargetTop(currentAnchor.parentElement, scrollPaddingTop);
                if (0 === i && scrollTop < currentAnchorTop || 0 === scrollTop) {
                    activate(links, 0);
                    break;
                }
                if (!nextAnchor) {
                    activate(links, i);
                    break;
                }
                const nextAnchorTop = getTargetTop(nextAnchor.parentElement, scrollPaddingTop);
                if (scrollTop >= currentAnchorTop && scrollTop < nextAnchorTop) {
                    activate(links, i);
                    break;
                }
            }
        };
        const throttledSetLink = throttle(setActiveLink, 100);
        window.addEventListener('scroll', throttledSetLink);
        setActiveLink();
        return ()=>{
            if (prevActiveLink) prevActiveLink.classList.remove('aside-active');
            window.removeEventListener('scroll', throttledSetLink);
        };
    }, [
        scrollPaddingTop,
        headers.length
    ]);
}
function useSetup() {
    if (!inBrowser()) return;
    useBindingWindowScroll();
}
export { scrollToTarget, useBindingAsideScroll, useBindingWindowScroll, useSetup };
