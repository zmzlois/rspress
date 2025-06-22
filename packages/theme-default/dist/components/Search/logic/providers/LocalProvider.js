import { SEARCH_INDEX_NAME, removeTrailingSlash } from "@rspress/shared";
import flexsearch from "flexsearch";
import virtual_search_index_hash from "virtual-search-index-hash";
import { LOCAL_INDEX } from "../Provider.js";
import { normalizeTextCase } from "../util.js";
const cjkRegex = /[\u3131-\u314e|\u314f-\u3163|\uac00-\ud7a3]|[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|[\u3041-\u3096]|[\u30A1-\u30FA]/giu;
const cyrillicRegex = /[\u0400-\u04FF]/g;
function tokenize(str, regex) {
    const words = [];
    let m = null;
    do {
        m = regex.exec(str);
        if (m) words.push(m[0]);
    }while (m);
    return words;
}
class LocalProvider {
    #index;
    #cjkIndex;
    #cyrillicIndex;
    #fetchPromise;
    async #getPages(lang, version) {
        const searchIndexGroupID = `${version ?? ''}###${lang ?? ''}`;
        if (!virtual_search_index_hash[searchIndexGroupID]) return [];
        const searchIndexVersion = version ? `.${version.replace('.', '_')}` : '';
        const searchIndexLang = lang ? `.${lang}` : '';
        const searchIndexURL = `${removeTrailingSlash(__webpack_public_path__)}/static/${SEARCH_INDEX_NAME}${searchIndexVersion}${searchIndexLang}.${virtual_search_index_hash[searchIndexGroupID]}.json`;
        const handleError = (result)=>{
            console.error('Failed to fetch search index, please reload the page and try again.');
            console.error(result);
        };
        try {
            const result = await fetch(searchIndexURL);
            if (result.ok) return result.json();
            handleError(result);
        } catch (error) {
            handleError(error);
        }
        return [];
    }
    async fetchSearchIndex(options) {
        if (this.#fetchPromise) return this.#fetchPromise;
        const { currentLang, currentVersion } = options;
        const versioned = 'remote' !== options.mode && options.versioned;
        this.#fetchPromise = this.#getPages(currentLang, versioned ? currentVersion : '');
        return this.#fetchPromise;
    }
    async init(options) {
        const pagesForSearch = (await this.fetchSearchIndex(options)).map((page)=>({
                ...page,
                normalizedContent: normalizeTextCase(page.content),
                headers: page.toc.map((header)=>normalizeTextCase(header.text)).join(' '),
                normalizedTitle: normalizeTextCase(page.title)
            }));
        const createOptions = {
            tokenize: 'full',
            document: {
                id: 'id',
                store: true,
                index: [
                    'normalizedTitle',
                    'headers',
                    'normalizedContent'
                ]
            },
            cache: 100
        };
        this.#index = new flexsearch.Document(createOptions);
        this.#cjkIndex = new flexsearch.Document({
            ...createOptions,
            tokenize: (str)=>tokenize(str, cjkRegex)
        });
        this.#cyrillicIndex = new flexsearch.Document({
            ...createOptions,
            tokenize: (str)=>tokenize(str, cyrillicRegex)
        });
        for (const item of pagesForSearch){
            this.#index.addAsync(item.routePath, item);
            this.#cjkIndex.addAsync(item.routePath, item);
            this.#cyrillicIndex.addAsync(item.routePath, item);
        }
    }
    async search(query) {
        const { keyword, limit } = query;
        const options = {
            enrich: true,
            limit,
            index: [
                'normalizedTitle',
                'headers',
                'normalizedContent'
            ]
        };
        const searchResult = await Promise.all([
            this.#index?.searchAsync(keyword, options),
            this.#cjkIndex?.searchAsync(keyword, options),
            this.#cyrillicIndex?.searchAsync(keyword, options)
        ]);
        const combinedSearchResult = [];
        const pushedId = new Set();
        function insertCombinedSearchResult(resultFromOneSearchIndex) {
            for (const item of resultFromOneSearchIndex)item.result.forEach((resultItem)=>{
                const id = resultItem.id;
                if (pushedId.has(id)) return;
                pushedId.add(id);
                combinedSearchResult.push(resultItem.doc);
            });
        }
        searchResult.forEach((searchResultItem)=>{
            searchResultItem && insertCombinedSearchResult(searchResultItem);
        });
        return [
            {
                index: LOCAL_INDEX,
                hits: combinedSearchResult
            }
        ];
    }
}
export { LocalProvider };
