import React from 'react';

export type MenuItem = { name: string; href: string };
export type Consensus = 'POW' | 'POS' | 'DPOS' | 'POA' | 'BFT' | 'AVALANCHE' | 'POH';

export const ALL_MENUS: Record<Consensus, MenuItem[]> = {
    POW: [
        {name: '哈希', href: '/pow/hash'},
        {name: '区块', href: '/pow/block'},
        {name: '区块链', href: '/pow/blockchain'},
        {name: '分布式', href: '/pow/distribution'},
        {name: '代币', href: '/pow/token'},
        {name: '币基', href: '/pow/coinbase'},
    ],
    POS: [
        {name: '质押', href: '/pos/staking'},
        {name: '验证者', href: '/pos/validators'},
        {name: '惩罚', href: '/pos/slashing'},
        {name: '奖励', href: '/pos/rewards'},
        {name: '链', href: '/pos/chain'},
    ],
    DPOS: [
        {name: '候选人', href: '/dpos/candidates'},
        {name: '投票', href: '/dpos/vote'},
        {name: '轮次', href: '/dpos/rounds'},
        {name: '链', href: '/dpos/chain'},
    ],
    POA: [
        {name: '权威', href: '/poa/authority'},
        {name: '签名', href: '/poa/signing'},
        {name: '链', href: '/poa/chain'},
    ],
    BFT: [
        {name: '节点', href: '/bft/nodes'},
        {name: '提案', href: '/bft/propose'},
        {name: '投票', href: '/bft/vote'},
        {name: '链', href: '/bft/chain'},
    ],
    AVALANCHE: [
        {name: '采样', href: '/avalanche/sampling'},
        {name: '雪球', href: '/avalanche/snowball'},
        {name: '链', href: '/avalanche/chain'},
    ],
    POH: [
        {name: '序列', href: '/poh/sequence'},
        {name: '时序', href: '/poh/timeline'},
        {name: '链', href: '/poh/chain'},
    ],
};

export const CONSENSUS_CONFIG: Record<Consensus, {
    label: string;
    description: string;
    accent: string;      // active link color
    bg: string;
    dot: string;         // indicator dot color
    icon: React.ReactNode;
}> = {
    POW: {
        label: 'PoW', 
        description: '工作量证明 (算力挖矿)',
        accent: 'text-orange-500 dark:text-orange-400', 
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        dot: 'bg-orange-500',
        icon: null // We will add icons in the UI directly or pass them later
    },
    POS: {
        label: 'PoS', 
        description: '权益证明 (质押验证)',
        accent: 'text-blue-500 dark:text-blue-400', 
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        dot: 'bg-blue-500',
        icon: null
    },
    DPOS: {
        label: 'DPoS', 
        description: '委托权益证明 (投票选举)',
        accent: 'text-purple-500 dark:text-purple-400', 
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        dot: 'bg-purple-500',
        icon: null
    },
    POA: {
        label: 'PoA', 
        description: '权威证明 (信誉背书)',
        accent: 'text-green-500 dark:text-green-400', 
        bg: 'bg-green-50 dark:bg-green-500/10',
        dot: 'bg-green-500',
        icon: null
    },
    BFT: {
        label: 'BFT', 
        description: '拜占庭容错 (节点共识)',
        accent: 'text-red-500 dark:text-red-400', 
        bg: 'bg-red-50 dark:bg-red-500/10',
        dot: 'bg-red-500',
        icon: null
    },
    AVALANCHE: {
        label: 'Avalanche', 
        description: '雪崩协议 (亚采样投票)',
        accent: 'text-cyan-500 dark:text-cyan-400', 
        bg: 'bg-cyan-50 dark:bg-cyan-500/10',
        dot: 'bg-cyan-500',
        icon: null
    },
    POH: {
        label: 'PoH', 
        description: '历史证明 (加密时钟)',
        accent: 'text-amber-500 dark:text-amber-400', 
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        dot: 'bg-amber-500',
        icon: null
    },
};

export const CONSENSUS_ORDER: Consensus[] = ['POW', 'POS', 'DPOS', 'POA', 'BFT', 'AVALANCHE', 'POH'];
export const CONSENSUS_ENTRY: Record<Consensus, string> = {
    POW: '/', POS: '/pos/chain', DPOS: '/dpos/chain', POA: '/poa/chain', BFT: '/bft/chain', AVALANCHE: '/avalanche/chain', POH: '/poh/chain',
};

export function getActiveConsensus(pathname: string): Consensus {
    if (pathname.startsWith('/pos')) return 'POS';
    if (pathname.startsWith('/dpos')) return 'DPOS';
    if (pathname.startsWith('/poa')) return 'POA';
    if (pathname.startsWith('/bft')) return 'BFT';
    if (pathname.startsWith('/avalanche')) return 'AVALANCHE';
    if (pathname.startsWith('/poh')) return 'POH';
    return 'POW';
}
