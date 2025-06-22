import { jsx, jsxs } from "react/jsx-runtime";
import { Children, forwardRef, isValidElement, useContext, useEffect, useMemo, useState } from "react";
import { TabDataContext } from "../../logic/TabDataContext.js";
import { useStorageValue } from "../../logic/useStorageValue.js";
import { container, noScrollbar, notSelected, selected, tab, tabList } from "./index.module.js";
function isTabItem(item) {
    if (item && 'object' == typeof item && 'label' in item) return true;
    return false;
}
const renderTab = (item)=>{
    if (isTabItem(item)) return item.label || item.value;
    return item;
};
const groupIdPrefix = 'rspress.tabs.';
const Tabs = /*#__PURE__*/ forwardRef((props, ref)=>{
    const { values, defaultValue, onChange, children: rawChildren, groupId, tabPosition = 'left', tabContainerClassName } = props;
    const children = Children.toArray(rawChildren).filter((child)=>!('string' == typeof child && '' === child.trim()));
    let tabValues = values || [];
    if (0 === tabValues.length) tabValues = Children.map(children, (child)=>{
        if (/*#__PURE__*/ isValidElement(child)) return {
            label: child.props?.label || void 0,
            value: child.props?.value || child.props?.label || void 0
        };
        return {
            label: void 0,
            value: void 0
        };
    });
    const { tabData, setTabData } = useContext(TabDataContext);
    const [activeIndex, setActiveIndex] = useState(()=>{
        if (void 0 === defaultValue) return 0;
        return tabValues.findIndex((item)=>{
            if ('string' == typeof item) return item === defaultValue;
            if (item && 'object' == typeof item && 'value' in item) return item.value === defaultValue;
            return false;
        });
    });
    const [storageIndex, setStorageIndex] = useStorageValue(`${groupIdPrefix}${groupId}`, activeIndex.toString());
    const syncIndex = useMemo(()=>{
        if (groupId) {
            if (void 0 !== tabData[groupId]) return tabData[groupId];
            return Number.parseInt(storageIndex);
        }
        return activeIndex;
    }, [
        groupId && tabData[groupId]
    ]);
    useEffect(()=>{
        if (groupId) {
            const correctIndex = Number.parseInt(storageIndex);
            if (syncIndex !== correctIndex) setTabData({
                ...tabData,
                [groupId]: correctIndex
            });
        }
    }, [
        storageIndex
    ]);
    const currentIndex = groupId ? syncIndex : activeIndex;
    return /*#__PURE__*/ jsxs("div", {
        className: container,
        ref: ref,
        children: [
            /*#__PURE__*/ jsx("div", {
                className: tabContainerClassName,
                children: tabValues.length ? /*#__PURE__*/ jsx("div", {
                    className: `${tabList} ${noScrollbar}`,
                    style: {
                        justifyContent: 'center' === tabPosition ? 'center' : 'flex-start'
                    },
                    children: tabValues.map((item, index)=>/*#__PURE__*/ jsx("div", {
                            className: `${tab} ${currentIndex === index ? selected : notSelected}`,
                            onClick: ()=>{
                                onChange?.(index);
                                if (groupId) {
                                    setTabData({
                                        ...tabData,
                                        [groupId]: index
                                    });
                                    setStorageIndex(index.toString());
                                } else setActiveIndex(index);
                            },
                            children: renderTab(item)
                        }, index))
                }) : null
            }),
            /*#__PURE__*/ jsx("div", {
                children: Children.toArray(children)[currentIndex]
            })
        ]
    });
});
function Tab({ children, ...props }) {
    return /*#__PURE__*/ jsx("div", {
        ...props,
        className: "rp-rounded rp-px-2",
        children: children
    });
}
export { Tab, Tabs, groupIdPrefix };
