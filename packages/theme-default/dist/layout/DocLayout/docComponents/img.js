import { jsx } from "react/jsx-runtime";
import { normalizeImagePath } from "@rspress/runtime";
const Img = (props)=>/*#__PURE__*/ jsx("img", {
        ...props,
        src: normalizeImagePath(props.src || '')
    });
export { Img };
