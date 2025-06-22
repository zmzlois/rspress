import { jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, useEffect, useRef, useState } from "react";
import { codeToHast, createCssVariablesTheme } from "shiki";
import { getCustomMDXComponent } from "@theme";
import { Code } from "../../layout/DocLayout/docComponents/code/index.js";
import { PreWithCodeButtonGroup } from "../../layout/DocLayout/docComponents/pre.js";
const cssVariablesTheme = createCssVariablesTheme({
    name: 'css-variables',
    variablePrefix: '--shiki-',
    variableDefaults: {},
    fontStyle: true
});
const useLatest = (value)=>{
    const ref = useRef(value);
    ref.current = value;
    return ref;
};
function CodeBlockRuntime({ lang, title, code, shikiOptions, onRendered, ...otherProps }) {
    const [child, setChild] = useState(null);
    const codeRef = useLatest(code);
    useEffect(()=>{
        const highlightCode = async ()=>{
            const hast = await codeToHast(code, {
                lang,
                theme: cssVariablesTheme,
                ...shikiOptions
            });
            if (codeRef.current.length !== code.length) return;
            const reactNode = toJsxRuntime(hast, {
                jsx: jsx,
                jsxs: jsxs,
                development: false,
                components: {
                    ...getCustomMDXComponent(),
                    pre: (props)=>/*#__PURE__*/ jsx(PreWithCodeButtonGroup, {
                            title: title,
                            containerElementClassName: `language-${lang}`,
                            ...props,
                            ...otherProps
                        }),
                    code: ({ className, ...otherProps })=>/*#__PURE__*/ jsx(Code, {
                            ...otherProps,
                            className: [
                                className,
                                `language-${lang}`
                            ].filter(Boolean).join(' ')
                        })
                },
                Fragment: Fragment
            });
            setChild(reactNode);
        };
        highlightCode();
    }, [
        lang,
        code,
        shikiOptions
    ]);
    useEffect(()=>{
        if (child) onRendered?.();
    }, [
        child
    ]);
    return child;
}
export { CodeBlockRuntime };
