import node_path, { dirname } from "node:path";
import { resolve } from "node:url";
import { getIconUrlPath } from "@rspress/shared/node-utils";
import { Feed } from "feed";
import { promises } from "node:fs";
function notNullish(n) {
    return null != n;
}
function concatArray(...arrList) {
    return arrList.reduce((arr, item)=>arr.concat((Array.isArray(item) ? item : [
            item
        ]).filter(notNullish)), []);
}
function selectNonNullishProperty(...list) {
    for (const item of list){
        if ('' === item) return '';
        if (0 === item) return '0';
        if ('number' == typeof item) return `${item}`;
        if ('string' == typeof item) return item;
    }
}
function toDate(s) {
    const d = new Date(s);
    return Number.isNaN(d.getDate()) ? null : d;
}
function sortByDate(l, r) {
    return (r ? r.getTime() : 0) - (l ? l.getTime() : 0);
}
async function writeFile(path, content) {
    const dir = dirname(path);
    await promises.mkdir(dir, {
        mode: 493,
        recursive: true
    });
    return promises.writeFile(path, content);
}
function generateFeedItem(page, siteUrl) {
    const { frontmatter: fm } = page;
    return {
        id: selectNonNullishProperty(fm.slug, fm.id, page.routePath) || '',
        title: selectNonNullishProperty(fm.title, page.title) || '',
        author: toAuthors(fm.author),
        link: resolve(siteUrl, selectNonNullishProperty(fm.permalink, page.routePath) || ''),
        description: selectNonNullishProperty(fm.description) || '',
        content: selectNonNullishProperty(fm.summary, page._html) || '',
        date: toDate(fm.date || fm.published_at),
        category: concatArray(fm.categories, fm.category).map((cat)=>({
                name: cat
            }))
    };
}
function createFeed(options, config) {
    const { output, item, id, title, ..._options } = options;
    return {
        id,
        copyright: config.themeConfig?.footer?.message || '',
        description: config.description || '',
        link: output.url,
        ..._options,
        title: title || config.title || ''
    };
}
function toAuthors(author) {
    const authors = (Array.isArray(author) ? author : [
        author
    ]).filter(Boolean).map((author)=>({
            ...'string' == typeof author ? {
                name: author
            } : author
        }));
    return authors.length ? authors : void 0;
}
const PluginName = '@rspress/plugin-rss';
const PluginComponents = {
    FeedsAnnotations: '@rspress/plugin-rss/FeedsAnnotations'
};
function testPage(test, page, base = '/') {
    if (Array.isArray(test)) return test.some((item)=>testPage(item, page, base));
    if ('function' == typeof test) return test(page, base);
    const routePath = page.routePath;
    const pureRoutePath = `/${routePath.startsWith(base) ? routePath.slice(base.length) : routePath}`.replace(/^\/+/, '/');
    if ('string' == typeof test) return [
        routePath,
        pureRoutePath
    ].some((path)=>path.startsWith(test));
    if (test instanceof RegExp) return [
        routePath,
        pureRoutePath
    ].some((path)=>test.test(path));
    throw new Error('test must be of `RegExp` or `string` or `(page: PageIndexInfo, base: string) => boolean`');
}
function getDefaultFeedOption() {
    return {
        id: 'blog',
        test: '/blog/'
    };
}
function getFeedFileType(type) {
    switch(type){
        case 'rss':
            return {
                extension: 'rss',
                mime: 'application/rss+xml',
                getContent: (feed)=>feed.rss2()
            };
        case 'json':
            return {
                extension: 'json',
                mime: 'application/json',
                getContent: (feed)=>feed.json1()
            };
        case 'atom':
        default:
            return {
                extension: 'xml',
                mime: 'application/atom+xml',
                getContent: (feed)=>feed.atom1()
            };
    }
}
function getOutputInfo({ id, output }, { siteUrl, output: globalOutput }) {
    const type = output?.type || globalOutput?.type || 'atom';
    const { extension, mime, getContent } = getFeedFileType(type);
    const filename = output?.filename || `${id}.${extension}`;
    const dir = output?.dir || globalOutput?.dir || 'rss';
    const publicPath = output?.publicPath || globalOutput?.publicPath || siteUrl;
    const url = [
        publicPath,
        `${dir}/`,
        filename
    ].reduce((u, part)=>u ? resolve(u, part) : part);
    const sorting = output?.sorting || globalOutput?.sorting || ((l, r)=>sortByDate(l.date, r.date));
    return {
        type,
        mime,
        filename,
        getContent,
        dir,
        publicPath,
        url,
        sorting
    };
}
class FeedsSet {
    feeds = [];
    feedsMapById = Object.create(null);
    set({ feed, output, siteUrl }, config) {
        this.feeds = (Array.isArray(feed) ? feed : [
            {
                ...getDefaultFeedOption(),
                ...feed
            }
        ]).map((options)=>({
                title: config.title || '',
                description: config.description || '',
                favicon: config.icon && resolve(siteUrl, getIconUrlPath(config.icon)),
                copyright: config.themeConfig?.footer?.message || '',
                link: siteUrl,
                docs: '',
                ...options,
                output: getOutputInfo(options, {
                    siteUrl,
                    output
                })
            }));
        this.feedsMapById = this.feeds.reduce((m, f)=>({
                ...m,
                [f.id]: f
            }), Object.create(null));
    }
    get(id) {
        if (id) return this.feedsMapById[id] || null;
        return this.feeds.slice(0);
    }
}
function getRssItems(feeds, page, config, siteUrl) {
    return Promise.all(feeds.filter((options)=>testPage(options.test, page, config.base)).map(async (options)=>{
        const after = options.item || ((feed)=>feed);
        const item = await after(generateFeedItem(page, siteUrl), page, siteUrl);
        return {
            ...item,
            channel: options.id
        };
    }));
}
function pluginRss(pluginRssOptions) {
    const feedsSet = new FeedsSet();
    let _rssWorkaround = null;
    let _config;
    return {
        name: PluginName,
        globalUIComponents: Object.values(PluginComponents),
        beforeBuild (config, isProd) {
            if (!isProd) {
                _rssWorkaround = null;
                return;
            }
            _rssWorkaround = {};
            _config = config;
            feedsSet.set(pluginRssOptions, config);
        },
        async extendPageData (pageData) {
            if (!_rssWorkaround) return;
            _rssWorkaround[pageData.routePath] = _rssWorkaround[pageData.routePath] || getRssItems(feedsSet.get(), pageData, _config, pluginRssOptions.siteUrl);
            const feeds = await _rssWorkaround[pageData.routePath];
            const showRssList = new Set(concatArray(pageData.frontmatter['link-rss']));
            for (const feed of feeds)showRssList.add(feed.channel);
            pageData.feeds = Array.from(showRssList, (id)=>{
                const { output, language } = feedsSet.get(id);
                return {
                    url: output.url,
                    mime: output.mime,
                    language: language || pageData.lang
                };
            });
        },
        async afterBuild (config) {
            if (!_rssWorkaround) return;
            const items = concatArray(...await Promise.all(Object.values(_rssWorkaround)));
            const feeds = Object.create(null);
            for (const { channel, ...item } of items){
                feeds[channel] = feeds[channel] || new Feed(createFeed(feedsSet.get(channel), config));
                feeds[channel].addItem(item);
            }
            for (const [channel, feed] of Object.entries(feeds)){
                const { output } = feedsSet.get(channel);
                feed.items.sort(output.sorting);
                const path = node_path.resolve(config.outDir || 'doc_build', output.dir, output.filename);
                await writeFile(path, output.getContent(feed));
            }
            _rssWorkaround = null;
            _config = null;
        }
    };
}
export { PluginComponents, PluginName, createFeed, generateFeedItem, getDefaultFeedOption, getFeedFileType, getOutputInfo, pluginRss, testPage };
