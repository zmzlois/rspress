function buildQueryString(params) {
    return Object.entries(params).map((pair)=>pair.map(encodeURIComponent).join('=')).join('&');
}
class RemoteProvider {
    #options;
    async init(options) {
        this.#options = options;
    }
    async fetchSearchIndex(_options) {
        return [];
    }
    async search(query) {
        const { apiUrl, searchIndexes } = this.#options;
        const { keyword, limit } = query;
        const urlParams = buildQueryString({
            keyword,
            limit: limit.toString(),
            searchIndexes: searchIndexes?.map((indexInfo)=>'string' == typeof indexInfo ? indexInfo : indexInfo.value).join(',') || '',
            lang: this.#options?.currentLang ?? ''
        });
        try {
            const result = await fetch(`${apiUrl}?${urlParams}`);
            return result.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}
export { RemoteProvider };
