import node_path from "node:path";
import { build, dev, serve } from "@rspress/core";
import { logger } from "@rspress/shared/logger";
import { cac } from "cac";
import chokidar from "chokidar";
import picocolors from "picocolors";
import node_fs from "node:fs";
import { DEFAULT_CONFIG_EXTENSIONS, DEFAULT_CONFIG_NAME } from "@rspress/shared/constants";
var package_namespaceObject = JSON.parse('{"i8":"2.0.0-beta.16"}');
const findConfig = (basePath)=>DEFAULT_CONFIG_EXTENSIONS.map((ext)=>basePath + ext).find(node_fs.existsSync);
async function loadConfigFile(customConfigFile) {
    const baseDir = process.cwd();
    let configFilePath = '';
    configFilePath = customConfigFile ? node_path.isAbsolute(customConfigFile) ? customConfigFile : node_path.join(baseDir, customConfigFile) : findConfig(node_path.join(baseDir, DEFAULT_CONFIG_NAME));
    if (!configFilePath) {
        logger.info(`No config file found in ${baseDir}`);
        return {};
    }
    const { loadConfig } = await import("@rsbuild/core");
    const { content } = await loadConfig({
        cwd: node_path.dirname(configFilePath),
        path: configFilePath
    });
    return content;
}
function resolveDocRoot(cwd, cliRoot, configRoot) {
    if (cliRoot) return node_path.join(cwd, cliRoot);
    if (configRoot) return node_path.isAbsolute(configRoot) ? configRoot : node_path.join(cwd, configRoot);
    return node_path.join(cwd, 'docs');
}
const CONFIG_FILES = [
    'rspress.config.ts',
    'rspress.config.js'
];
const META_FILE = '_meta.json';
const cli = cac('rspress').version(package_namespaceObject.i8).help();
const landingMessage = `\u{1F525} Rspress v${package_namespaceObject.i8}\n`;
logger.greet(landingMessage);
const setNodeEnv = (env)=>{
    process.env.NODE_ENV = env;
};
cli.option('-c,--config [config]', 'Specify the path to the config file');
cli.command('[root]', 'start dev server').alias('dev').option('--port [port]', 'port number').option('--host [host]', 'hostname').action(async (root, options)=>{
    setNodeEnv('development');
    let isRestarting = false;
    const cwd = process.cwd();
    let cliWatcher;
    let devServer;
    const startDevServer = async ()=>{
        const { port, host } = options || {};
        const config = await loadConfigFile(options?.config);
        config.root = resolveDocRoot(cwd, root, config.root);
        const docDirectory = config.root;
        devServer = await dev({
            appDirectory: cwd,
            docDirectory,
            config,
            extraBuilderConfig: {
                server: {
                    port,
                    host
                }
            }
        });
        cliWatcher = chokidar.watch([
            `${cwd}/**/{${CONFIG_FILES.join(',')}}`,
            docDirectory
        ], {
            ignoreInitial: true,
            ignored: [
                '**/node_modules/**',
                '**/.git/**',
                '**/.DS_Store/**'
            ]
        });
        cliWatcher.on('all', async (eventName, filepath)=>{
            if ('add' === eventName || 'unlink' === eventName || 'change' === eventName && (CONFIG_FILES.includes(node_path.basename(filepath)) || node_path.basename(filepath) === META_FILE)) {
                if (isRestarting) return;
                isRestarting = true;
                console.log(`
\u{2728} ${eventName} ${picocolors.green(node_path.relative(cwd, filepath))}, dev server will restart...\n`);
                await devServer.close();
                await cliWatcher.close();
                await startDevServer();
                isRestarting = false;
            }
        });
    };
    await startDevServer();
    const exitProcess = async ()=>{
        try {
            await devServer.close();
            await cliWatcher.close();
        } finally{
            process.exit(0);
        }
    };
    process.on('SIGINT', exitProcess);
    process.on('SIGTERM', exitProcess);
});
cli.command('build [root]').action(async (root, options)=>{
    setNodeEnv('production');
    const cwd = process.cwd();
    const config = await loadConfigFile(options.config);
    config.root = resolveDocRoot(cwd, root, config.root);
    const docDirectory = config.root;
    try {
        await build({
            docDirectory,
            config
        });
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
cli.command('preview [root]').alias('serve').option('--port [port]', 'port number').option('--host [host]', 'hostname').action(async (root, options)=>{
    setNodeEnv('production');
    const cwd = process.cwd();
    const { port, host } = options || {};
    const config = await loadConfigFile(options?.config);
    config.root = resolveDocRoot(cwd, root, config.root);
    await serve({
        config,
        host,
        port
    });
});
cli.parse();
