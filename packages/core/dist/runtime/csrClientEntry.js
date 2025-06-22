import { jsx } from "react/jsx-runtime";
import { createRoot } from "react-dom/client";
import { ClientApp } from "./ClientApp.js";
const container = document.getElementById('root');
createRoot(container).render(/*#__PURE__*/ jsx(ClientApp, {}));
