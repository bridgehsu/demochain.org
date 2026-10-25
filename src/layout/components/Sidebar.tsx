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
import Theme from './Theme';
import useTheme from './useTheme';
import Logo from '@/components/Logo';
import LogoIcon from '@/components/Icons/LogoIcon';

interface SidebarProps {
    themeControls: ReturnType<typeof useTheme>;
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

export default function Sidebar({collapsed, onToggle, themeControls}: SidebarProps): React.ReactElement {
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
            className={`hidden md:flex flex-col shrink-0 fixed left-0 top-0 h-full z-30 border-r border-gray-100 dark:border-[#303034] bg-white dark:bg-[#19191c] transition-all duration-300 ${collapsed ? 'w-14' : 'w-56'}`}>

            {/* Logo 区域 */}
            <div
                className={`flex items-center shrink-0 py-4 border-b border-gray-100 dark:border-[#303034] ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
                {collapsed ? <LogoIcon className="w-8 h-8"/> : <Logo/>}
            </div>

            {/* 导航滚动区 */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 px-2">
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
                                                    ? `text-accent bg-[color:var(--accent-soft)] ring-1 ring-black/[0.04] dark:ring-white/[0.08]`
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
                                                    ? `text-accent bg-[color:var(--accent-soft)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
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
                                        <div className="mt-1 ml-3 pl-3 border-l-2 border-gray-100/60 dark:border-white/[0.03] space-y-0.5">
                                            {docGroup.items.map(item => {
                                                const isItemActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                            isItemActive
                                                                ? `text-accent font-bold bg-[color:var(--accent-soft)] ring-1 ring-black/[0.04] dark:ring-white/10`
                                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                                                        }`}
                                                    >
                                                        {isItemActive && (
                                                            <div className={`absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${cfg.dot}`}/>
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
                                                ? `text-accent bg-[color:var(--accent-soft)] ring-1 ring-black/[0.04] dark:ring-white/[0.08]`
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
                                                ? `text-accent bg-[color:var(--accent-soft)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
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
                                        className="mt-1 ml-3 pl-3 border-l-2 border-gray-100/60 dark:border-white/[0.03] space-y-0.5">
                                        {items.map(item => {
                                            const isItemActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                        isItemActive
                                                            ? `text-accent font-bold bg-[color:var(--accent-soft)] ring-1 ring-black/[0.04] dark:ring-white/10`
                                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                                                    }`}
                                                >
                                                    {isItemActive && (
                                                        <div
                                                            className={`absolute -left-[14px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${cfg.dot}`}/>
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

            <div className={`shrink-0 border-t border-gray-100 dark:border-[#303034] p-2 flex gap-2 ${collapsed ? 'flex-col items-center' : 'items-center justify-between'}`}>
                <Theme {...themeControls} placement="top" showLabel={false}/>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={collapsed ? '展开菜单' : '收起菜单'}
                    aria-expanded={!collapsed}
                    title={collapsed ? '展开菜单' : '收起菜单'}
                    className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/[0.05] transition-colors"
                >
                    {collapsed ? <FiChevronsRight className="w-4 h-4"/> : <FiChevronsLeft className="w-4 h-4"/>}
                </button>
            </div>
        </aside>
    );
}
