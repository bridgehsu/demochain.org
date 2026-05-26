import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FiChevronRight} from 'react-icons/fi';
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
        <aside className="hidden md:flex flex-col w-56 shrink-0 fixed left-0 top-0 h-full z-30 border-r border-gray-200/80 dark:border-[#1c1e25] bg-white/95 dark:bg-[#0d0e12] backdrop-blur">
            {/* Logo 区域 — 与右侧 header 等高 */}
            <div className="flex items-center px-4 py-4 border-b border-gray-200/80 dark:border-[#1c1e25] shrink-0">
                <Logo/>
            </div>

            {/* 导航滚动区 */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
                <nav className="space-y-0.5">
                    {isMounted && CONSENSUS_ORDER.map(c => {
                        const cfg = CONSENSUS_CONFIG[c];
                        const items = ALL_MENUS[c];
                        const isActive = c === activeConsensus;
                        const isExpanded = expanded[c] ?? isActive;

                        return (
                            <div key={c}>
                                <button
                                    onClick={() => toggle(c)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        isActive
                                            ? `${cfg.accent} bg-black/5 dark:bg-white/8`
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <Link
                                        href={CONSENSUS_ENTRY[c]}
                                        onClick={e => e.stopPropagation()}
                                        className="flex items-center gap-2 flex-1 text-left"
                                    >
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`}/>
                                        {cfg.label}
                                    </Link>
                                    <FiChevronRight
                                        className={`w-3.5 h-3.5 opacity-50 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`}/>
                                </button>

                                {isExpanded && (
                                    <div className="mt-0.5 ml-3 pl-3 border-l border-gray-200 dark:border-[#1c1e25] space-y-0.5 mb-1">
                                        {items.map(item => {
                                            const isItemActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-all ${
                                                        isItemActive
                                                            ? `${cfg.accent} font-medium bg-black/5 dark:bg-white/8`
                                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                                >
                                                    {item.icon}
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
        </aside>
    );
}
