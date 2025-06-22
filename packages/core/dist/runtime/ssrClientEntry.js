import { jsx } from "react/jsx-runtime";
import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { ClientApp } from "./ClientApp.js";
import { initPageData } from "./initPageData.js";
async function renderInBrowser() {
    const container = document.getElementById('root');
    const initialPageData = await initPageData(window.location.pathname);
    startTransition(()=>{
        hydrateRoot(container, /*#__PURE__*/ jsx(ClientApp, {
            initialPageData: initialPageData
        }), {
            onRecoverableError (error, errorInfo) {
                if (error instanceof Error) console.warn('hydrateRoot recoverable error:', error, errorInfo);
            }
        });
    });
}
renderInBrowser();
