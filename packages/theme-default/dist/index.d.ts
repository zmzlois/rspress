import { BundledLanguage } from 'shiki';
import { BundledTheme } from 'shiki';
import { CodeToHastOptions } from 'shiki';
import { ComponentProps } from 'react';
import { ComponentPropsWithRef } from 'react';
import { Dispatch } from 'react';
import { ForwardRefExoticComponent } from 'react';
import type { FrontMatterMeta } from '@rspress/shared';
import { Header } from '@rspress/shared';
import { JSX } from 'react/jsx-runtime';
import { JSX as JSX_2 } from 'react';
import type { LocalSearchOptions } from '@rspress/shared';
import { NormalizedLocales } from '@rspress/shared';
import { NormalizedSidebarGroup } from '@rspress/shared';
import { default as React_2 } from 'react';
import { ReactElement } from 'react';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';
import type { RemoteSearchOptions } from '@rspress/shared';
import { SetStateAction } from 'react';
import { SidebarDivider } from '@rspress/shared';
import { SidebarItem } from '@rspress/shared';
import type { SocialLink } from '@rspress/shared';

export declare type AfterSearch = (query: string, matchedResult: MatchResult) => void | Promise<void>;

export declare function Aside({ outlineTitle }: {
    outlineTitle: string;
}): JSX.Element;

/**
 * A component that renders a styled badge with custom content.
 *
 * The Badge component displays a small, inline element with customizable content and appearance.
 * It's useful for highlighting status, categories, or other short pieces of information.
 *
 * @param {BadgeProps} props - The properties for the Badge component.
 * @returns {JSX.Element} A span element representing the badge.
 *
 * @example
 * Using children:
 * <Badge type="info">New</Badge>
 * <Badge type="warning" outline>Experimental</Badge>
 * <Badge type="danger">Deprecated</Badge>
 * <Badge type="tip" outline><strong>Pro Tip:</strong> Use custom elements</Badge>
 *
 * Using text prop:
 * <Badge text="New" type="info" />
 * <Badge text="Experimental" type="warning" outline />
 * <Badge text="Deprecated" type="danger" />
 */
export declare function Badge({ children, type, text, outline, }: BadgeProps): JSX.Element;

declare interface BadgeProps {
    /**
     * The content to display inside the badge. Can be a string or React nodes.
     */
    children?: React.ReactNode;
    /**
     * The type of badge, which determines its color and style.
     * @default 'tip'
     */
    type?: 'tip' | 'info' | 'warning' | 'danger';
    /**
     * The text content to display inside the badge (for backwards compatibility).
     */
    text?: string;
    /**
     * Whether to display the badge with an outline style.
     * @default false
     */
    outline?: boolean;
}

export declare type BeforeSearch = (query: string) => string | Promise<string> | void;

export declare function bindingAsideScroll(headers: Header[]): void;

export declare function Button(props: ButtonProps): JSX_2.Element;

declare interface ButtonProps {
    type?: string;
    size?: 'medium' | 'big';
    theme?: 'brand' | 'alt';
    href?: string;
    external?: boolean;
    className?: string;
    children?: React_2.ReactNode;
    dangerouslySetInnerHTML?: {
        __html: string;
    };
}

export declare function Card({ content, title, icon, style }: CardProps): JSX.Element;

declare interface CardProps {
    /**
     * The title of the card.
     */
    title: React.ReactNode;
    /**
     * The content to display inside the card.
     */
    content?: React.ReactNode;
    /**
     * The icon of the card.
     */
    icon?: React.ReactNode;
    /**
     * The style of the card.
     */
    style?: React.CSSProperties;
}

declare function Code(props: React_2.HTMLProps<HTMLElement>): JSX.Element;

export declare function CodeBlockRuntime({ lang, title, code, shikiOptions, onRendered, ...otherProps }: CodeBlockRuntimeProps): ReactNode;

export declare interface CodeBlockRuntimeProps extends PreWithCodeButtonGroupProps {
    lang: string;
    code: string;
    shikiOptions?: Omit<CodeToHastOptions<BundledLanguage, BundledTheme>, 'lang' | 'theme'>;
    /**
     * Callback when the code block is rendered.
     * For some DOM operations, such as scroll operations.
     */
    onRendered?: () => void;
}

export declare interface CodeButtonGroupProps extends ReturnType<typeof useCodeButtonGroup> {
    preElementRef: React.RefObject<HTMLPreElement | null>;
    /**
     * @default true
     */
    showCodeWrapButton?: boolean;
    /**
     * @default true
     */
    showCopyButton?: boolean;
}

