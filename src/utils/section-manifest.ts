import {COINEX_NAV} from './coinex-manifest';
import {DOC_NAV, type DocNavGroup} from './docs-manifest';

export type SectionKey = 'docs' | 'coinex';

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
    coinex: {
        key: 'coinex',
        label: 'CoinEX',
        homeLabel: 'CoinEX 首页',
        homePath: '/coinex',
        nav: COINEX_NAV,
    },
};

export const SECTION_SWITCHER = [
    SECTION_MANIFESTS.docs,
    SECTION_MANIFESTS.coinex,
];

export const getSectionKeyByPath = (path: string): SectionKey => (
    path.startsWith('/coinex') ? 'coinex' : 'docs'
);

export const getSectionManifestByPath = (path: string): SectionManifest => (
    SECTION_MANIFESTS[getSectionKeyByPath(path)]
);

export const isSectionRoute = (path: string): boolean => (
    path.startsWith('/docs') || path.startsWith('/coinex')
);
