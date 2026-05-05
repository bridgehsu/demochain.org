import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Logo from "@/components/Logo";
import Menu, {MENUS} from './Menu';
import Theme from "@/layout/components/Theme";

export default function Header(): React.ReactElement {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
        if (typeof window === 'undefined') return 'system';
        return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    });

    const [systemDark, setSystemDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [currentPathname, setCurrentPathname] = useState('');

    const router = useRouter();

    const menuItems = MENUS;

    useEffect(() => {
        setIsMounted(true);
        setCurrentPathname(router.pathname);
    }, [router.pathname]);

    const isDarkMode = isMounted ? (theme === 'dark' || (theme === 'system' && systemDark)) : null;

    useEffect(() => {
        if (typeof window === 'undefined' || !isMounted) return;

        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemDark(mediaQuery.matches);

        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
            root.classList.toggle('dark', isDark);
        };

        applyTheme();
        localStorage.setItem('theme', theme);

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            setSystemDark(e.matches);
            if (theme === 'system') {
                root.classList.toggle('dark', e.matches);
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
            return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.addListener(handleSystemThemeChange);
            return () => mediaQuery.removeListener(handleSystemThemeChange);
        }
    }, [theme, isMounted]);

    return (
        <header
            className="sticky top-0 z-40 relative py-4 border-b border-gray-100 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-[#121212]/85">
            <div
                className="px-4 lg:px-12 max-w-screen-2xl mx-auto w-full relative flex justify-between items-center">
                <div className="flex items-center flex-1">
                    <Logo/>
                    <div className="hidden md:flex flex-1 justify-end mr-3">
                        {isMounted && (
                            <Menu
                                currentPathname={currentPathname}
                                menuItems={menuItems}
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                    <Theme
                        theme={theme}
                        setTheme={setTheme}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
        </header>
    );
}
