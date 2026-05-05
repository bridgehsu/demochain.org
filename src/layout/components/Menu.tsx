import React, {useRef, useState, useEffect} from 'react';
import Link from 'next/link';

export type MenuItem = { name: string; href: string };
export type Consensus = 'POW' | 'POS' | 'DPOS' | 'POA' | 'BFT' | 'AVALANCHE' | 'POH';

export const ALL_MENUS: Record<Consensus, MenuItem[]> = {
    POW: [
        {name: '哈希', href: '/'},
        {name: '区块', href: '/block'},
        {name: '区块链', href: '/blockchain'},
        {name: '分布式', href: '/distribution'},
        {name: '代币', href: '/token'},
        {name: '币基', href: '/coinbase'},
    ],
    POS: [
        {name: '质押', href: '/pos'},
        {name: '验证者', href: '/pos/validators'},
        {name: '惩罚', href: '/pos/slashing'},
        {name: '奖励', href: '/pos/rewards'},
        {name: '链', href: '/pos/chain'},
    ],
    DPOS: [
        {name: '候选人', href: '/dpos'},
        {name: '投票', href: '/dpos/vote'},
        {name: '轮次', href: '/dpos/rounds'},
        {name: '链', href: '/dpos/chain'},
    ],
    POA: [
        {name: '权威', href: '/poa'},
        {name: '签名', href: '/poa/signing'},
        {name: '链', href: '/poa/chain'},
    ],
    BFT: [
        {name: '节点', href: '/bft'},
        {name: '提案', href: '/bft/propose'},
        {name: '投票', href: '/bft/vote'},
        {name: '链', href: '/bft/chain'},
    ],
    AVALANCHE: [
        {name: '采样', href: '/avalanche'},
        {name: '雪球', href: '/avalanche/snowball'},
        {name: '链', href: '/avalanche/chain'},
    ],
    POH: [
        {name: '序列', href: '/poh'},
        {name: '时序', href: '/poh/timeline'},
        {name: '链', href: '/poh/chain'},
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
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                    isActive
                        ? `${cfg.accent} bg-black/5 dark:bg-white/8`
                        : 'text-gray-600 hover:text-gray-900 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8'
                }`}
            >
                {item.name}
            </Link>
        );
    };

    const MAX_LG = 4;
    const inlineLg = menuItems.slice(0, MAX_LG);
    const overflowLg = menuItems.slice(MAX_LG);

    return (
        <div className="hidden md:flex items-center gap-1">
            {/* 步骤链接 — lg 以下截断 */}
            <div className="flex lg:hidden items-center gap-0.5">
                {inlineLg.map(item => <NavLink key={item.href} item={item}/>)}
                {overflowLg.length > 0 && (
                    <div className="relative" ref={moreRef}>
                        <button
                            onClick={() => setMoreOpen(v => !v)}
                            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-black/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/8 flex items-center gap-1"
                        >
                            更多
                            <svg className="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                            </svg>
                        </button>
                        {moreOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 p-1.5 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] z-50">
                                {overflowLg.map(item => (
                                    <Link key={item.href} href={item.href}
                                        onClick={() => setMoreOpen(false)}
                                        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPathname === item.href ? `${cfg.accent} bg-black/5 dark:bg-white/8` : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 步骤链接 — lg 及以上全显 */}
            <div className="hidden lg:flex items-center gap-0.5">
                {menuItems.map(item => <NavLink key={item.href} item={item}/>)}
            </div>

            {/* 分隔线 */}
            <div className="mx-2 h-4 w-px bg-gray-200 dark:bg-gray-700"/>

            {/* 共识切换器 */}
            <div className="relative" ref={switcherRef}>
                <button
                    onClick={() => setOpen(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/8 ${cfg.switcherActive}`}
                    aria-haspopup="menu"
                    aria-expanded={open}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                    {cfg.label}
                    <svg className={`w-3.5 h-3.5 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                {open && (
                    <div role="menu" className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow-lg ring-1 ring-black/5 p-1.5 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 z-50">
                        {CONSENSUS_ORDER.map(c => {
                            const cc = CONSENSUS_CONFIG[c];
                            const isActive = c === consensus;
                            return (
                                <Link
                                    key={c}
                                    href={CONSENSUS_ENTRY[c]}
                                    role="menuitem"
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <span>{cc.label}</span>
                                    {isActive && <span className={`w-1.5 h-1.5 rounded-full ${cc.dot}`}/>}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
