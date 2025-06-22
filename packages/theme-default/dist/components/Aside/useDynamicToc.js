import { useCallback, useEffect, useState } from "react";
import { processTitleElement } from "./processTitleElement.js";
const updateFns = {};
const useForceUpdate = ()=>{
    const [, setTick] = useState(0);
    return ()=>setTick((tick)=>tick + 1);
};
const distributeUpdate = ()=>{
    for (const fn of Object.values(updateFns))fn();
};
const useSubScribe = ()=>{
    const forceUpdate = useForceUpdate();
    useEffect(()=>{
        const id = Math.random().toString(36).slice(2);
        updateFns[id] = forceUpdate;
        return ()=>{
            delete updateFns[id];
        };
    }, [
        forceUpdate
    ]);
};
const headers = [];
function isElementOnlyVisible(element) {
    const style = window.getComputedStyle(element);
    return 'none' !== style.display && '0' !== style.opacity && 'hidden' !== style.visibility;
}
function isElementVisible(element) {
    let currentElement = element;
    const rootElement = document.querySelector('.rspress-doc');
    while(currentElement)if (!isElementOnlyVisible(currentElement)) return false;
    else {
        currentElement = currentElement.parentElement;
        if (currentElement === rootElement) break;
    }
    return true;
}
const useDynamicToc = ()=>{
    useSubScribe();
    return headers;
};
function updateHeaders(target) {
    const collectedHeaders = [];
    const elements = target?.querySelectorAll('.rspress-doc h2.rspress-doc-outline, h3.rspress-doc-outline, h4.rspress-doc-outline');
    elements?.forEach((el)=>{
        if (!el.closest('.rspress-toc-exclude') && isElementVisible(el)) collectedHeaders.push({
            id: el.id,
            text: processTitleElement(el).innerHTML,
            depth: Number.parseInt(el.tagName[1]),
            charIndex: 0
        });
    });
    headers.length = 0;
    headers.push(...collectedHeaders);
    distributeUpdate();
}
const useWatchToc = ()=>{
    const [innerRef, setRef] = useState(null);
    useEffect(()=>{
        let observer = null;
        const target = innerRef;
        if (target) updateHeaders(target);
        if (target && !observer) {
            observer = new MutationObserver((mutationList)=>{
                let needUpdate = false;
                for (const mutation of mutationList){
                    mutation.addedNodes.forEach((node)=>{
                        if ('tagName' in node && [
                            'H2',
                            'H3',
                            'H4'
                        ].includes(node.tagName)) needUpdate = true;
                        node.childNodes.forEach((child)=>{
                            if ('tagName' in child && [
                                'H2',
                                'H3',
                                'H4'
                            ].includes(child?.tagName)) needUpdate = true;
                        });
                    });
                    mutation.removedNodes.forEach((node)=>{
                        if ('tagName' in node && [
                            'H2',
                            'H3',
                            'H4'
                        ].includes(node.tagName)) needUpdate = true;
                        node.childNodes.forEach((child)=>{
                            if ('tagName' in child && [
                                'H2',
                                'H3',
                                'H4'
                            ].includes(child?.tagName)) needUpdate = true;
                        });
                    });
                }
                needUpdate && updateHeaders(target);
            });
            observer.observe(target, {
                childList: true,
                subtree: true
            });
        }
        return ()=>{
            observer?.disconnect();
            observer = null;
        };
    }, [
        innerRef
    ]);
    const ref = useCallback((ref)=>{
        setRef(ref);
    }, [
        setRef
    ]);
    return ref;
};
export { useDynamicToc, useWatchToc };
