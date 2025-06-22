import { APPEARANCE_KEY } from "@rspress/shared";
import { useCallback, useEffect, useState } from "react";
import virtual_site_data from "virtual-site-data";
import { useHandler } from "./useHandler.js";
import { useMediaQuery } from "./useMediaQuery.js";
import { useStorageValue } from "./useStorageValue.js";
const sanitize = (value)=>[
        'light',
        'dark',
        'auto'
    ].includes(value) ? value : 'auto';
const disableDarkMode = false === virtual_site_data.themeConfig.darkMode;
const useThemeState = ()=>{
    const matchesDark = useMediaQuery('(prefers-color-scheme: dark)');
    const [storedTheme, setStoredTheme] = useStorageValue(APPEARANCE_KEY, 'auto');
    const getPreferredTheme = useHandler(()=>{
        if (disableDarkMode) return 'light';
        const sanitized = sanitize(storedTheme);
        return 'auto' === sanitized ? matchesDark ? 'dark' : 'light' : sanitized;
    });
    const [theme, setThemeInternal] = useState(()=>{
        if ('undefined' == typeof window) return 'light';
        const defaultTheme = window.RSPRESS_THEME ?? window.MODERN_THEME;
        if (defaultTheme) return 'dark' === defaultTheme ? 'dark' : 'light';
        return getPreferredTheme();
    });
    const setTheme = useCallback((value, storeValue = value)=>{
        if (disableDarkMode) return;
        setThemeInternal(value);
        setStoredTheme(storeValue);
        setSkipEffect(true);
    }, []);
    useEffect(()=>{
        document.documentElement.classList.toggle('dark', 'dark' === theme);
        document.documentElement.classList.toggle('rp-dark', 'dark' === theme);
        document.documentElement.style.colorScheme = theme;
    }, [
        theme
    ]);
    const [skipEffect, setSkipEffect] = useState(true);
    useEffect(()=>{
        setSkipEffect(false);
    }, [
        skipEffect
    ]);
    useEffect(()=>{
        if (skipEffect) return;
        setTheme(getPreferredTheme(), sanitize(storedTheme));
    }, [
        storedTheme
    ]);
    useEffect(()=>{
        if (skipEffect) return;
        setTheme(matchesDark ? 'dark' : 'light', 'auto');
    }, [
        matchesDark
    ]);
    return [
        theme,
        setTheme
    ];
};
export { useThemeState };
