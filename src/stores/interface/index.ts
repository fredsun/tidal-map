/**
 * 存放在 Pinia 里的 Key【类似 Android: Sharedpreference缓存】
 */
/* GlobalState */
import { Tide } from "@/api/interface"

export interface GlobalState {
    token: string;
    userInfo: any;
    assemblySize: AssemblySizeType;
    language: string;
    themeConfig: ThemeConfigProps;
    pointList: Point[];
}

/* themeConfigProp */
export interface ThemeConfigProps {
    maximize: boolean;
    layout: LayoutType;
    primary: string;
    isDark: boolean;
    isGrey: boolean;
    isCollapse: boolean;
    isWeak: boolean;
    breadcrumb: boolean;
    breadcrumbIcon: boolean;
    tabs: boolean;
    tabsIcon: boolean;
    footer: boolean;
}

export type AssemblySizeType = "default" | "small" | "large";

export type LayoutType = "vertical" | "classic" | "transverse" | "columns";

/* tabsMenuProps */
export interface TabsMenuProps {
    icon: string;
    title: string;
    path: string;
    name: string;
    close: boolean;
}

/* TabsState */
export interface TabsState {
    tabsMenuList: TabsMenuProps[];
}

/* AuthState */
export interface AuthState {
    routeName: string;
    authButtonList: {
        [key: string]: string[];
    };
    authMenuList: Menu.MenuOptions[];
}

/* keepAliveState */
export interface keepAliveState {
    keepAliveName: string[];
}

export interface Point{
    id: number;
    text: string;
    imageUrl: string;
    active: boolean;
    clicked: boolean;
    lng:number;
    lat:number;
    data:Tide.ResTideParams;
}
