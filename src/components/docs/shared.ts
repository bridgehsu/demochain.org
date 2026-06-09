import {type ReactNode} from 'react';
import {type DocNavGroup} from '@/utils/docs-manifest';
import {type SectionManifest} from '@/utils/section-manifest';

export interface DocsLayoutProps {
    children: ReactNode;
    demoHref?: string | null;
    demoLabel?: string | null;
}

export interface CurrentPathProps {
    currentPath: string;
}

export interface SidebarItemProps extends CurrentPathProps {
    href: string;
    title: string;
    activeClassName: string;
}

export interface SidebarGroupProps extends CurrentPathProps {
    group: DocNavGroup;
}

export interface SidebarGroupHeaderProps {
    group: DocNavGroup;
    isOpen: boolean;
    isActive: boolean;
    onToggle: () => void;
}

export interface MobileSidebarProps extends CurrentPathProps {
    open: boolean;
    onToggle: () => void;
}

export const SIDEBAR_SECTION_TITLE = '文档目录';
export const DEMO_LABEL = '去演示';
export const SECTION_SWITCHER_TITLE = '内容分区';

export const SIDEBAR_ITEM_BASE_CLASS = 'block px-2 py-1.5 rounded-md text-sm transition-colors';
export const SIDEBAR_ITEM_IDLE_CLASS = 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800';
export const SIDEBAR_BUTTON_BASE_CLASS = 'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors';
export const SIDEBAR_BUTTON_IDLE_CLASS = `${SIDEBAR_BUTTON_BASE_CLASS} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`;
export const DOCS_HOME_LINK_BASE_CLASS = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2';
export const DOCS_HOME_LINK_IDLE_CLASS = `${DOCS_HOME_LINK_BASE_CLASS} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800`;
export const MOBILE_TOGGLE_CLASS = 'flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';
export const DEMO_LINK_CLASS = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors';
export const SECTION_SWITCHER_LINK_CLASS = 'flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors';
export const SECTION_SWITCHER_LINK_IDLE_CLASS = `${SECTION_SWITCHER_LINK_CLASS} text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800 hover:text-gray-900 dark:hover:text-white`;
export const SECTION_SWITCHER_LINK_ACTIVE_CLASS = `${SECTION_SWITCHER_LINK_CLASS} text-white bg-gray-900 dark:bg-white dark:text-gray-900`;

export const isSamePath = (currentPath: string, href: string) => (
    currentPath === href || currentPath === `${href}/`
);

export const isSectionHomePath = (currentPath: string, section: SectionManifest) => (
    isSamePath(currentPath, section.homePath)
);
