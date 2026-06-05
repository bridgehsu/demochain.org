import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {FiBook, FiChevronDown, FiChevronRight} from 'react-icons/fi';
import {getSectionManifestByPath} from '@/utils/section-manifest';
import {
    CurrentPathProps,
    DOCS_HOME_LINK_BASE_CLASS,
    DOCS_HOME_LINK_IDLE_CLASS,
    MOBILE_TOGGLE_CLASS,
    MobileSidebarProps,
    SIDEBAR_BUTTON_BASE_CLASS,
    SIDEBAR_BUTTON_IDLE_CLASS,
    SIDEBAR_ITEM_BASE_CLASS,
    SIDEBAR_ITEM_IDLE_CLASS,
    SIDEBAR_SECTION_TITLE,
    SidebarGroupHeaderProps,
    SidebarGroupProps,
    SidebarItemProps,
    isSectionHomePath,
    isSamePath,
} from './shared';

const SidebarItem = ({
    currentPath,
    href,
    title,
    activeClassName,
}: SidebarItemProps) => {
    const isActive = isSamePath(currentPath, href);
    const className = isActive
        ? `${SIDEBAR_ITEM_BASE_CLASS} font-medium ${activeClassName}`
        : `${SIDEBAR_ITEM_BASE_CLASS} ${SIDEBAR_ITEM_IDLE_CLASS}`;

    return (
        <Link href={href} className={className}>
            {title}
        </Link>
    );
};

const SidebarGroupHeader = ({
    group,
    isOpen,
    isActive,
    onToggle,
}: SidebarGroupHeaderProps) => {
    const headerClassName = isActive
        ? `${SIDEBAR_BUTTON_BASE_CLASS} ${group.color} ${group.activeBg}`
        : SIDEBAR_BUTTON_IDLE_CLASS;

    return (
        <button onClick={onToggle} className={headerClassName}>
            <Link
                href={group.rootHref}
                onClick={event => event.stopPropagation()}
                className="flex-1 text-left"
            >
                {group.label}
            </Link>
            {isOpen ? (
                <FiChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0"/>
            ) : (
                <FiChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0"/>
            )}
        </button>
    );
};

const SidebarGroupItems = ({group, currentPath}: SidebarGroupProps) => (
    <div className="mt-0.5 ml-3 pl-3 border-l border-gray-200 dark:border-gray-700 space-y-0.5">
        {group.items.map(item => (
            <SidebarItem
                key={item.href}
                currentPath={currentPath}
                href={item.href}
                title={item.title}
                activeClassName={`${group.color} ${group.activeBg}`}
            />
        ))}
    </div>
);

const SidebarGroup = ({group, currentPath}: SidebarGroupProps) => {
    const isGroupActive = currentPath.startsWith(group.rootHref);
    const [open, setOpen] = useState(isGroupActive);

    useEffect(() => {
        if (isGroupActive) {
            setOpen(true);
        }
    }, [isGroupActive]);

    return (
        <div className="mb-1">
            <SidebarGroupHeader
                group={group}
                isOpen={open}
                isActive={isGroupActive}
                onToggle={() => setOpen(value => !value)}
            />
            {open && <SidebarGroupItems group={group} currentPath={currentPath}/>}
        </div>
    );
};

const DocsHomeLink = ({currentPath}: CurrentPathProps) => {
    const section = getSectionManifestByPath(currentPath);
    const className = isSectionHomePath(currentPath, section)
        ? `${DOCS_HOME_LINK_BASE_CLASS} text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800`
        : DOCS_HOME_LINK_IDLE_CLASS;

    return (
        <Link href={section.homePath} className={className}>
            <FiBook className="w-4 h-4 shrink-0"/>
            {section.homeLabel}
        </Link>
    );
};

export const DocsSidebar = ({currentPath}: CurrentPathProps) => {
    const section = getSectionManifestByPath(currentPath);

    return (
        <nav className="space-y-0.5">
            <DocsHomeLink currentPath={currentPath}/>
            <div className="h-px bg-gray-200 dark:bg-gray-700 mb-2"/>
            {section.nav.map(group => (
                <SidebarGroup
                    key={group.consensus}
                    group={group}
                    currentPath={currentPath}
                />
            ))}
        </nav>
    );
};

export const MobileSidebar = ({currentPath, open, onToggle}: MobileSidebarProps) => (
    <div className="lg:hidden mb-4">
        <button onClick={onToggle} className={MOBILE_TOGGLE_CLASS}>
            <FiBook className="w-4 h-4"/>
            {SIDEBAR_SECTION_TITLE}
            <FiChevronDown className={`w-4 h-4 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`}/>
        </button>
        {open && (
            <div className="mt-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                <DocsSidebar currentPath={currentPath}/>
            </div>
        )}
    </div>
);

export const DesktopSidebar = ({currentPath}: CurrentPathProps) => (
    <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-24">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 mb-2">
                {SIDEBAR_SECTION_TITLE}
            </p>
            <DocsSidebar currentPath={currentPath}/>
        </div>
    </aside>
);
