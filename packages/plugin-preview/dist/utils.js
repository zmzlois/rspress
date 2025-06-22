const toValidVarName = (str)=>{
    if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str)) return str;
    return str.replace(/[^0-9a-zA-Z_$]/g, '_').replace(/^([0-9])/, '_$1');
};
const generateId = (pageName, index)=>`_${toValidVarName(pageName)}_${index}`;
const normalizeId = (routePath)=>{
    const result = routePath.replace(/\.(.*)?$/, '');
    return toValidVarName(result);
};
const injectDemoBlockImport = (str, path)=>`
    import DemoBlock from ${JSON.stringify(path)};
    ${str}
  `;
const getLangFileExt = (lang)=>{
    switch(lang){
        case 'jsx':
        case 'tsx':
            return 'tsx';
        case 'json':
            return 'tsx';
        default:
            return lang;
    }
};
export { generateId, getLangFileExt, injectDemoBlockImport, normalizeId, toValidVarName };
