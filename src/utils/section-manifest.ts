import {DOC_NAV, type DocNavGroup} from './docs-manifest';

export type SectionKey = 'docs';

export interface SectionManifest {
    key: SectionKey;
    label: string;
    homeLabel: string;
    homePath: string;
    nav: DocNavGroup[];
}

export const SECTION_MANIFESTS: Record<SectionKey, SectionManifest> = {
    docs: {
        key: 'docs',
        label: '文档中心',
        homeLabel: '文档首页',
        homePath: '/docs',
        nav: DOC_NAV,
    },
};

export const SECTION_SWITCHER = [
    SECTION_MANIFESTS.docs,
];

export const getSectionKeyByPath = (_path: string): SectionKey => 'docs';

export const getSectionManifestByPath = (path: string): SectionManifest => (
    SECTION_MANIFESTS[getSectionKeyByPath(path)]
);

export const isSectionRoute = (path: string): boolean => (
    path.startsWith('/docs')
);
