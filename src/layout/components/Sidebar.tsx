import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FiChevronRight, FiActivity, FiGithub, FiExternalLink} from 'react-icons/fi';
import {ALL_MENUS, CONSENSUS_CONFIG, CONSENSUS_ORDER, CONSENSUS_ENTRY, getActiveConsensus, type Consensus} from './Menu';
import Logo from '@/components/Logo';

export default function Sidebar(): React.ReactElement {
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

    const activeConsensus = isMounted ? getActiveConsensus(pathname) : 'POW';

    useEffect(() => {
        if (!isMounted) return;
        setExpanded(prev => ({...prev, [activeConsensus]: true}));
    }, [activeConsensus, isMounted]);

    const toggle = (c: Consensus) => {
        setExpanded(prev => ({...prev, [c]: !prev[c]}));
    };

    return (
        <aside className="hidden md:flex flex-col w-64 shrink-0 fixed left-0 top-0 h-full z-30 border-r border-gray-100 dark:border-[#1c1e25] bg-white dark:bg-[#0d0e12] transition-all duration-300">
            {/* Logo 区域 */}
            <div className="flex items-center px-6 py-5 shrink-0">
                <Logo/>
            </div>

            {/* 导航滚动区 */}
            <div className="flex-1 overflow-y-auto py-2 px-3 custom-scrollbar">
                <nav className="space-y-1">
                    {isMounted && CONSENSUS_ORDER.map(c => {
                        const cfg = CONSENSUS_CONFIG[c];
                        const items = ALL_MENUS[c];
                        const isActive = c === activeConsensus;
                        const isExpanded = expanded[c] ?? isActive;

                        return (
                            <div key={c} className="mb-2">
                                <button
                                    onClick={() => toggle(c)}
                                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                                        isActive
                                            ? `${cfg.switcherActive} bg-gray-50 dark:bg-white/[0.03] ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 flex-1 text-left">
                                        <div className={`relative flex items-center justify-center w-5 h-5`}>
                                            <span className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${cfg.dot} ${isActive ? 'scale-125 shadow-[0_0_8px_rgba(0,0,0,0.2)] dark:shadow-[0_0_8px_rgba(255,255,255,0.2)]' : 'opacity-40'}`}/>
                                            {isActive && <span className={`absolute inset-0 rounded-full animate-ping opacity-20 ${cfg.dot}`}/>}
                                        </div>
                                        <span className="tracking-tight">{cfg.label} 机制</span>
                                    </div>
                                    <FiChevronRight
                                        className={`w-4 h-4 opacity-30 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90 opacity-60' : 'group-hover:opacity-60'}`}/>
                                </button>

                                {isExpanded && (
                                    <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-50 dark:border-white/[0.03] space-y-1 relative">
                                        {items.map(item => {
                                            const isItemActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                        isItemActive
                                                            ? `${cfg.accent} font-bold bg-white dark:bg-white/[0.05] shadow-sm ring-1 ring-black/5 dark:ring-white/10`
                                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                                    }`}
                                                >
                                                    {/* 活动项侧边指示器 */}
                                                    {isItemActive && (
                                                        <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${cfg.dot} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}/>
                                                    )}
                                                    
                                                    <span className={`flex items-center justify-center w-5 h-5 transition-transform duration-200 ${isItemActive ? 'scale-110 opacity-100' : 'opacity-50 group-hover:opacity-80 group-hover:scale-105'}`}>
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

            {/* 底部按钮区域 */}
            <div className="p-4 mt-auto border-t border-gray-50 dark:border-white/[0.03]">
                <div className="flex items-center justify-between gap-3">
                    <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-105 border border-gray-100 dark:border-white/[0.05]"
                        title="GitHub 仓库"
                    >
                        <FiGithub className="w-5 h-5"/>
                    </a>
                    <div className="flex-1 text-[10px] font-medium text-gray-400 dark:text-gray-500 text-right px-1">
                        v1.0.0 DemoChain
                    </div>
                </div>
            </div>
        </aside>
    );
}
