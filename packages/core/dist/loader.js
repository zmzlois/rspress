import __rslib_shim_module__ from 'module';
/*#__PURE__*/ import.meta.url;
import { logger } from "@rspress/shared/logger";
import { compile, compileWithCrossCompilerCache } from "./processor.js";
async function mdxLoader(source) {
    this.cacheable(true);
    const callback = this.async();
    const options = this.getOptions();
    const filepath = this.resourcePath;
    const { config, docDirectory, checkDeadLinks, routeService, pluginDriver } = options;
    const crossCompilerCache = config?.markdown?.crossCompilerCache ?? true;
    try {
        if (crossCompilerCache && 'production' === process.env.NODE_ENV) {
            const compileResult = await compileWithCrossCompilerCache({
                source,
                filepath,
                docDirectory,
                checkDeadLinks,
                config,
                pluginDriver,
                routeService
            });
            callback(null, compileResult);
        } else {
            const compileResult = await compile({
                source,
                filepath,
                docDirectory,
                checkDeadLinks,
                config,
                pluginDriver,
                routeService
            });
            callback(null, compileResult);
        }
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`MDX compile error: ${e.message} in ${filepath}`);
            logger.debug(e);
            callback({
                message: e.message,
                name: `${filepath} compile error`
            });
        }
    }
}
export { mdxLoader as default };
