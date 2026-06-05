import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FiChevronRight, FiChevronsLeft, FiChevronsRight} from 'react-icons/fi';
import {COINEX_NAV} from '@/utils/coinex-manifest';
import Logo from '@/components/Logo';
import LogoIcon from '@/components/Icons/LogoIcon';

interface CoinexSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function CoinexSidebar({collapsed, onToggle}: CoinexSidebarProps): React.ReactElement {
    const router = useRouter();
    const [pathname, setPathname] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>(
        () => Object.fromEntries(COINEX_NAV.map(g => [g.consensus, true]))
    );

    useEffect(() => {
        setIsMounted(true);
        setPathname(router.asPath.split('?')[0]);
    }, [router.asPath]);

    useEffect(() => {
        if (!isMounted) return;
        const activeGroup = COINEX_NAV.find(g => pathname.startsWith(g.rootHref));
        if (activeGroup) {
            setExpanded(prev => ({...prev, [activeGroup.consensus]: true}));
        }
    }, [pathname, isMounted]);

    const toggle = (key: string) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };

    return (
        <aside
            className={`hidden md:flex flex-col shrink-0 fixed left-0 top-0 h-full z-30 border-r border-gray-100 dark:border-[#1c1e25] bg-white dark:bg-[#0d0e12] transition-all duration-300 overflow-hidden ${collapsed ? 'w-14' : 'w-64'}`}>

            {/* Logo */}
            <div
                className={`flex items-center shrink-0 py-4 border-b border-gray-100 dark:border-[#1c1e25] ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
                {collapsed ? <LogoIcon className="w-8 h-8"/> : <Logo/>}
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2">
                        CoinEX 文档
                    </p>
                )}
                <nav className="space-y-1">
                    {isMounted && COINEX_NAV.map(group => {
                        const isGroupActive = pathname.startsWith(group.rootHref);
                        const isExpanded = expanded[group.consensus] ?? isGroupActive;

                        return (
                            <div key={group.consensus} className="mb-1">
                                {collapsed ? (
                                    <Link
                                        href={group.rootHref}
                                        title={group.label}
                                        className={`flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all duration-200 ${
                                            isGroupActive
                                                ? `${group.color} ${group.activeBg} ring-1 ring-black/[0.04] dark:ring-white/[0.08]`
                                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <span className="text-xs font-bold">{group.label.slice(0, 1)}</span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => toggle(group.consensus)}
                                        className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                            isGroupActive
                                                ? `${group.color} ${group.activeBg} ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <span className="flex-1 text-left tracking-tight">{group.label}</span>
                                        <FiChevronRight
                                            className={`w-4 h-4 opacity-25 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90 opacity-60' : 'group-hover:opacity-60'}`}/>
                                    </button>
                                )}

                                {!collapsed && isExpanded && (
                                    <div
                                        className="mt-1 ml-4 pl-4 border-l-2 border-gray-100/60 dark:border-white/[0.03] space-y-0.5">
                                        {group.items.map(item => {
                                            const isItemActive = pathname === item.href || pathname === `${item.href}/`;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                        isItemActive
                                                            ? `${group.color} font-bold ${group.activeBg} ring-1 ring-black/[0.04] dark:ring-white/10`
                                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                                                    }`}
                                                >
                                                    {isItemActive && (
                                                        <div
                                                            className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${group.color.replace('text-', 'bg-').replace(' dark:text-', ' dark:bg-')}`}/>
                                                    )}
                                                    {item.title}
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

            {/* Bottom: collapse toggle */}
            <div className="px-3 py-3 mt-auto border-t border-gray-100 dark:border-white/[0.03]">
                {collapsed ? (
                    <button
                        onClick={onToggle}
                        className="flex items-center justify-center w-8 h-8 mx-auto rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                        title="展开菜单">
                        <FiChevronsRight className="w-4 h-4"/>
                    </button>
                ) : (
                    <div className="flex justify-end">
                        <button
                            onClick={onToggle}
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