declare interface CommonMatchResult {
    title: string;
    header: string;
    link: string;
    query: string;
    highlightInfoList: HighlightInfo[];
}

declare interface ContentMatch extends CommonMatchResult {
    type: 'content';
    statement: string;
}

export declare type CustomMatchResult = UserMatchResultItem & {
    renderType: RenderType.Custom;
};

export declare type DefaultMatchResult = {
    group: string;
    renderType: RenderType;
    result: DefaultMatchResultItem[];
};

export declare type DefaultMatchResultItem = TitleMatch | HeaderMatch | ContentMatch;

export declare function DocFooter(): JSX.Element;

export declare function DocLayout(props: DocLayoutProps): JSX.Element;

declare interface DocLayoutProps {
    beforeSidebar?: React.ReactNode;
    afterSidebar?: React.ReactNode;
    beforeDocFooter?: React.ReactNode;
    afterDocFooter?: React.ReactNode;
    beforeDoc?: React.ReactNode;
    afterDoc?: React.ReactNode;
    beforeDocContent?: React.ReactNode;
    afterDocContent?: React.ReactNode;
    beforeOutline?: React.ReactNode;
    afterOutline?: React.ReactNode;
    uiSwitch?: UISwitchResult;
    navTitle?: React.ReactNode;
    components?: Record<string, React.FC>;
}

export declare function EditLink(): JSX.Element | null;

export declare function getCustomMDXComponent(): {
    h1: (props: React.ComponentProps<"h1">) => JSX.Element;
    h2: (props: React.ComponentProps<"h2">) => JSX.Element;
    h3: (props: React.ComponentProps<"h3">) => JSX.Element;
    h4: (props: React.ComponentProps<"h4">) => JSX.Element;
    h5: (props: React.ComponentProps<"h5">) => JSX.Element;
    h6: (props: React.ComponentProps<"h6">) => JSX.Element;
    ul: (props: ComponentProps<"ul">) => JSX.Element;
    ol: (props: ComponentProps<"ol">) => JSX.Element;
    li: (props: ComponentProps<"li">) => JSX.Element;
    table: (props: ComponentProps<"table">) => JSX.Element;
    td: (props: ComponentProps<"td">) => JSX.Element;
    th: (props: ComponentProps<"th">) => JSX.Element;
    tr: (props: ComponentProps<"tr">) => JSX.Element;
    hr: (props: ComponentProps<"hr">) => JSX.Element;
    p: (props: ComponentProps<"p">) => JSX.Element;
    blockquote: (props: ComponentProps<"blockquote">) => JSX.Element;
    strong: (props: ComponentProps<"strong">) => JSX.Element;
    a: (props: ComponentProps<"a">) => JSX.Element;
    code: typeof Code;
    pre: typeof PreWithCodeButtonGroup;
    img: (props: ComponentProps<"img">) => JSX.Element;
};

declare interface Group {
    name: string;
    items: GroupItem[];
}

declare interface GroupItem {
    text: string;
    link: string;
    headers?: Header[];
}

declare interface HeaderMatch extends CommonMatchResult {
    type: 'header';
}

export declare interface HighlightInfo {
    start: number;
    length: number;
}

export declare function HomeFeature({ frontmatter, routePath, }: {
    frontmatter: FrontMatterMeta;
    routePath: string;
}): JSX.Element;

export declare function HomeFooter(): JSX.Element | null;

export declare function HomeHero({ beforeHeroActions, afterHeroActions, frontmatter, routePath, }: HomeHeroProps): JSX.Element;

export declare interface HomeHeroProps {
    frontmatter: FrontMatterMeta;
    routePath: string;
    beforeHeroActions?: React.ReactNode;
    afterHeroActions?: React.ReactNode;
}

export declare function HomeLayout(props: HomeLayoutProps): JSX.Element;

declare interface HomeLayoutProps {
    beforeHero?: React.ReactNode;
    afterHero?: React.ReactNode;
    beforeHeroActions?: React.ReactNode;
    afterHeroActions?: React.ReactNode;
    beforeFeatures?: React.ReactNode;
    afterFeatures?: React.ReactNode;
}

export declare function LastUpdated(): JSX.Element;

export declare function Layout(props: LayoutProps): JSX.Element;

declare type LayoutProps = {
    top?: React_2.ReactNode;
    bottom?: React_2.ReactNode;
    /**
     * Control whether or not to display the navbar, sidebar, outline and footer
     */
    uiSwitch?: Partial<UISwitchResult>;
    HomeLayout?: React_2.FC<HomeLayoutProps>;
    NotFoundLayout?: React_2.FC<any>;
} & Omit<DocLayoutProps, 'uiSwitch'> & HomeLayoutProps & NavProps;

