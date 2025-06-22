import __rslib_shim_module__ from 'module';
/*#__PURE__*/ import.meta.url;
export const __webpack_ids__ = [
    "235"
];
export const __webpack_modules__ = {
    "./src/node/auto-nav-sidebar/index.ts": function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
        __webpack_require__.d(__webpack_exports__, {
            pluginAutoNavSidebar: ()=>pluginAutoNavSidebar
        });
        var external_node_path_ = __webpack_require__("node:path");
        var shared_ = __webpack_require__("@rspress/shared");
        var constants_ = __webpack_require__("@rspress/shared/constants");
        var logger_ = __webpack_require__("@rspress/shared/logger");
        var promises_ = __webpack_require__("node:fs/promises");
        var node_utils_ = __webpack_require__("@rspress/shared/node-utils");
        async function pathExists(path) {
            try {
                await promises_["default"].access(path);
                return true;
            } catch  {
                return false;
            }
        }
        async function readJson(path) {
            const raw = await promises_["default"].readFile(path, 'utf8');
            return JSON.parse(raw);
        }
        async function extractInfoFromFrontmatterWithAbsolutePath(absolutePath, rootDir) {
            const content = await promises_["default"].readFile(absolutePath, 'utf-8');
            const fileNameWithoutExt = external_node_path_["default"].basename(absolutePath, external_node_path_["default"].extname(absolutePath));
            const h1RegExp = /^#\s+(.*)$/m;
            const match = content.match(h1RegExp);
            const { frontmatter } = (0, node_utils_.loadFrontMatter)(content, absolutePath, rootDir);
            return {
                title: (0, node_utils_.extractTextAndId)(frontmatter.title || match?.[1] || fileNameWithoutExt)[0],
                overviewHeaders: frontmatter.overviewHeaders,
                context: frontmatter.context
            };
        }
        function combineWalkResult(walks, versions) {
            return walks.reduce((acc, cur, curIndex)=>({
                    nav: {
                        ...acc.nav,
                        [versions[curIndex] || 'default']: cur.nav
                    },
                    sidebar: {
                        ...acc.sidebar,
                        ...cur.sidebar
                    }
                }), {
                nav: {},
                sidebar: {}
            });
        }
        function getHmrFileKey(realPath, docsDir) {
            return realPath ? (0, shared_.slash)((0, external_node_path_.relative)(docsDir, realPath).replace((0, external_node_path_.extname)(realPath), '')) : '';
        }
        function absolutePathToLink(absolutePath, docsDir, routePrefix) {
            const relativePath = (0, shared_.slash)((0, external_node_path_.relative)(docsDir, absolutePath.replace((0, external_node_path_.extname)(absolutePath), '')));
            return `${routePrefix}${relativePath}`;
        }
        async function fsDirToMetaItems(workDir, extensions) {
            let subItems = await (0, promises_.readdir)(workDir);
            subItems = subItems.filter((item)=>{
                const hasExtension = extensions.some((ext)=>item.endsWith(ext));
                const hasSameBaseName = subItems.some((elem)=>{
                    const baseName = elem.replace(/\.[^/.]+$/, '');
                    return baseName === item.replace(/\.[^/.]+$/, '') && elem !== item;
                });
                return !(hasExtension && hasSameBaseName);
            });
            const sideMeta = (await Promise.all(subItems.map(async (item)=>{
                if ('_meta.json' === item) return null;
                const stat = await (0, promises_.stat)((0, external_node_path_.join)(workDir, item));
                if (stat.isDirectory()) return {
                    type: 'dir',
                    name: item
                };
                return extensions.some((ext)=>item.endsWith(ext)) ? item : null;
            }))).filter(Boolean);
            return sideMeta;
        }
        async function metaItemToSidebarItem(metaItem, workDir, docsDir, extensions, routePrefix, isFirstDir = false) {
            if ('string' == typeof metaItem) return metaFileItemToSidebarItem(metaItem, workDir, docsDir, extensions, routePrefix);
            const { type } = metaItem;
            if ('file' === type) return metaFileItemToSidebarItem(metaItem, workDir, docsDir, extensions, routePrefix);
            if ('dir' === type) {
                const { name, label, collapsible, collapsed, tag: metaJsonTag, context: metaJsonContext, overviewHeaders: metaJsonOverviewHeaders } = metaItem;
                const dirAbsolutePath = (0, external_node_path_.join)(workDir, name);
                const dirMetaJsonPath = (0, external_node_path_.join)(dirAbsolutePath, '_meta.json');
                const isMetaJsonExist = await pathExists(dirMetaJsonPath);
                let dirMetaJson = [];
                dirMetaJson = isMetaJsonExist ? await readJson(dirMetaJsonPath) : await fsDirToMetaItems(dirAbsolutePath, extensions);
                async function getItems(withoutIndex = false) {
                    const items = await Promise.all((withoutIndex ? dirMetaJson.filter((i)=>{
                        let name;
                        if ('object' == typeof i && 'type' in i && 'file' === i.type) name = i.name;
                        else {
                            if ('string' != typeof i) return true;
                            name = i;
                        }
                        return 'index.md' !== name && 'index.mdx' !== i && 'index' !== i;
                    }) : dirMetaJson).map((item)=>metaItemToSidebarItem(item, dirAbsolutePath, docsDir, extensions, routePrefix)));
                    return items;
                }
                try {
                    const sameNameFile = await metaFileItemToSidebarItem(name, workDir, docsDir, extensions, routePrefix);
                    const { link, text, _fileKey, context, overviewHeaders, tag } = sameNameFile;
                    return {
                        text: label || text || name,
                        collapsible,
                        collapsed,
                        items: await getItems(),
                        link,
                        tag: metaJsonTag || tag,
                        overviewHeaders: metaJsonOverviewHeaders || overviewHeaders,
                        context: metaJsonContext || context,
                        _fileKey
                    };
                } catch (e) {
                    logger_.logger.debug(e);
                    const isIndexInMetaJsonIndex = dirMetaJson.find((i)=>{
                        if ('string' == typeof i) return 'index' === i.replace((0, external_node_path_.extname)(i), '');
                        return false;
                    });
                    const isIndexFileExists = await pathExists((0, external_node_path_.join)(dirAbsolutePath, 'index.mdx')) || await pathExists((0, external_node_path_.join)(dirAbsolutePath, 'index.md'));
                    if (isMetaJsonExist && isIndexInMetaJsonIndex || !isIndexFileExists) return {
                        text: label || name,
                        collapsible,
                        collapsed,
                        items: await getItems(),
                        link: void 0,
                        tag: metaJsonTag,
                        overviewHeaders: metaJsonOverviewHeaders,
                        context: metaJsonContext,
                        _fileKey: getHmrFileKey(dirAbsolutePath, docsDir)
                    };
                    {
                        const indexFile = await metaFileItemToSidebarItem('index', dirAbsolutePath, docsDir, extensions, routePrefix);
                        const { link, text, _fileKey, context, overviewHeaders, tag } = indexFile;
                        return {
                            text: label || text || name,
                            collapsible,
                            collapsed,
                            items: await getItems(!isFirstDir),
                            link,
                            tag: metaJsonTag || tag,
                            overviewHeaders: metaJsonOverviewHeaders || overviewHeaders,
                            context: metaJsonContext || context,
                            _fileKey
                        };
                    }
                }
            }
            if ('custom-link' === type) return metaCustomLinkItemToSidebarItem(metaItem, routePrefix);
            if ('divider' === type || 'section-header' === type) return metaDividerToSidebarItem(metaItem);
            throw new Error(`Unknown meta item type: ${metaItem.type}, please check it in "${(0, external_node_path_.join)(workDir, '_meta.json')}".`);
        }
        async function detectFilePath(absolutePath, extensions) {
            const ext = (0, external_node_path_.extname)(absolutePath);
            if (ext && extensions.includes(ext)) return absolutePath;
            for (const extension of extensions){
                const realPath = absolutePath + extension;
                if (await pathExists(realPath)) return realPath;
            }
            throw new Error(`The file extension "${ext}" is not supported, please use one of the following extensions: ${extensions.join(', ')}`);
        }
        async function metaFileItemToSidebarItem(metaItemRaw, workDir, docsDir, extensions, routePrefix) {
            let metaItem = null;
            metaItem = 'string' == typeof metaItemRaw ? {
                name: metaItemRaw,
                type: 'file'
            } : metaItemRaw;
            const { name, context, label, overviewHeaders, tag } = metaItem;
            const absolutePath = (0, external_node_path_.join)(workDir, name);
            let absolutePathWithExt;
            try {
                absolutePathWithExt = await detectFilePath(absolutePath, extensions);
            } catch  {
                throw new Error(`The file "${absolutePath}" does not exist, please check it in "${(0, external_node_path_.join)(workDir, '_meta.json')}".`);
            }
            const link = absolutePathToLink(absolutePathWithExt, docsDir, routePrefix);
            const info = await extractInfoFromFrontmatterWithAbsolutePath(absolutePathWithExt, docsDir);
            const title = label || info.title;
            return {
                text: title,
                link,
                tag,
                overviewHeaders: info.overviewHeaders || overviewHeaders,
                context: info.context || context,
                _fileKey: getHmrFileKey(absolutePathWithExt, docsDir)
            };
        }
        function metaCustomLinkItemToSidebarItem(metaItem, routePrefix) {
            const { label, link, context, tag } = metaItem;
            return {
                text: label ?? '',
                link: void 0 === link ? '' : (0, shared_.isExternalUrl)(link) ? link : (0, shared_.withBase)(link, routePrefix),
                tag,
                context
            };
        }
        function metaDividerToSidebarItem(metaItem) {
            const { type } = metaItem;
            if ('divider' === type) {
                const { dashed } = metaItem;
                return {
                    dividerType: dashed ? 'dashed' : 'solid'
                };
            }
            const { label, tag } = metaItem;
            return {
                sectionHeaderText: label ?? '',
                tag
            };
        }
        async function scanSideMeta(workDir, docsDir, routePrefix, extensions) {
            const dir = await metaItemToSidebarItem({
                type: 'dir',
                name: ''
            }, workDir, docsDir, extensions, routePrefix, true);
            return dir.items;
        }
        async function walk(workDir, routePrefix = '/', docsDir, extensions) {
            const rootMetaFile = external_node_path_["default"].resolve(workDir, '_meta.json');
            let navConfig;
            try {
                navConfig = await readJson(rootMetaFile);
            } catch (e) {
                logger_.logger.error('[auto-nav-sidebar]', `Generate nav meta error: ${rootMetaFile} not exists`);
                navConfig = [];
            }
            navConfig.forEach((navItem)=>{
                if ('items' in navItem) navItem.items.forEach((item)=>{
                    if ('link' in item && !(0, shared_.isExternalUrl)(item.link)) item.link = (0, shared_.withBase)(item.link, routePrefix);
                });
                if ('link' in navItem && !(0, shared_.isExternalUrl)(navItem.link)) navItem.link = (0, shared_.withBase)(navItem.link, routePrefix);
            });
            const subDirs = (await Promise.all((await promises_["default"].readdir(workDir)).map((v)=>promises_["default"].stat(external_node_path_["default"].join(workDir, v)).then((s)=>{
                    if (s.isDirectory() && 'node_modules' !== v) return v;
                    return false;
                })))).filter(Boolean);
            const sidebarConfig = {};
            await Promise.all(subDirs.map(async (subDir)=>{
                const sidebarGroupKey = `${routePrefix}${subDir}`;
                sidebarConfig[sidebarGroupKey] = await scanSideMeta(external_node_path_["default"].join(workDir, subDir), docsDir, routePrefix, extensions);
            }));
            return {
                nav: navConfig,
                sidebar: sidebarConfig
            };
        }
        function processLocales(langs, versions, root, defaultLang, defaultVersion, extensions) {
            return Promise.all(langs.map(async (lang)=>{
                const walks = versions.length ? await Promise.all(versions.map((version)=>{
                    const routePrefix = (0, shared_.addTrailingSlash)(`${version === defaultVersion ? '' : `/${version}`}${lang === defaultLang ? '' : `/${lang}`}`);
                    return walk(external_node_path_["default"].join(root, version, lang), routePrefix, root, extensions);
                })) : [
                    await walk(external_node_path_["default"].join(root, lang), (0, shared_.addTrailingSlash)(lang === defaultLang ? '' : `/${lang}`), root, extensions)
                ];
                return combineWalkResult(walks, versions);
            }));
        }
        function pluginAutoNavSidebar() {
            return {
                name: 'auto-nav-sidebar',
                async config (config) {
                    config.themeConfig = config.themeConfig || {};
                    config.themeConfig.locales = config.themeConfig.locales || config.locales || [];
                    const langs = config.themeConfig.locales.map((locale)=>locale.lang);
                    const hasLocales = langs.length > 0;
                    const hasLang = Boolean(config.lang);
                    const versions = config.multiVersion?.versions || [];
                    const defaultLang = config.lang || '';
                    const { default: defaultVersion = '' } = config.multiVersion || {};
                    const { extensions = constants_.DEFAULT_PAGE_EXTENSIONS } = config?.route || {};
                    if (hasLocales) {
                        const metaInfo = await processLocales(langs, versions, config.root, defaultLang, defaultVersion, extensions);
                        config.themeConfig.locales = config.themeConfig.locales.map((item, index)=>({
                                ...item,
                                ...metaInfo[index]
                            }));
                    } else {
                        if (hasLang) {
                            logger_.logger.error("`lang` is configured but `locales` not, thus `auto-nav-sidebar` can not auto generate navbar level config correctly!\nplease check your config file");
                            return config;
                        }
                        const walks = versions.length ? await Promise.all(versions.map((version)=>{
                            const routePrefix = (0, shared_.addTrailingSlash)(version === defaultVersion ? '' : `/${version}`);
                            return walk(external_node_path_["default"].join(config.root, version), routePrefix, config.root, extensions);
                        })) : [
                            await walk(config.root, '/', config.root, extensions)
                        ];
                        const combined = combineWalkResult(walks, versions);
                        config.themeConfig = {
                            ...config.themeConfig,
                            ...combined
                        };
                    }
                    return config;
                }
            };
        }
    }
};
