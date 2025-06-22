import { useLocation } from "@rspress/runtime";
import { useMemo } from "react";
import { getSidebarDataGroup } from "./getSidebarDataGroup.js";
import { useLocaleSiteData } from "./useLocaleSiteData.js";
function useSidebarData() {
    const { sidebar } = useLocaleSiteData();
    const { pathname: rawPathname } = useLocation();
    const pathname = decodeURIComponent(rawPathname);
    const sidebarData = useMemo(()=>getSidebarDataGroup(sidebar, pathname), [
        sidebar,
        pathname
    ]);
    return sidebarData;
}
export { useSidebarData };
