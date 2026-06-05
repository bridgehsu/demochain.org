import {type DocNavGroup} from './docs-manifest';

export interface FlatNavItem {
    title: string;
    href: string;
}

export const getFlatNavItems = (nav: DocNavGroup[]): FlatNavItem[] => (
    nav.flatMap(group => [
        {title: `${group.label} 总览`, href: group.rootHref},
        ...group.items.map(item => ({title: item.title, href: item.href})),
    ])
);

export const getAdjacentDocs = (items: FlatNavItem[], currentHref: string) => {
    const currentIndex = items.findIndex(item => item.href === currentHref);

    return {
        prevDoc: currentIndex > 0 ? items[currentIndex - 1] : null,
        nextDoc: currentIndex >= 0 && currentIndex < items.length - 1
            ? items[currentIndex + 1]
            : null,
    };
};
