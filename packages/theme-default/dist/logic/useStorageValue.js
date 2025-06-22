import { useCallback, useEffect, useState } from "react";
const useStorageValue = (key, defaultValue)=>{
    const [value, setValueInternal] = useState(()=>{
        if ('undefined' == typeof window) return defaultValue;
        return localStorage.getItem(key) ?? defaultValue;
    });
    const setValue = useCallback((value)=>{
        setValueInternal((prev)=>{
            const next = 'function' == typeof value ? value(prev) : value;
            if (null == next) localStorage.removeItem(key);
            else localStorage.setItem(key, next);
            return next;
        });
    }, [
        key
    ]);
    useEffect(()=>{
        const listener = (e)=>{
            if (e.key === key) setValueInternal(localStorage.getItem(key) ?? defaultValue);
        };
        window.addEventListener('storage', listener);
        return ()=>{
            window.removeEventListener('storage', listener);
        };
    }, [
        key,
        defaultValue
    ]);
    return [
        value,
        setValue
    ];
};
export { useStorageValue };
