import {DOC_NAV, type DocNavGroup} from './docs-manifest';

import {TGEX_NAV} from './tgex-manifest';
import {ASSET_MONITOR_NAV} from './asset-monitor-manifest';
import {QUANT_TRADING_NAV} from './quant-trading-manifest';

export type SectionKey = 'docs' | 'tgex' | 'asset-monitor' | 'quant-trading';

export interface SectionManifest {
    key: SectionKey;
    label: string;
    homeLabel: string;
    homePath: string;
    nav: DocNavGroup[];
}

export const SECTION_MANIFESTS: Record<SectionKey, SectionManifest> = {
    'quant-trading': {key: 'quant-trading', label: '量化交易', homeLabel: '量化交易系统文档', homePath: '/quant-trading', nav: QUANT_TRADING_NAV},
    'asset-monitor': {key: 'asset-monitor', label: '多链策略', homeLabel: '资产监测文档首页', homePath: '/asset-monitor', nav: ASSET_MONITOR_NAV},
    tgex: {key: 'tgex', label: 'TGEX', homeLabel: 'TGEX 文档首页', homePath: '/tgex', nav: TGEX_NAV},
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
    SECTION_MANIFESTS.tgex,
    SECTION_MANIFESTS['asset-monitor'],
    SECTION_MANIFESTS['quant-trading'],
];

export const getSectionKeyByPath = (path: string): SectionKey => {
    if (path === '/quant-trading' || path.startsWith('/quant-trading/')) return 'quant-trading';
    if (path === '/asset-monitor' || path.startsWith('/asset-monitor/')) return 'asset-monitor';
    if (path === '/tgex' || path.startsWith('/tgex/')) return 'tgex';
    return 'docs';
};

export const getSectionManifestByPath = (path: string): SectionManifest => (
    SECTION_MANIFESTS[getSectionKeyByPath(path)]
);

export const isSectionRoute = (path: string): boolean => (
    ['/docs', '/tgex', '/asset-monitor', '/quant-trading'].some(root => path === root || path.startsWith(root + '/'))
);
