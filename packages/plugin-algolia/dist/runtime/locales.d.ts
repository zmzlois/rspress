import type { DocSearchProps } from '@docsearch/react';
export type Locales = Record<string, {
    translations: DocSearchProps['translations'];
    placeholder: string;
}>;
export declare const ZH_LOCALES: Locales;
