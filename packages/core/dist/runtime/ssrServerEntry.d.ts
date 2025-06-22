import type { PageData } from '@rspress/shared';
import { type Unhead } from '@unhead/react/server';
export declare function render(pagePath: string, head: Unhead): Promise<{
    appHtml: string;
    pageData: PageData;
}>;
export { routes } from 'virtual-routes';
