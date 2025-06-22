import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import virtual_i18n_text from "virtual-i18n-text";
const DataContext = createContext({});
const ThemeContext = createContext({});
function usePageData() {
    const ctx = useContext(DataContext);
    return ctx.data;
}
function useLang() {
    const ctx = useContext(DataContext);
    return ctx.data.page.lang || '';
}
function useVersion() {
    const ctx = useContext(DataContext);
    return ctx.data.page.version || '';
}
function useDark() {
    const ctx = useContext(ThemeContext);
    return 'dark' === ctx.theme;
}
function useI18n() {
    const lang = useLang();
    return useCallback((key)=>virtual_i18n_text[key][lang], [
        lang
    ]);
}
function useViewTransition(dom) {
    const [element, setElement] = useState(dom);
    useLayoutEffect(()=>{
        if (document.startViewTransition && element !== dom) document.startViewTransition(()=>{
            flushSync(()=>{
                setElement(dom);
            });
            window.dispatchEvent(new Event('RspressReloadContent'));
        });
        else {
            flushSync(()=>{
                setElement(dom);
            });
            window.dispatchEvent(new Event('RspressReloadContent'));
        }
    }, [
        dom
    ]);
    return element;
}
function useWindowSize(initialWidth, initialHeight) {
    const [size, setSize] = useState({
        width: initialWidth ?? Number.POSITIVE_INFINITY,
        height: initialHeight ?? Number.POSITIVE_INFINITY
    });
    useLayoutEffect(()=>{
        const handleResize = ()=>{
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return ()=>{
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return size;
}
export { DataContext, ThemeContext, useDark, useI18n, useLang, usePageData, useVersion, useViewTransition, useWindowSize };