/**
 * What's the difference between <Link> and <a>?
 * Link can tell whether it's in current site or external site.
 * 1. If external, open a new page and navigate to it.
 * 2. If inCurrentPage, scroll to anchor.
 * 3. If inCurrentSite, it will navigate and scroll to anchor, preload the asyncChunk onHover the link
 * 4. Link is styled.
 */
export declare function Link(props: LinkProps): JSX.Element;

export declare function LinkCard(props: LinkCardProps): JSX.Element;

declare interface LinkCardProps {
    /**
     * The URL of the link.
     */
    href: string;
    /**
     * The title of the link.
     */
    title: string;
    /**
     * The description of the link.
     */
    description?: React.ReactNode;
    /**
     * The style of the link card.
     */
    style?: React.CSSProperties;
}

export declare interface LinkProps extends ComponentProps<'a'> {
    href?: string;
    children?: React_2.ReactNode;
    className?: string;
    onNavigate?: () => void;
    keepCurrentParams?: boolean;
}

export declare type MatchResult = (DefaultMatchResult | CustomMatchResult)[];

export declare function Nav(props: NavProps): JSX.Element;

declare interface NavProps {
    beforeNav?: React.ReactNode;
    beforeNavTitle?: React.ReactNode;
    navTitle?: React.ReactNode;
    afterNavTitle?: React.ReactNode;
    afterNavMenu?: React.ReactNode;
}

export declare function NotFoundLayout(): JSX.Element | null;

export declare type OnSearch = (query: string, matchedResult: DefaultMatchResult[]) => {
    group: string;
    result: unknown;
    renderType?: RenderType;
}[] | Promise<{
    group: string;
    result: unknown;
    renderType?: RenderType;
}[]> | void;

export declare function Overview(props: {
    content?: React.ReactNode;
    groups?: Group[];
    defaultGroupTitle?: string;
    overviewHeaders?: number[];
}): JSX.Element;

declare interface PackageManagerTabProps {
    command: string | {
        npm?: string;
        yarn?: string;
        pnpm?: string;
        bun?: string;
    };
    additionalTabs?: {
        tool: string;
        icon?: ReactNode;
    }[];
}

export declare function PackageManagerTabs({ command, additionalTabs, }: PackageManagerTabProps): JSX.Element;

export declare type PageSearcherConfig = {
    currentLang: string;
    currentVersion: string;
};

export declare function parseInlineMarkdownText(mdx: string): string;

export declare function PrevNextPage(props: PrevNextPageProps): JSX.Element;

declare interface PrevNextPageProps {
    type: 'prev' | 'next';
    text: string;
    href: string;
}

/**
 * expected wrapped pre element is:
 * ```html
 *<div class="language-js">
 *  <div class="rspress-code-title">test.js</div>
 *  <div class="rspress-code-content rspress-scrollbar">
 *    <div>
 *      <pre class="shiki css-variables" tabindex="0">
 *        <code class="language-js">
 *        </code>
 *      </pre>
 *    </div>
 *    <div class="code-button-group_fb445">
 *      <button class="" title="Toggle code wrap"></button>
 *      <button class="code-copy-button_c5089" title="Copy code"></button>
 *    </div>
 *  </div>
 *</div>
 *```
 */
declare function PreWithCodeButtonGroup({ containerElementClassName, children, className, title, codeButtonGroupProps, ...otherProps }: PreWithCodeButtonGroupProps): JSX.Element | null;

export declare interface PreWithCodeButtonGroupProps extends React.HTMLProps<HTMLPreElement> {
    containerElementClassName?: string;
    className?: string;
    title?: string;
    codeButtonGroupProps?: Omit<CodeButtonGroupProps, 'preElementRef' | 'codeWrap' | 'toggleCodeWrap'>;
}

declare interface Props {
    isSidebarOpen?: boolean;
    beforeSidebar?: React.ReactNode;
    afterSidebar?: React.ReactNode;
    uiSwitch?: UISwitchResult;
    navTitle?: React.ReactNode;
}

export declare function renderHtmlOrText(str?: string | number | null): {
    children: string | null;
} | {
    dangerouslySetInnerHTML: {
        __html: string;
    };
};

/**
 * In this method, we will render the markdown text to inline html and support basic markdown syntax, including the following:
 * - bold
 * - emphasis
 * - delete
 * - inline code
 * @param text The markdown text to render.
 */
export declare function renderInlineMarkdown(text: string): {
    children: string | null;
} | {
    dangerouslySetInnerHTML: {
        __html: string;
    };
};

export declare type RenderSearchFunction<T = unknown> = (result: T) => ReactNode;

