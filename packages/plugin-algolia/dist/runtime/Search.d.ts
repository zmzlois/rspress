import type { DocSearchProps } from '@docsearch/react';
import '@docsearch/css';
import './Search.css';
import type { Locales } from './locales.js';
type SearchProps = {
    /**
     * @link https://docsearch.algolia.com/docs/api
     */
    docSearchProps: DocSearchProps;
    locales?: Locales;
};
declare function Search({ locales, docSearchProps }: SearchProps): import("react/jsx-runtime").JSX.Element;
export { Search };
export type { SearchProps };
