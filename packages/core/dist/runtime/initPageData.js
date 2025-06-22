import { isEqualPath, pathnameToRouteService } from "@rspress/runtime";
import { MDX_OR_MD_REGEXP, cleanUrl } from "@rspress/shared";
import virtual_site_data from "virtual-site-data";
async function initPageData(routePath) {
    const matchedRoute = pathnameToRouteService(routePath);
    if (matchedRoute) {
        const mod = await matchedRoute.preload();
        const pagePath = cleanUrl(matchedRoute.filePath);
        const normalize = (p)=>p.replace(/\/$/, '').toLowerCase();
        const extractPageInfo = virtual_site_data.pages.find((page)=>isEqualPath(normalize(page.routePath), normalize(matchedRoute.path)));
        const encodedPagePath = encodeURIComponent(pagePath);
        const meta = mod.default.__RSPRESS_PAGE_META?.[encodedPagePath] || {};
        const { toc = [], title = '', frontmatter = {}, ...rest } = MDX_OR_MD_REGEXP.test(matchedRoute.filePath) ? meta : mod;
        return {
            siteData: virtual_site_data,
            page: {
                ...rest,
                pagePath,
                ...extractPageInfo,
                pageType: frontmatter?.pageType || 'doc',
                title,
                frontmatter,
                toc
            }
        };
    }
    let lang = virtual_site_data.lang || '';
    let version = virtual_site_data.multiVersion?.default || '';
    if (virtual_site_data.lang && 'undefined' != typeof window) {
        const path = location.pathname.replace(virtual_site_data.base, '').split('/').slice(0, 2);
        if (virtual_site_data.locales.length) {
            const result = virtual_site_data.locales.find(({ lang })=>path.includes(lang));
            if (result) lang = result.lang;
        }
        if (virtual_site_data.multiVersion.versions) {
            const result = virtual_site_data.multiVersion.versions.find((version)=>path.includes(version));
            if (result) version = result;
        }
    }
    return {
        siteData: virtual_site_data,
        page: {
            pagePath: '',
            pageType: '404',
            routePath: '/404',
            lang,
            frontmatter: {},
            title: '404',
            toc: [],
            version,
            _filepath: '',
            _relativePath: ''
        }
    };
}
export { initPageData };
