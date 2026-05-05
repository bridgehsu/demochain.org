import React, {useRef, useState, useEffect} from 'react';
import Link from 'next/link';
import {
    FiHash, FiBox, FiLink, FiShare2, FiDollarSign, FiDatabase,
    FiLock, FiUsers, FiSlash, FiGift, FiUserCheck, FiThumbsUp,
    FiRotateCw, FiKey, FiEdit3, FiCpu, FiMessageSquare, FiShuffle,
    FiTrendingUp, FiList, FiClock, FiChevronDown, FiMoreHorizontal
} from 'react-icons/fi';

export type MenuItem = { name: string; href: string; icon: React.ReactNode };
export type Consensus = 'POW' | 'POS' | 'DPOS' | 'POA' | 'BFT' | 'AVALANCHE' | 'POH';

export const ALL_MENUS: Record<Consensus, MenuItem[]> = {
    POW: [
        {name: '哈希', href: '/', icon: <FiHash className="w-4 h-4"/>},
        {name: '区块', href: '/pow/block', icon: <FiBox className="w-4 h-4"/>},
        {name: '区块链', href: '/pow/blockchain', icon: <FiLink className="w-4 h-4"/>},
        {name: '分布式', href: '/pow/distribution', icon: <FiShare2 className="w-4 h-4"/>},
        {name: '代币', href: '/pow/token', icon: <FiDollarSign className="w-4 h-4"/>},
        {name: '币基', href: '/pow/coinbase', icon: <FiDatabase className="w-4 h-4"/>},
    ],
    POS: [
        {name: '质押', href: '/pos', icon: <FiLock className="w-4 h-4"/>},
        {name: '验证者', href: '/pos/validators', icon: <FiUsers className="w-4 h-4"/>},
        {name: '惩罚', href: '/pos/slashing', icon: <FiSlash className="w-4 h-4"/>},
        {name: '奖励', href: '/pos/rewards', icon: <FiGift className="w-4 h-4"/>},
        {name: '链', href: '/pos/chain', icon: <FiLink className="w-4 h-4"/>},
    ],
    DPOS: [
        {name: '候选人', href: '/dpos', icon: <FiUserCheck className="w-4 h-4"/>},
        {name: '投票', href: '/dpos/vote', icon: <FiThumbsUp className="w-4 h-4"/>},
        {name: '轮次', href: '/dpos/rounds', icon: <FiRotateCw className="w-4 h-4"/>},
        {name: '链', href: '/dpos/chain', icon: <FiLink className="w-4 h-4"/>},
    ],
    POA: [
        {name: '权威', href: '/poa', icon: <FiKey className="w-4 h-4"/>},
        {name: '签名', href: '/poa/signing', icon: <FiEdit3 className="w-4 h-4"/>},
        {name: '链', href: '/poa/chain', icon: <FiLink className="w-4 h-4"/>},
    ],
    BFT: [
        {name: '节点', href: '/bft', icon: <FiCpu className="w-4 h-4"/>},
        {name: '提案', href: '/bft/propose', icon: <FiMessageSquare className="w-4 h-4"/>},
        {name: '投票', href: '/bft/vote', icon: <FiThumbsUp className="w-4 h-4"/>},
        {name: '链', href: '/bft/chain', icon: <FiLink className="w-4 h-4"/>},
    ],
    AVALANCHE: [
        {name: '采样', href: '/avalanche', icon: <FiShuffle className="w-4 h-4"/>},
        {name: '雪球', href: '/avalanche/snowball', icon: <FiTrendingUp className="w-4 h-4"/>},
        {name: '链', href: '/avalanche/chain', icon: <FiLink className="w-4 h-4"/>},
    ],
    POH: [
        {name: '序列', href: '/poh', icon: <FiList className="w-4 h-4"/>},
        {name: '时序', href: '/poh/timeline', icon: <FiClock className="w-4 h-4"/>},
        {name: '链', href: '/poh/chain', icon: <FiLink className="w-4 h-4"/>},
    ],
};

export const MENUS = ALL_MENUS.POW;

