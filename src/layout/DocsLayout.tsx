import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {DOC_NAV, DocNavGroup} from '@/utils/docs-manifest';
import {FiBook, FiChevronDown, FiChevronRight, FiExternalLink} from 'react-icons/fi';

interface DocsLayoutProps {
    children: React.ReactNode;
    demoHref?: string | null;
    demoLabel?: string | null;
}
function SidebarGroup({group, currentPath}: {group: DocNavGroup; currentPath: string}) {
    const isGroupActive = currentPath.startsWith(group.rootHref);
    const [open, setOpen] = useState(isGroupActive);

    return (
        <div className="mb-1">
            {/* Group header — links to overview + expands */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isGroupActive
                        ? `${group.color} ${group.activeBg}`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <Link
                    href={group.rootHref}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 text-left"
                >
                    {group.label}
                </Link>
                {open
                    ? <FiChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0"/>
                    : <FiChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0"/>
                }
            </button>

            {open && (
                <div className="mt-0.5 ml-3 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-0.5">
                    {group.items.map(item => {
                        const isActive = currentPath === item.href || currentPath === item.href + '/';
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block px-2 py-1.5 rounded-md text-sm transition-colors ${
                                    isActive
                                        ? `font-medium ${group.color} ${group.activeBg}`
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function DocsSidebar({currentPath}: {currentPath: string}) {
    return (
        <nav className="space-y-0.5">
            {/* 首页 */}
            <Link
                href="/docs"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
                    currentPath === '/docs' || currentPath === '/docs/'
                        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <FiBook className="w-4 h-4 shrink-0"/>
                文档首页
            </Link>
            <div className="h-px bg-gray-200 dark:bg-gray-700 mb-2"/>
            {DOC_NAV.map(group => (
                <SidebarGroup key={group.consensus} group={group} currentPath={currentPath}/>
            ))}
        </nav>
    );
}

export default function DocsLayout({children, demoHref, demoLabel}: DocsLayoutProps) {
    const router = useRouter();
    const currentPath = router.asPath.split('?')[0];
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="flex gap-6 xl:gap-8">
            <main className="flex-1 min-w-0">
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setMobileSidebarOpen(v => !v)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiBook className="w-4 h-4"/>
                        文档目录
                        <FiChevronDown className={`w-4 h-4 opacity-50 transition-transform ${mobileSidebarOpen ? 'rotate-180' : ''}`}/>
                    </button>
                    {mobileSidebarOpen && (
                        <div className="mt-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                            <DocsSidebar currentPath={currentPath}/>
                        </div>
                    )}
                </div>

                {children}

                {demoHref && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            href={demoHref}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
                        >
                            <FiExternalLink className="w-4 h-4"/>
                            {demoLabel || '去演示'}
                        </Link>
                    </div>
                )}
            </main>

            <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-24">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2">文档目录</p>
                    <DocsSidebar currentPath={currentPath}/>
                </div>
            </aside>
        </div>
    );
}
