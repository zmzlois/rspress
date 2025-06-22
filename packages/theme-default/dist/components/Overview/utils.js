import { withBase } from "@rspress/runtime";
import { isSidebarDivider } from "../Sidebar/utils.js";
function removeIndex(link) {
    if (link.endsWith('/index')) return link.slice(0, -5);
    return link;
}
function findItemByRoutePath(items, routePath) {
    function isRoutePathMatch(item) {
        if (isSidebarDivider(item)) return false;
        const withBaseUrl = withBase(item.link);
        const removeIndexUrl = removeIndex(withBaseUrl);
        const removeBackSlashedRoutePath = routePath.replace(/\/$/, '');
        return withBaseUrl === routePath || removeIndexUrl === routePath || withBaseUrl === removeBackSlashedRoutePath || removeIndexUrl === removeBackSlashedRoutePath;
    }
    const matchRoutePathItemIndex = items.findIndex((item)=>isRoutePathMatch(item));
    if (-1 === matchRoutePathItemIndex) return items.map((item)=>{
        if (!('items' in item)) return [];
        return findItemByRoutePath(item.items, routePath);
    }).flat();
    const matchRoutePathItem = items[matchRoutePathItemIndex];
    const isArray = (i)=>Array.isArray(i) && i.length >= 1;
    if ('items' in matchRoutePathItem && isArray(matchRoutePathItem.items)) {
        if (matchRoutePathItem.items.every((item)=>!('items' in item))) return [
            matchRoutePathItem
        ];
        return matchRoutePathItem.items.filter((item)=>!isSidebarDivider(item));
    }
    const result = [
        ...items
    ];
    if (!('items' in matchRoutePathItem)) result.splice(matchRoutePathItemIndex, 1);
    const res = result.filter((item)=>!isSidebarDivider(item));
    return res;
}
export { findItemByRoutePath };
