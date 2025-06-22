import path from "path";
import { Application, TSConfigReader } from "typedoc";
import { load } from "typedoc-plugin-markdown";
import promises from "fs/promises";
const API_DIR = 'api';
async function patchLinks(outputDir) {
    const normalizeLinksInFile = async (filePath)=>{
        const content = await promises.readFile(filePath, 'utf-8');
        const newContent = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, p1, p2)=>{
            if ([
                '/',
                '.'
            ].includes(p2[0])) return `[${p1}](${p2})`;
            return `[${p1}](./${p2})`;
        });
        await promises.writeFile(filePath, newContent);
    };
    const traverse = async (dir)=>{
        const files = await promises.readdir(dir);
        const filePaths = files.map((file)=>path.join(dir, file));
        const stats = await Promise.all(filePaths.map((fp)=>promises.stat(fp)));
        await Promise.all(stats.map((stat, index)=>{
            const file = files[index];
            const filePath = filePaths[index];
            if (stat.isDirectory()) return traverse(filePath);
            if (stat.isFile() && /\.mdx?/.test(file)) return normalizeLinksInFile(filePath);
        }));
    };
    await traverse(outputDir);
}
async function generateMetaJson(absoluteApiDir) {
    const metaJsonPath = path.join(absoluteApiDir, '_meta.json');
    const files = await promises.readdir(absoluteApiDir);
    const filePaths = files.map((file)=>path.join(absoluteApiDir, file));
    const stats = await Promise.all(filePaths.map((fp)=>promises.stat(fp)));
    const dirs = stats.map((stat, index)=>stat.isDirectory() ? files[index] : null).filter(Boolean);
    const meta = dirs.map((dir)=>({
            type: 'dir',
            label: dir.slice(0, 1).toUpperCase() + dir.slice(1),
            name: dir
        }));
    await promises.writeFile(metaJsonPath, JSON.stringify([
        'index',
        ...meta
    ]));
}
async function patchGeneratedApiDocs(absoluteApiDir) {
    await patchLinks(absoluteApiDir);
    await promises.rename(path.join(absoluteApiDir, 'README.md'), path.join(absoluteApiDir, 'index.md'));
    await generateMetaJson(absoluteApiDir);
}
function pluginTypeDoc(options) {
    let docRoot;
    const { entryPoints = [], outDir = API_DIR } = options;
    const apiPageRoute = `/${outDir.replace(/(^\/)|(\/$)/, '')}/`;
    return {
        name: '@rspress/plugin-typedoc',
        async config (config) {
            const app = new Application();
            docRoot = config.root;
            app.options.addReader(new TSConfigReader());
            load(app);
            app.bootstrap({
                name: config.title,
                entryPoints,
                theme: 'markdown',
                disableSources: true,
                readme: 'none',
                githubPages: false,
                requiredToBeDocumented: [
                    'Class',
                    'Function',
                    'Interface'
                ],
                plugin: [
                    'typedoc-plugin-markdown'
                ],
                hideBreadcrumbs: true,
                hideMembersSymbol: true,
                allReflectionsHaveOwnDocument: true
            });
            const project = app.convert();
            if (project) {
                const absoluteApiDir = path.join(docRoot, outDir);
                await app.generateDocs(project, absoluteApiDir);
                await patchGeneratedApiDocs(absoluteApiDir);
                config.themeConfig = config.themeConfig || {};
                config.themeConfig.nav = config.themeConfig.nav || [];
                const { nav } = config.themeConfig;
                function isApiAlreadyInNav(navList) {
                    return navList.some((item)=>{
                        if ('link' in item && 'string' == typeof item.link && item.link.startsWith(apiPageRoute.slice(0, apiPageRoute.length - 1))) return true;
                        return false;
                    });
                }
                if (Array.isArray(nav)) {
                    if (!isApiAlreadyInNav(nav)) nav.push({
                        text: 'API',
                        link: apiPageRoute
                    });
                } else if ('default' in nav) {
                    if (!isApiAlreadyInNav(nav.default)) nav.default.push({
                        text: 'API',
                        link: apiPageRoute
                    });
                }
            }
            return config;
        }
    };
}
export { pluginTypeDoc };
