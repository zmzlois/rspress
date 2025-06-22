import { jsx } from "react/jsx-runtime";
import { DataContext, ThemeContext, pathnameToRouteService } from "@rspress/runtime";
import { StaticRouter } from "@rspress/runtime/server";
import { UnheadProvider } from "@unhead/react/server";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { text as consumers_text } from "node:stream/consumers";
import { App } from "./App.js";
import { initPageData } from "./initPageData.js";
import { routes } from "virtual-routes";
const DEFAULT_THEME = 'light';
async function preloadRoute(pathname) {
    const route = pathnameToRouteService(pathname);
    await route?.preload();
}
function renderToHtml(app) {
    return new Promise((resolve, reject)=>{
        const passThrough = new PassThrough();
        const { pipe } = renderToPipeableStream(app, {
            onError (error) {
                reject(error);
            },
            onAllReady () {
                pipe(passThrough);
                consumers_text(passThrough).then(resolve, reject);
            }
        });
    });
}
async function render(pagePath, head) {
    const initialPageData = await initPageData(pagePath);
    await preloadRoute(pagePath);
    const appHtml = await renderToHtml(/*#__PURE__*/ jsx(ThemeContext.Provider, {
        value: {
            theme: DEFAULT_THEME
        },
        children: /*#__PURE__*/ jsx(DataContext.Provider, {
            value: {
                data: initialPageData
            },
            children: /*#__PURE__*/ jsx(StaticRouter, {
                location: pagePath,
                children: /*#__PURE__*/ jsx(UnheadProvider, {
                    value: head,
                    children: /*#__PURE__*/ jsx(App, {})
                })
            })
        })
    }));
    return {
        appHtml,
        pageData: initialPageData
    };
}
export { render, routes };
