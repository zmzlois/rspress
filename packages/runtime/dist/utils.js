import { addLeadingSlash, isDataUrl, isExternalUrl, isProduction, normalizeHref, normalizeSlash, removeBase, removeHash, removeTrailingSlash, withBase } from "@rspress/shared";
import virtual_site_data from "virtual-site-data";
function utils_withBase(url = '/') {
    return withBase(url, virtual_site_data.base);
}
function utils_removeBase(url) {
    return removeBase(url, virtual_site_data.base);
}
function isEqualPath(a, b) {
    return utils_withBase(normalizeHrefInRuntime(removeHash(a))) === utils_withBase(normalizeHrefInRuntime(removeHash(b)));
}
function normalizeHrefInRuntime(a) {
    const cleanUrls = Boolean(virtual_site_data?.route?.cleanUrls);
    return normalizeHref(a, cleanUrls);
}
function normalizeImagePath(imagePath) {
    const isProd = isProduction();
    if (!isProd) return imagePath;
    if (isAbsoluteUrl(imagePath)) return imagePath;
    if (!imagePath.startsWith('/')) return imagePath;
    return utils_withBase(imagePath);
}
function isAbsoluteUrl(path) {
    return isExternalUrl(path) || isDataUrl(path) || path.startsWith('//');
}
export { addLeadingSlash, isAbsoluteUrl, isEqualPath, isProduction, normalizeHrefInRuntime, normalizeImagePath, normalizeSlash, utils_removeBase as removeBase, removeTrailingSlash, utils_withBase as withBase };
