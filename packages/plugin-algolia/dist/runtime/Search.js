import { Fragment, jsx } from "react/jsx-runtime";
import { DocSearch } from "@docsearch/react";
import { useLang, useNavigate } from "@rspress/runtime";
import { Link } from "@theme";
import "@docsearch/css";
import "./Search.css";
import { useEffect } from "react";
const Hit = ({ hit, children })=>/*#__PURE__*/ jsx(Link, {
        href: hit.url,
        children: children
    });
function Search({ locales = {}, docSearchProps }) {
    const navigate = useNavigate();
    const lang = useLang();
    const { translations, placeholder } = locales?.[lang] ?? {};
    useEffect(()=>{
        const preconnect = document.createElement('link');
        const appId = docSearchProps.appId;
        preconnect.id = appId;
        preconnect.rel = 'preconnect';
        preconnect.href = `https://${appId}-dsn.algolia.net`;
        preconnect.crossOrigin = '';
        document.head.appendChild(preconnect);
        return ()=>{
            document.head.removeChild(preconnect);
        };
    }, [
        docSearchProps.appId
    ]);
    return /*#__PURE__*/ jsx(Fragment, {
        children: /*#__PURE__*/ jsx(DocSearch, {
            placeholder: placeholder,
            translations: translations,
            maxResultsPerGroup: 20,
            navigator: {
                navigate ({ itemUrl }) {
                    navigate(itemUrl);
                }
            },
            transformItems: (items)=>items.map((item)=>{
                    const url = new URL(item.url);
                    return {
                        ...item,
                        url: item.url.replace(url.origin, '')
                    };
                }),
            hitComponent: Hit,
            ...docSearchProps
        })
    });
}
export { Search };
