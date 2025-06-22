import { useLocation, useVersion } from "@rspress/runtime";
import { useEffect, useState } from "react";
import { useLocaleSiteData } from "./useLocaleSiteData.js";
function useNavScreen() {
    const { pathname } = useLocation();
    const [isScreenOpen, setIsScreenOpen] = useState(false);
    function openScreen() {
        setIsScreenOpen(true);
        window.addEventListener('resize', closeScreenOnTabletWindow);
    }
    function closeScreen() {
        setIsScreenOpen(false);
        window.removeEventListener('resize', closeScreenOnTabletWindow);
    }
    function toggleScreen() {
        if (isScreenOpen) closeScreen();
        else openScreen();
    }
    useEffect(()=>{
        closeScreen();
    }, [
        pathname
    ]);
    function closeScreenOnTabletWindow() {
        window.outerWidth >= 768 && closeScreen();
    }
    return {
        isScreenOpen,
        openScreen,
        closeScreen,
        toggleScreen
    };
}
function useNavData() {
    const { nav } = useLocaleSiteData();
    const version = useVersion();
    if (Array.isArray(nav)) return nav;
    const navKey = version.length > 0 ? version : 'default';
    return [
        ...nav[navKey]
    ];
}
export { useNavData, useNavScreen };
