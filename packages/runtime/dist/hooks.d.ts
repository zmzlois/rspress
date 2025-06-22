import type { PageData } from '@rspress/shared';
import { type ReactNode } from 'react';
declare global {
    interface Window {
        __MODERN_PAGE_DATA__: any;
    }
}
interface IDataContext {
    data: PageData;
    setData?: (data: PageData) => void;
}
interface IThemeContext {
    theme: 'light' | 'dark';
    setTheme?: (theme: 'light' | 'dark') => void;
}
export declare const DataContext: import("react").Context<IDataContext>;
export declare const ThemeContext: import("react").Context<IThemeContext>;
export declare function usePageData(): PageData;
export declare function useLang(): string;
export declare function useVersion(): string;
export declare function useDark(): boolean;
export declare function useI18n<T = Record<string, Record<string, string>>>(): (key: keyof T) => any;
export declare function useViewTransition(dom: ReactNode): string | number | bigint | boolean | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | import("react").ReactPortal | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
export declare function useWindowSize(initialWidth?: number, initialHeight?: number): {
    width: number;
    height: number;
};
export {};
