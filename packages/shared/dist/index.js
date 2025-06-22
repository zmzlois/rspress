const QUERY_REGEXP = /\?.*$/s;
const HASH_REGEXP = /#.*$/s;
const MDX_OR_MD_REGEXP = /\.mdx?$/;
const APPEARANCE_KEY = 'rspress-theme-appearance';
const SEARCH_INDEX_NAME = 'search_index';
const RSPRESS_TEMP_DIR = '.rspress';
const DEFAULT_HIGHLIGHT_LANGUAGES = [
    [
        'js',
        "javascript"
    ],
    [
        'ts',
        "typescript"
    ],
    [
        'jsx',
        'tsx'
    ],
    [
        'xml',
        'xml-doc'
    ],
    [
        'md',
        'markdown'
    ],
    [
        'mdx',
        'tsx'
    ]
];
const isSCM = ()=>Boolean(process.env.BUILD_VERSION);
const isProduction = ()=>'production' === process.env.NODE_ENV;
const isDebugMode = ()=>{
    if (!process.env.DEBUG) return false;
    const values = process.env.DEBUG?.toLocaleLowerCase().split(',') ?? [];
    return [
        'rsbuild',
        'builder',
        '*'
    ].some((key)=>values.includes(key));
};
const isDevDebugMode = ()=>'rspress-dev' === process.env.DEBUG;
const utils_cleanUrl = (url)=>url.replace(HASH_REGEXP, '').replace(QUERY_REGEXP, '');
function slash(str) {
    return str.replace(/\\/g, '/');
}
function removeHash(str) {
    return str.replace(/#.*$/, '');
}
function normalizePosixPath(id) {
    const path = slash(id);
    const isAbsolutePath = path.startsWith('/');
    const parts = path.split('/');
    const normalizedParts = [];
    for (const part of parts)if ('.' === part || '' === part) ;
    else if ('..' === part) {
        if (normalizedParts.length > 0 && '..' !== normalizedParts[normalizedParts.length - 1]) normalizedParts.pop();
        else if (isAbsolutePath) normalizedParts.push('..');
    } else normalizedParts.push(part);
    let normalizedPath = normalizedParts.join('/');
    if (isAbsolutePath) normalizedPath = `/${normalizedPath}`;
    return normalizedPath;
}
const inBrowser = ()=>!process.env.__SSR__;
function addLeadingSlash(url) {
    return '/' === url.charAt(0) || isExternalUrl(url) ? url : `/${url}`;
}
function removeLeadingSlash(url) {
    return '/' === url.charAt(0) ? url.slice(1) : url;
}
function addTrailingSlash(url) {
    return '/' === url.charAt(url.length - 1) ? url : `${url}/`;
}
function removeTrailingSlash(url) {
    return '/' === url.charAt(url.length - 1) ? url.slice(0, -1) : url;
}
function normalizeSlash(url) {
    return removeTrailingSlash(addLeadingSlash(normalizePosixPath(url)));
}
function isExternalUrl(url = '') {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('tel:');
}
function isDataUrl(url = '') {
    return /^\s*data:/i.test(url);
}
function replaceLang(rawUrl, lang, version, base = '', cleanUrls = false, isPageNotFound = false) {
    let url = removeBase(rawUrl, base);
    if (!url || isPageNotFound) url = cleanUrls ? '/index' : '/index.html';
    if (url.endsWith('/')) url += cleanUrls ? '/index' : '/index.html';
    let versionPart = '';
    let langPart = '';
    let purePathPart = '';
    const parts = url.split('/').filter(Boolean);
    if (version.current && version.current !== version.default) versionPart = parts.shift() || '';
    if (lang.target !== lang.default) {
        langPart = lang.target;
        if (lang.current !== lang.default) parts.shift();
    } else parts.shift();
    purePathPart = parts.join('/') || '';
    if ((versionPart || langPart) && !purePathPart) purePathPart = cleanUrls ? 'index' : 'index.html';
    return withBase(addLeadingSlash([
        versionPart,
        langPart,
        purePathPart
    ].filter(Boolean).join('/')), base);
}
function replaceVersion(rawUrl, version, base = '', cleanUrls = false, isPageNotFound = false) {
    let url = removeBase(rawUrl, base);
    if (!url || isPageNotFound) url = cleanUrls ? '/index' : '/index.html';
    let versionPart = '';
    const parts = url.split('/').filter(Boolean);
    if (version.target !== version.default) {
        versionPart = version.target;
        if (version.current !== version.default) parts.shift();
    } else parts.shift();
    let restPart = parts.join('/') || '';
    if (versionPart && !restPart) restPart = cleanUrls ? 'index' : 'index.html';
    return withBase(addLeadingSlash([
        versionPart,
        restPart
    ].filter(Boolean).join('/')), base);
}
const parseUrl = (url)=>{
    const [withoutHash, hash = ''] = url.split('#');
    return {
        url: withoutHash,
        hash
    };
};
function normalizeHref(url, cleanUrls = false) {
    if (!url) return '/';
    if (isExternalUrl(url)) return url;
    if (url.startsWith('#')) return url;
    let { url: cleanUrl, hash } = parseUrl(decodeURIComponent(url));
    if (cleanUrls) {
        if (cleanUrl.endsWith('.html')) cleanUrl = cleanUrl.replace(/\.html$/, '');
        if (cleanUrls && cleanUrl.endsWith('/index')) cleanUrl = cleanUrl.replace(/\/index$/, '/');
    } else if (!cleanUrl.endsWith('.html')) if (cleanUrl.endsWith('/')) cleanUrl += 'index.html';
    else cleanUrl += '.html';
    return addLeadingSlash(hash ? `${cleanUrl}#${hash}` : cleanUrl);
}
function withoutLang(path, langs) {
    const langRegexp = new RegExp(`^\\/(${langs.join('|')})`);
    return addLeadingSlash(path.replace(langRegexp, ''));
}
function withoutBase(path, base) {
    return addLeadingSlash(path).replace(normalizeSlash(base), '');
}
function withBase(url, base) {
    const normalizedUrl = addLeadingSlash(url);
    const normalizedBase = normalizeSlash(base);
    return normalizedUrl.startsWith(normalizedBase) ? normalizedUrl : `${normalizedBase}${normalizedUrl}`;
}
function removeBase(url, base) {
    return addLeadingSlash(url).replace(new RegExp(`^${normalizeSlash(base)}`), '');
}
const matchSidebar = (pattern, currentPathname, base)=>{
    const prefix = withBase(pattern, base);
    if (prefix === currentPathname) return true;
    const prefixWithTrailingSlash = addTrailingSlash(prefix);
    if (currentPathname.startsWith(prefixWithTrailingSlash)) return true;
    const prefixWithDot = `${prefix}.`;
    return currentPathname.startsWith(prefixWithDot);
};
const getSidebarDataGroup = (sidebar, currentPathname, base)=>{
    const navRoutes = Object.keys(sidebar).sort((a, b)=>b.length - a.length);
    for (const name of navRoutes)if (matchSidebar(name, currentPathname, base)) {
        const sidebarGroup = sidebar[name];
        return sidebarGroup;
    }
    return [];
};
const matchNavbar = (item, currentPathname, base)=>new RegExp(item.activeMatch || item.link).test(withoutBase(currentPathname, base));
export { APPEARANCE_KEY, DEFAULT_HIGHLIGHT_LANGUAGES, HASH_REGEXP, MDX_OR_MD_REGEXP, QUERY_REGEXP, RSPRESS_TEMP_DIR, SEARCH_INDEX_NAME, addLeadingSlash, addTrailingSlash, utils_cleanUrl as cleanUrl, getSidebarDataGroup, inBrowser, isDataUrl, isDebugMode, isDevDebugMode, isExternalUrl, isProduction, isSCM, matchNavbar, matchSidebar, normalizeHref, normalizePosixPath, normalizeSlash, parseUrl, removeBase, removeHash, removeLeadingSlash, removeTrailingSlash, replaceLang, replaceVersion, slash, withBase, withoutBase, withoutLang };
