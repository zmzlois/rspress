import { matchRoutes } from "react-router-dom";
import { routes } from "virtual-routes";
function normalizeRoutePath(routePath) {
    return decodeURIComponent(routePath).replace(/\.html$/, '').replace(/\/index$/, '/');
}
const cache = new Map();
function pathnameToRouteService(pathname) {
    const cacheItem = cache.get(pathname);
    if (cacheItem) return cacheItem;
    const matched = matchRoutes(routes, normalizeRoutePath(pathname));
    const route = matched?.[0]?.route;
    if (route) cache.set(pathname, route);
    return route;
}
export { normalizeRoutePath, pathnameToRouteService };
