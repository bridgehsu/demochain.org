export interface DocNavItem {
    title: string;
    slug: string[];
    href: string;
}

export interface DocNavGroup {
    consensus: string;
    label: string;
    color: string;           // Tailwind text color class
    activeBg: string;        // Tailwind bg class for active item
    borderColor: string;     // Tailwind border color for group header
    rootHref: string;
    items: DocNavItem[];
}

export const DOC_NAV: DocNavGroup[] = [
    {
        consensus: 'POW',
        label: 'PoW',
        color: 'text-orange-500 dark:text-orange-400',
        activeBg: 'bg-orange-50 dark:bg-orange-500/10',
        borderColor: 'border-orange-300 dark:border-orange-700',
        rootHref: '/docs/pow',
        items: [
            {title: '哈希与难度', slug: ['pow', 'hash'], href: '/docs/pow/hash'},
            {title: '区块结构', slug: ['pow', 'block'], href: '/docs/pow/block'},
            {title: '区块链', slug: ['pow', 'blockchain'], href: '/docs/pow/blockchain'},
            {title: '分布式挖矿', slug: ['pow', 'distribution'], href: '/docs/pow/distribution'},
            {title: '代币与转账', slug: ['pow', 'token'], href: '/docs/pow/token'},
            {title: '币基交易', slug: ['pow', 'coinbase'], href: '/docs/pow/coinbase'},
        ],
    },
    {
        consensus: 'POS',
        label: 'PoS',
        color: 'text-blue-500 dark:text-blue-400',
        activeBg: 'bg-blue-50 dark:bg-blue-500/10',
        borderColor: 'border-blue-300 dark:border-blue-700',
        rootHref: '/docs/pos',
        items: [
            {title: '质押', slug: ['pos', 'staking'], href: '/docs/pos/staking'},
            {title: '验证者选择', slug: ['pos', 'validators'], href: '/docs/pos/validators'},
            {title: '惩罚（Slashing）', slug: ['pos', 'slashing'], href: '/docs/pos/slashing'},
            {title: '出块奖励', slug: ['pos', 'rewards'], href: '/docs/pos/rewards'},
            {title: 'PoS 链视图', slug: ['pos', 'chain'], href: '/docs/pos/chain'},
        ],
    },
    {
        consensus: 'DPOS',
        label: 'DPoS',
        color: 'text-purple-500 dark:text-purple-400',
        activeBg: 'bg-purple-50 dark:bg-purple-500/10',
        borderColor: 'border-purple-300 dark:border-purple-700',
        rootHref: '/docs/dpos',
        items: [
            {title: '候选人', slug: ['dpos', 'candidates'], href: '/docs/dpos/candidates'},
            {title: '投票', slug: ['dpos', 'vote'], href: '/docs/dpos/vote'},
            {title: '轮次出块', slug: ['dpos', 'rounds'], href: '/docs/dpos/rounds'},
            {title: 'DPoS 链视图', slug: ['dpos', 'chain'], href: '/docs/dpos/chain'},
        ],
    },
    {
        consensus: 'POA',
        label: 'PoA',
        color: 'text-green-500 dark:text-green-400',
        activeBg: 'bg-green-50 dark:bg-green-500/10',
        borderColor: 'border-green-300 dark:border-green-700',
        rootHref: '/docs/poa',
        items: [
            {title: '权威节点', slug: ['poa', 'authority'], href: '/docs/poa/authority'},
            {title: '签名出块', slug: ['poa', 'signing'], href: '/docs/poa/signing'},
            {title: 'PoA 链视图', slug: ['poa', 'chain'], href: '/docs/poa/chain'},
        ],
    },
    {
        consensus: 'BFT',
        label: 'BFT',
        color: 'text-red-500 dark:text-red-400',
        activeBg: 'bg-red-50 dark:bg-red-500/10',
        borderColor: 'border-red-300 dark:border-red-700',
        rootHref: '/docs/bft',
        items: [
            {title: '节点与容错', slug: ['bft', 'nodes'], href: '/docs/bft/nodes'},
            {title: '提案', slug: ['bft', 'propose'], href: '/docs/bft/propose'},
            {title: '三阶段投票', slug: ['bft', 'vote'], href: '/docs/bft/vote'},
            {title: 'BFT 链视图', slug: ['bft', 'chain'], href: '/docs/bft/chain'},
        ],
    },
    {
        consensus: 'AVALANCHE',
        label: 'Avalanche',
        color: 'text-cyan-500 dark:text-cyan-400',
        activeBg: 'bg-cyan-50 dark:bg-cyan-500/10',
        borderColor: 'border-cyan-300 dark:border-cyan-700',
        rootHref: '/docs/avalanche',
        items: [
            {title: '随机采样', slug: ['avalanche', 'sampling'], href: '/docs/avalanche/sampling'},
            {title: '雪球算法', slug: ['avalanche', 'snowball'], href: '/docs/avalanche/snowball'},
            {title: 'Avalanche 链视图', slug: ['avalanche', 'chain'], href: '/docs/avalanche/chain'},
        ],
    },
    {
        consensus: 'POH',
        label: 'PoH',
        color: 'text-amber-500 dark:text-amber-400',
        activeBg: 'bg-amber-50 dark:bg-amber-500/10',
        borderColor: 'border-amber-300 dark:border-amber-700',
        rootHref: '/docs/poh',
        items: [
            {title: '哈希序列', slug: ['poh', 'sequence'], href: '/docs/poh/sequence'},
            {title: '时序与事件', slug: ['poh', 'timeline'], href: '/docs/poh/timeline'},
            {title: 'PoH 链视图', slug: ['poh', 'chain'], href: '/docs/poh/chain'},
        ],
    },
];