export declare const enum RenderType {
    Default = "default",
    Custom = "custom"
}

export declare function scrollToTarget(target: HTMLElement, isSmooth: boolean, scrollPaddingTop: number): void;

export declare function ScrollToTop(): JSX.Element;

export declare function Search(): JSX.Element;

export declare function SearchButton({ setFocused }: SearchButtonProps): JSX.Element;

export declare interface SearchButtonProps {
    setFocused: (focused: boolean) => void;
}

export declare type SearchOptions = (LocalSearchOptions | RemoteSearchOptions) & PageSearcherConfig;

export declare function SearchPanel({ focused, setFocused }: SearchPanelProps): JSX.Element | null;

export declare interface SearchPanelProps {
    focused: boolean;
    setFocused: (focused: boolean) => void;
}

export declare type ShikiPreProps = {
    containerElementClassName: string | undefined;
    title: string | undefined;
    className: string | undefined;
    codeButtonGroupProps?: Omit<CodeButtonGroupProps, 'preElementRef' | 'codeWrap' | 'toggleCodeWrap'>;
    preElementRef: React.RefObject<HTMLPreElement | null>;
    child: React.ReactElement;
} & React.HTMLProps<HTMLPreElement>;

export declare function Sidebar(props: Props): JSX.Element;

export declare type SidebarData = (SidebarDivider | SidebarItem | NormalizedSidebarGroup)[];

export declare function SidebarList({ sidebarData, setSidebarData, }: {
    sidebarData: SidebarData;
    setSidebarData: React.Dispatch<React.SetStateAction<SidebarData>>;
}): JSX.Element;

export declare const SocialLinks: ({ socialLinks }: {
    socialLinks: SocialLink[];
}) => JSX.Element;

export declare function SourceCode(props: SourceCodeProps): JSX.Element;

declare interface SourceCodeProps {
    href: string;
    platform?: 'github' | 'gitlab';
}

export declare function Steps({ children }: {
    children: ReactNode;
}): JSX.Element;

export declare function SwitchAppearance({ onClick }: {
    onClick?: () => void;
}): JSX.Element;

export declare function Tab({ children, ...props }: TabProps): ReactElement;

declare type TabItem = {
    value?: string;
    label?: string | ReactNode;
    disabled?: boolean;
};

declare type TabProps = ComponentPropsWithRef<'div'> & Pick<TabItem, 'label' | 'value'>;

export declare const Tabs: ForwardRefExoticComponent<TabsProps & RefAttributes<HTMLDivElement>>;

declare interface TabsProps {
    values?: ReactNode[] | ReadonlyArray<ReactNode> | TabItem[];
    defaultValue?: string;
    onChange?: (index: number) => void;
    children: ReactNode;
    groupId?: string;
    tabContainerClassName?: string;
    tabPosition?: 'left' | 'center';
}

export declare const Tag: ({ tag }: {
    tag?: string;
}) => JSX.Element | null;

declare type ThemeConfigValue = ThemeValue | 'auto';

declare type ThemeValue = 'light' | 'dark';

declare interface TitleMatch extends CommonMatchResult {
    type: 'title';
}

export declare function Toc({ onItemClick, }: {
    onItemClick?: (header: Header) => void;
}): false | JSX.Element;

declare interface UISwitchResult {
    showNavbar: boolean;
    showSidebar: boolean;
    showSidebarMenu: boolean;
    showAside: boolean;
    showDocFooter: boolean;
    navbarHeight: number;
    sidebarMenuHeight: number;
    scrollPaddingTop: number;
}

declare const useCodeButtonGroup: () => {
    codeWrap: boolean;
    toggleCodeWrap: () => void;
};

export declare function useEditLink(): {
    text: string;
    link: string;
} | null;

export declare function useEnableNav(): readonly [boolean, Dispatch<SetStateAction<boolean>>];

export declare function useFullTextSearch(): {
    initialized: boolean;
    search: (keyword: string, limit?: number) => Promise<MatchResult>;
};

export declare function useHiddenNav(): boolean;

export declare function useLocaleSiteData(): NormalizedLocales;

export declare function usePrevNextPage(): {
    prevPage: SidebarItem | null;
    nextPage: SidebarItem | null;
};

/**
 * Redirect to current locale for first visit
 */
export declare function useRedirect4FirstVisit(): void;

export declare type UserMatchResultItem<T = unknown> = {
    group: string;
    result: T;
};

export declare function useSetup(): void;

export declare function useSidebarData(): SidebarData;

/**
 * State provider for theme context.
 */
export declare const useThemeState: () => readonly [ThemeValue, (value: ThemeValue, storeValue?: ThemeConfigValue) => void];

export { }
