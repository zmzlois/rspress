import node_fs from "node:fs";
import node_path from "node:path";
import { logger } from "@rspress/shared/logger";
import { RSPRESS_TEMP_DIR } from "@rspress/shared";
import chokidar from "chokidar";
import { withCompilerOptions, withCustomConfig, withDefaultConfig } from "react-docgen-typescript";
node_path.join(__dirname, '..');
const apiDocMap = {};
const locales = {
    zh: {
        copy: "\u590D\u5236",
        copied: "\u590D\u5236\u6210\u529F",
        expand: "\u5C55\u5F00\u4EE3\u7801",
        collapse: "\u6536\u8D77\u4EE3\u7801",
        className: "\u8282\u70B9\u7C7B\u540D",
        style: "\u8282\u70B9\u6837\u5F0F",
        children: "\u5B50\u8282\u70B9",
        disabled: "\u662F\u5426\u7981\u7528",
        required: "\u5FC5\u586B",
        property: "\u5C5E\u6027",
        description: "\u8BF4\u660E",
        type: "\u7C7B\u578B",
        defaultValue: "\u9ED8\u8BA4\u503C",
        overview: "\u6982\u89C8"
    },
    en: {
        copy: 'Copy',
        copied: 'Copied Success!',
        expand: 'Expand Code',
        collapse: 'Collapse Code',
        className: 'Additional css class',
        style: 'Additional style',
        children: 'Children',
        disabled: 'Whether to disable ',
        required: 'Required',
        property: 'Property',
        description: "Description",
        type: 'Type',
        defaultValue: 'Default Value',
        overview: 'Overview'
    },
    ru: {
        copy: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
        copied: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0443\u0441\u043F\u0435\u0448\u043D\u043E",
        expand: "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043A\u043E\u0434",
        collapse: "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u043A\u043E\u0434",
        className: "\u0418\u043C\u044F \u043A\u043B\u0430\u0441\u0441\u0430 \u0443\u0437\u043B\u0430",
        style: "\u0421\u0442\u0438\u043B\u044C \u0443\u0437\u043B\u0430",
        children: "\u0414\u043E\u0447\u0435\u0440\u043D\u0438\u0435 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
        disabled: "\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
        required: "\u041E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E",
        property: "\u0421\u0432\u043E\u0439\u0441\u0442\u0432\u043E",
        description: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435",
        type: "\u0422\u0438\u043F",
        defaultValue: "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
        overview: "\u041E\u0431\u0437\u043E\u0440"
    }
};
const isToolEntries = (obj)=>!!obj.documentation || !!obj["react-docgen-typescript"];
const docgen = async ({ entries, languages, apiParseTool, appDir, parseToolOptions, isProd })=>{
    const watchFileMap = {};
    const genApiDoc = async (entry, tool)=>{
        if (0 === Object.keys(entry).length) return;
        await Promise.all(Object.entries(entry).map(async ([key, value])=>{
            const moduleSourceFilePath = node_path.resolve(appDir, value);
            watchFileMap[moduleSourceFilePath] = {
                apiParseTool,
                moduleName: key
            };
            try {
                if ('documentation' === tool) {
                    const documentation = await import("documentation");
                    const documentationRes = await documentation.build([
                        moduleSourceFilePath
                    ], {
                        ...parseToolOptions.documentation
                    });
                    const apiDoc = await documentation.formats.md(documentationRes, {
                        noReferenceLinks: parseToolOptions.documentation?.noReferenceLinks ?? true
                    });
                    apiDocMap[key] = apiDoc;
                } else {
                    const { tsconfigPath, compilerOptions, ...restOptions } = parseToolOptions?.["react-docgen-typescript"] ?? {};
                    const parserOpts = {
                        propFilter: (prop)=>{
                            if (void 0 !== prop.declarations && prop.declarations.length > 0) {
                                const hasPropAdditionalDescription = prop.declarations.find((declaration)=>!declaration.fileName.includes('node_modules'));
                                return Boolean(hasPropAdditionalDescription);
                            }
                            return true;
                        },
                        ...restOptions
                    };
                    let fileParser = withDefaultConfig(parserOpts);
                    if (tsconfigPath?.[key]) fileParser = withCustomConfig(tsconfigPath[key], parserOpts);
                    else if (compilerOptions?.[key]) fileParser = withCompilerOptions(compilerOptions[key], parserOpts);
                    const componentDoc = fileParser.parse(moduleSourceFilePath);
                    if (0 === componentDoc.length) logger.warn('[module-doc-plugin]', `Unable to parse API document in ${moduleSourceFilePath}`);
                    if (languages.length > 0) languages.forEach((language)=>{
                        apiDocMap[`${key}-${language}`] = generateTable(componentDoc, language);
                    });
                    else apiDocMap[key] = generateTable(componentDoc, 'en');
                }
            } catch (e) {
                if (e instanceof Error) logger.error('[module-doc-plugin]', 'Generate API table error:\n', e);
            }
        }));
    };
    logger.info('[module-doc-plugin]', 'Start to generate API table...');
    if (isToolEntries(entries)) {
        const reactEntries = entries["react-docgen-typescript"];
        const documentationEntries = entries.documentation;
        await Promise.all([
            genApiDoc(reactEntries, "react-docgen-typescript"),
            genApiDoc(documentationEntries, 'documentation')
        ]);
    } else await genApiDoc(entries, apiParseTool);
    if (!isProd) {
        const watcher = chokidar.watch(Object.keys(watchFileMap), {
            ignoreInitial: true,
            ignorePermissionErrors: true,
            ignored: [
                /node_modules/
            ]
        });
        let isUpdate = false;
        watcher.on('change', (changed)=>{
            if (isUpdate) return;
            isUpdate = true;
            logger.info('[module-doc-plugin]', 'updating API');
            const watchFileInfo = watchFileMap[changed];
            if (watchFileInfo) {
                const { apiParseTool, moduleName } = watchFileInfo;
                const updateSiteData = ()=>{
                    const siteDataPath = node_path.join(process.cwd(), 'node_modules', RSPRESS_TEMP_DIR, 'runtime', 'virtual-site-data.mjs');
                    import(siteDataPath).then((siteData)=>{
                        const data = {
                            ...siteData.default
                        };
                        data.pages.forEach((page)=>{
                            page.apiDocMap = apiDocMap;
                        });
                        node_fs.writeFileSync(siteDataPath, `export default ${JSON.stringify(data)}`);
                        isUpdate = false;
                    });
                };
                genApiDoc({
                    [moduleName]: changed
                }, apiParseTool).then(updateSiteData);
            }
        });
    }
    logger.success('[module-doc-plugin]', 'Generate API table successfully!');
};
function generateTable(componentDoc, language) {
    return componentDoc.map((param)=>{
        const { props } = param;
        const t = locales[language];
        const PROP_TABLE_HEADER = `|${t.property}|${t.description}|${t.type}|${t.defaultValue}|\n|:---:|:---:|:---:|:---:|`;
        const tableContent = Object.keys(props).filter((propName)=>{
            const { name, description } = props[propName];
            return description || [
                'className',
                'style',
                'disabled',
                'children'
            ].indexOf(name) > -1;
        }).map((propName)=>{
            const { defaultValue, description, name, required, type } = props[propName];
            const getType = ()=>`\`${type.name.replace(/\|/g, '\\|')}\`${required ? ` **(${t.required})**` : ''}`;
            const getDefaultValue = ()=>`\`${defaultValue?.value || '-'}\``;
            const getDescription = ()=>{
                switch(name){
                    case 'className':
                        return description || t.className;
                    case 'style':
                        return description || t.style;
                    case 'children':
                        return description || t.children;
                    case 'disabled':
                        return description || t.disabled;
                    default:
                        return description;
                }
            };
            const formattedDescription = getDescription().replace(/\n/g, '&#10;');
            return `|${[
                name,
                formattedDescription,
                getType(),
                getDefaultValue()
            ].map((str)=>str.replace(/(?<!\\)\|/g, '&#124;')).join('|')}|`;
        });
        return `
  ${param.displayName ? `### ${param.displayName}\n` : ''}
  ${param.description ? `**${param.description}**\n` : ''}
  ${PROP_TABLE_HEADER}
  ${tableContent.join('\n')}
    `;
    }).join('\n');
}
function pluginApiDocgen(options) {
    const { entries = {}, apiParseTool = "react-docgen-typescript", appDir = process.cwd(), parseToolOptions = {} } = options || {};
    return {
        name: '@modern-js/doc-plugin-api-docgen',
        config (config) {
            config.markdown = config.markdown || {};
            return config;
        },
        async beforeBuild (config, isProd) {
            const languages = (config.themeConfig?.locales?.map((locale)=>locale.lang) || config.locales?.map((locale)=>locale.lang) || []).filter((lang)=>[
                    'zh',
                    'en',
                    'ru'
                ].includes(lang));
            await docgen({
                entries,
                apiParseTool,
                languages,
                appDir,
                parseToolOptions,
                isProd
            });
        },
        async modifySearchIndexData (pages) {
            const apiCompRegExp = /(<API\s+moduleName=['"](\S+)['"]\s*(.*)?\/>)|(<API\s+moduleName=['"](\S+)['"]\s*(.*)?>(.*)?<\/API>)/;
            await Promise.all(pages.map(async (page)=>{
                const { _filepath, lang } = page;
                let content = await node_fs.promises.readFile(_filepath, 'utf-8');
                let matchResult = apiCompRegExp.exec(content);
                if (!matchResult) return;
                while(null !== matchResult){
                    const matchContent = matchResult[0];
                    const moduleName = matchResult[2] ?? matchResult[5] ?? '';
                    const apiDoc = apiDocMap[moduleName] ?? apiDocMap[`${moduleName}-${lang ? lang : 'en'}`] ?? '';
                    if (matchContent && !apiDoc) logger.warn(`No api doc found for module: ${moduleName} in lang: ${lang ?? 'en'}`);
                    content = content.replace(matchContent, apiDoc);
                    matchResult = apiCompRegExp.exec(content);
                }
                page.content = content;
            }));
        },
        extendPageData (pageData) {
            pageData.apiDocMap = {
                ...apiDocMap
            };
        },
        markdown: {
            globalComponents: [
                node_path.join(__dirname, '..', 'static', 'global-components', 'API.tsx')
            ]
        }
    };
}
export { pluginApiDocgen };
