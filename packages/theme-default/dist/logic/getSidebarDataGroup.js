import { matchPath, normalizeRoutePath, withBase } from "@rspress/runtime";
import { matchSidebar } from "@rspress/shared";
import virtual_site_data from "virtual-site-data";
function isActive(itemLink, currentPathname) {
    const normalizedItemLink = normalizeRoutePath(withBase(itemLink));
    const normalizedCurrentPathname = normalizeRoutePath(currentPathname);
    const linkMatched = matchPath(normalizedItemLink, normalizedCurrentPathname);
    return null !== linkMatched;
}
const getSidebarDataGroup = (sidebar, currentPathname)=>{
    const navRoutes = Object.keys(sidebar).sort((a, b)=>b.length - a.length);
    for (const name of navRoutes)if (matchSidebar(name, currentPathname, virtual_site_data.base)) {
        const sidebarGroup = sidebar[name];
        return sidebarGroup;
    }
    return [];
};
export { getSidebarDataGroup, isActive };
