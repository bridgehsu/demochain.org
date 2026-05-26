import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FiChevronRight, FiActivity, FiExternalLink} from 'react-icons/fi';
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
                                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                        isActive
                                            ? `${cfg.switcherActive} ${cfg.activeBg} shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] dark:ring-white/[0.05]`
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 flex-1 text-left">
                                        <div className={`relative flex items-center justify-center w-5 h-5`}>
                                            <span className={`w-2 h-2 rounded-full shrink-0 transition-all duration-300 ${cfg.dot} ${isActive ? 'scale-125 shadow-[0_0_10px_rgba(0,0,0,0.15)] dark:shadow-[0_0_8px_rgba(255,255,255,0.2)]' : 'opacity-30'}`}/>
                                            {isActive && <span className={`absolute inset-0 rounded-full animate-ping opacity-15 ${cfg.dot}`}/>}
                                        </div>
                                        <span className="tracking-tight">{cfg.label} 机制</span>
                                    </div>
                                    <FiChevronRight
                                        className={`w-4 h-4 opacity-25 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90 opacity-60' : 'group-hover:opacity-60'}`}/>
                                </button>

                                {isExpanded && (
                                    <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100/60 dark:border-white/[0.03] space-y-1 relative transition-all">
                                        {items.map(item => {
                                            const isItemActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                                                        isItemActive
                                                            ? `${cfg.accent} font-bold ${cfg.activeBg} shadow-[0_1px_4px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.04] dark:ring-white/10`
                                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/[0.02]'
                                                    }`}
                                                >
                                                    {/* 活动项侧边指示器 */}
                                                    {isItemActive && (
                                                        <div className={`absolute -left-[18px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full ${cfg.dot} shadow-[0_0_8px_rgba(0,0,0,0.08)]`}/>
                                                    )}
                                                    
                                                    <span className={`flex items-center justify-center w-5 h-5 transition-transform duration-300 ${isItemActive ? 'scale-110 opacity-100' : 'opacity-40 group-hover:opacity-80 group-hover:scale-105'}`}>
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
            <div className="p-6 mt-auto border-t border-gray-50 dark:border-white/[0.03]">
                <div className="flex items-center justify-center gap-4">
                    {/* X (Twitter) Link */}
                    <a 
                        href="https://x.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05] hover:shadow-sm"
                        title="X (Twitter)"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4.5 h-4.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                    </a>
                    {/* Telegram Link */}
                    <a 
                        href="https://t.me" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:scale-110 border border-gray-100 dark:border-white/[0.05] hover:shadow-sm"
                        title="Telegram"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.493l-3.002-2.21-1.449 1.394c-.16.16-.295.295-.605.295l.216-3.057 5.563-5.027c.242-.215-.053-.334-.376-.12l-6.877 4.33-2.962-.924c-.643-.204-.657-.643.135-.952l11.57-4.46c.536-.196 1.004.17 1.841.748z"/></svg>
                    </a>
                </div>
            </div>
        </aside>
    );
}