export const CONSENSUS_CONFIG: Record<Consensus, {
    label: string;
    accent: string;      // active link color
    dot: string;         // indicator dot color
    switcherActive: string; // switcher active bg
}> = {
    POW:       {label: 'PoW',       accent: 'text-orange-500 dark:text-orange-400',  dot: 'bg-orange-500',  switcherActive: 'text-orange-600 dark:text-orange-400'},
    POS:       {label: 'PoS',       accent: 'text-blue-500 dark:text-blue-400',      dot: 'bg-blue-500',    switcherActive: 'text-blue-600 dark:text-blue-400'},
    DPOS:      {label: 'DPoS',      accent: 'text-purple-500 dark:text-purple-400',  dot: 'bg-purple-500',  switcherActive: 'text-purple-600 dark:text-purple-400'},
    POA:       {label: 'PoA',       accent: 'text-green-500 dark:text-green-400',    dot: 'bg-green-500',   switcherActive: 'text-green-600 dark:text-green-400'},
    BFT:       {label: 'BFT',       accent: 'text-red-500 dark:text-red-400',        dot: 'bg-red-500',     switcherActive: 'text-red-600 dark:text-red-400'},
    AVALANCHE: {label: 'Avalanche', accent: 'text-cyan-500 dark:text-cyan-400',      dot: 'bg-cyan-500',    switcherActive: 'text-cyan-600 dark:text-cyan-400'},
    POH:       {label: 'PoH',       accent: 'text-amber-500 dark:text-amber-400',    dot: 'bg-amber-500',   switcherActive: 'text-amber-600 dark:text-amber-400'},
};

export const CONSENSUS_ORDER: Consensus[] = ['POW', 'POS', 'DPOS', 'POA', 'BFT', 'AVALANCHE', 'POH'];
export const CONSENSUS_ENTRY: Record<Consensus, string> = {
    POW: '/', POS: '/pos', DPOS: '/dpos', POA: '/poa', BFT: '/bft', AVALANCHE: '/avalanche', POH: '/poh',
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

interface MenuProps {
    currentPathname: string;
    menuItems?: MenuItem[];
}

export default function Menu({currentPathname}: MenuProps): React.ReactElement {
    const consensus = getActiveConsensus(currentPathname);
    const menuItems = ALL_MENUS[consensus];
    const cfg = CONSENSUS_CONFIG[consensus];

    const [open, setOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!switcherRef.current?.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // 溢出菜单
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
        };
        if (moreOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [moreOpen]);

    const NavLink = ({item}: {item: MenuItem}) => {
        const isActive = currentPathname === item.href;
        return (
            <Link
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                        ? `${cfg.accent} bg-black/5 dark:bg-white/10 shadow-sm`
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50'
                }`}
            >
                {item.icon}
                {item.name}
            </Link>
        );
    };

    const MAX_LG = 4;
    const inlineLg = menuItems.slice(0, MAX_LG);
    const overflowLg = menuItems.slice(MAX_LG);

    return (
        <div className="hidden md:flex items-center gap-2">
            {/* 步骤链接 — lg 以下截断 */}
            <div className="flex lg:hidden items-center gap-1">
                {inlineLg.map(item => <NavLink key={item.href} item={item}/>)}
                {overflowLg.length > 0 && (
                    <div className="relative" ref={moreRef}>
                        <button
                            onClick={() => setMoreOpen(v => !v)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8"
                        >
                            <FiMoreHorizontal className="w-4 h-4"/>
                            <span className="hidden sm:inline">更多</span>
                        </button>
                        {moreOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 p-1.5 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] z-50">
                                {overflowLg.map(item => (
                                    <Link key={item.href} href={item.href}
                                        onClick={() => setMoreOpen(false)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPathname === item.href ? `${cfg.accent} bg-black/5 dark:bg-white/8` : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 步骤链接 — lg 及以上全显 */}
            <div className="hidden lg:flex items-center gap-1">
                {menuItems.map(item => <NavLink key={item.href} item={item}/>)}
            </div>

            {/* 分隔线 */}
            <div className="mx-2 h-6 w-px bg-gray-200 dark:bg-gray-800"/>

            {/* 共识切换器 (放最右侧) */}
            <div className="relative" ref={switcherRef}>
                <button
                    onClick={() => setOpen(v => !v)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all hover:shadow-md ${cfg.switcherActive} bg-white dark:bg-[#1a1a1a]`}
                    aria-haspopup="menu"
                    aria-expanded={open}
                >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`}/>
                    {cfg.label} 机制
                    <FiChevronDown className={`w-4 h-4 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`}/>
                </button>
                {open && (
                    <div role="menu" className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-xl ring-1 ring-black/5 p-2 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 z-50">
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">选择共识</div>
                        {CONSENSUS_ORDER.map(c => {
                            const cc = CONSENSUS_CONFIG[c];
                            const isActive = c === consensus;
                            return (
                                <Link
                                    key={c}
                                    href={CONSENSUS_ENTRY[c]}
                                    role="menuitem"
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-1 ${
                                        isActive
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${cc.dot}`}/>
                                        <span>{cc.label}</span>
                                    </div>
                                    {isActive && (
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
