export interface NavigationItem {
    label: string;
    href: string;
}

export const navigation: NavigationItem[] = [
    {
        label: "Home",
        href: "/",
    },{
        label: "Shop",
        href: "/products",
    },
    {
        label: "Categories",
        href: "/categories",
    },
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];