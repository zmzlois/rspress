export declare const generateId: (pageName: string, index: number) => string;

export declare const getLangFileExt: (lang: string) => string;

export declare const injectDemoBlockImport: (str: string, path: string) => string;

/**
 * remove .html extension and validate
 * @param routePath id from pathname
 * @returns normalized id
 */
export declare const normalizeId: (routePath: string) => string;

/**
 * Converts a string to a valid variable name. If the string is already a valid variable name, returns the original string.
 * @param str - The string to convert.
 * @returns The converted string.
 */
export declare const toValidVarName: (str: string) => string;

export { }
