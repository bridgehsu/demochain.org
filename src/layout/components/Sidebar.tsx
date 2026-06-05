import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {
    FiChevronRight, FiChevronsLeft, FiChevronsRight,
    FiCpu, FiLock, FiUsers, FiKey, FiShield, FiShuffle, FiClock
} from 'react-icons/fi';
import {
    ALL_MENUS,
    CONSENSUS_CONFIG,
    CONSENSUS_ORDER,
    CONSENSUS_ENTRY,
    getActiveConsensus,
    type Consensus
} from './Menu';
import {DOC_NAV} from '@/utils/docs-manifest';
import Logo from '@/components/Logo';
import LogoIcon from '@/components/Icons/LogoIcon';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

const CONSENSUS_ICONS: Record<Consensus, React.ReactNode> = {
    POW: <FiCpu className="w-4 h-4"/>,
    POS: <FiLock className="w-4 h-4"/>,
    DPOS: <FiUsers className="w-4 h-4"/>,
    POA: <FiKey className="w-4 h-4"/>,
    BFT: <FiShield className="w-4 h-4"/>,
    AVALANCHE: <FiShuffle className="w-4 h-4"/>,
    POH: <FiClock className="w-4 h-4"/>,
};

export default function Sidebar({collapsed, onToggle}: SidebarProps): React.ReactElement {
    const router = useRouter();
    const [pathname, setPathname] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [expanded, setExpanded] = useState<Partial<Record<Consensus, boolean>>>(
        () => Object.fromEntries(CONSENSUS_ORDER.map(c => [c, true])) as Record<Consensus, boolean>
    );

    useEffect(() => {
        setIsMounted(true);
        setPathname(router.pathname);
    }, [router.pathname]);

    const isDocsMode = pathname.startsWith('/docs');
    const activeConsensus = isMounted ? getActiveConsensus(pathname) : 'POW';

    useEffect(() => {
        if (!isMounted) return;
        setExpanded(prev => ({...prev, [activeConsensus]: true}));
    }, [activeConsensus, isMounted]);

    const toggle = (c: Consensus) => {
        setExpanded(prev => ({...prev, [c]: !prev[c]}));
    };

    return (
        <aside
            className={`hidden md:flex flex-col shrink-0 fixed left-0 top-0 h-full z-30 border-r border-gray-100 dark:border-[#1c1e25] bg-white dark:bg-[#0d0e12] transition-all duration-300 overflow-hidden ${collapsed ? 'w-14' : 'w-64'}`}>

            {/* Logo 区域 */}
            <div
                className={`flex items-center shrink-0 py-4 border-b border-gray-100 dark:border-[#1c1e25] ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
                {collapsed ? <LogoIcon className="w-8 h-8"/> : <Logo/>}
            </div>

            {/* 导航滚动区 */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2">
                        {isDocsMode ? '文档目录' : '探索模块'}
                    </p>
                )}
                <nav className="space-y-1">
                    {isMounted && CONSENSUS_ORDER.map(c => {
                        const cfg = CONSENSUS_CONFIG[c];
                        const isActive = c === activeConsensus;
                        const isExpanded = expanded[c] ?? isActive;

                        // 文档模式：使用 DOC_NAV 的链接和条目
                        if (isDocsMode) {
                            const docGroup = DOC_NAV.find(g => g.consensus === c);
                            if (!docGroup) return null;
                            const isGroupActive = pathname.startsWith(docGroup.rootHref);

                            return (
                                <div key={c} className="mb-1">
                                    {collapsed ? (
                                        <Link
                                            href={docGroup.rootHref}
                                            title={`${cfg.label} 文档`}
                                            className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 ${
                                                isGroupActive
                                                    ? `${cfg.accent} ${cfg.activeBg} ring-1 ring-black/[0.04] dark:ring-white/[0.08]`
                                                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                                            }`}
                                        >
                                            {CONSENSUS_ICONS[c]}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => toggle(c)}
                                            className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                                isGroupActive
                                                    ? `${cfg.switcherActive} ${cfg.activeBg} ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5 flex-1 text-left">
                                                <div className="relative flex items-center justify-center w-5 h-5">
                                                    <span className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${cfg.dot} ${isGroupActive ? 'scale-125' : 'opacity-30'}`}/>
                                                    {isGroupActive && <span className={`absolute inset-0 rounded-full animate-ping opacity-15 ${cfg.dot}`}/>}
                                                </div>
                                                <span className="tracking-tight">{cfg.label} 文档</span>
                                            </div>
                                            <FiChevronRight className={`w-4 h-4 opacity-25 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90 opacity-60' : 'group-hover:opacity-60'}`}/>
                                        </button>
                                    )}

                                    {!collapsed && isExpanded && (
                                        <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100/60 dark:border-white/[0.03] space-y-0.5">
                                            {docGroup.items.map(item => {
                                                const isItemActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                            isItemActive
                                                                ? `${cfg.accent} font-bold ${cfg.activeBg} ring-1 ring-black/[0.04] dark:ring-white/10`
                                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                                                        }`}
                                                    >
                                                        {isItemActive && (
                                                            <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${cfg.dot}`}/>
                                                        )}
                                                        {item.title}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // 演示模式：使用原有 ALL_MENUS 的链接
                        const items = ALL_MENUS[c];

                        return (
                            <div key={c} className="mb-1">
                                {collapsed ? (
                                    <Link
                                        href={CONSENSUS_ENTRY[c]}
                                        title={`${cfg.label} 机制`}
                                        className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? `${cfg.accent} ${cfg.activeBg} ring-1 ring-black/[0.04] dark:ring-white/[0.08]`
                                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        {CONSENSUS_ICONS[c]}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => toggle(c)}
                                        className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                            isActive
                                                ? `${cfg.switcherActive} ${cfg.activeBg} ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 flex-1 text-left">
                                            <div className="relative flex items-center justify-center w-5 h-5">
                                                <span
                                                    className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${cfg.dot} ${isActive ? 'scale-125' : 'opacity-30'}`}/>
                                                {isActive && <span
                                                    className={`absolute inset-0 rounded-full animate-ping opacity-15 ${cfg.dot}`}/>}
                                            </div>
                                            <span className="tracking-tight">{cfg.label} 机制</span>
                                        </div>
                                        <FiChevronRight
                                            className={`w-4 h-4 opacity-25 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90 opacity-60' : 'group-hover:opacity-60'}`}/>
                                    </button>
                                )}

                                {!collapsed && isExpanded && (
                                    <div
                                        className="mt-1 ml-4 pl-4 border-l-2 border-gray-100/60 dark:border-white/[0.03] space-y-0.5">
                                        {items.map(item => {
                                            const isItemActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                        isItemActive
                                                            ? `${cfg.accent} font-bold ${cfg.activeBg} ring-1 ring-black/[0.04] dark:ring-white/10`
                                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                                                    }`}
                                                >
                                                    {isItemActive && (
                                                        <div
                                                            className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${cfg.dot}`}/>
                                                    )}
                                                    <span
                                                        className={`flex items-center justify-center w-5 h-5 transition-transform duration-200 ${isItemActive ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-80'}`}>
                                                        {item.icon}
                                                    </span>
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* 底部区域：社交 + 收缩按钮 */}
            <div className="px-3 py-3 mt-auto border-t border-gray-100 dark:border-white/[0.03]">
                {collapsed ? (
                    /* 收缩态：图标竖排，展开按钮居中 */
                    <div className="flex flex-col items-center gap-2">
                        <a href="https://x.com/thebridgehsu" target="_blank" rel="noopener noreferrer"
                           className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                           title="X (Twitter)">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                                <path
                                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://t.me/bridgehsu" target="_blank" rel="noopener noreferrer"
                           className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                           title="Telegram">
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                                <path
                                    d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.493l-3.002-2.21-1.449 1.394c-.16.16-.295.295-.605.295l.216-3.057 5.563-5.027c.242-.215-.053-.334-.376-.12l-6.877 4.33-2.962-.924c-.643-.204-.657-.643.135-.952l11.57-4.46c.536-.196 1.004.17 1.841.748z"/>
                            </svg>
                        </a>
                        <button onClick={onToggle}
                                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                                title="展开菜单">
                            <FiChevronsRight className="w-4 h-4"/>
                        </button>
                    </div>
                ) : (
                    /* 展开态：社交在左，收缩按钮在右 */
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <a href="https://x.com/thebridgehsu" target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05]"
                               title="X (Twitter)">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                                    <path
                                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="https://t.me/bridgehsu" target="_blank" rel="noopener noreferrer"
                               className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05]"
                               title="Telegram">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                                    <path
                                        d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.493l-3.002-2.21-1.449 1.394c-.16.16-.295.295-.605.295l.216-3.057 5.563-5.027c.242-.215-.053-.334-.376-.12l-6.877 4.33-2.962-.924c-.643-.204-.657-.643.135-.952l11.57-4.46c.536-.196 1.004.17 1.841.748z"/>
                                </svg>
                            </a>
                        </div>
                        <button onClick={onToggle}
                                className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05]"
                                title="收起菜单">
                            <FiChevronsLeft className="w-4 h-4"/>
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
