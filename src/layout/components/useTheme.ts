import {useEffect, useRef, useState} from 'react';

export default function useTheme() {
    // 服务端与首屏客户端保持一致，避免 hydration mismatch
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
    const [systemDark, setSystemDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
            setTheme(saved);
        }
        setIsMounted(true);
    }, []);

    const isDarkMode = isMounted ? (theme === 'dark' || (theme === 'system' && systemDark)) : null;

    const themeRef = useRef(theme);
    themeRef.current = theme;

    useEffect(() => {
        if (!isMounted) return;
        const root = document.documentElement;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const isDark = theme === 'dark' || (theme === 'system' && mq.matches);
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme, systemDark, isMounted]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        setSystemDark(mq.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setSystemDark(e.matches);
            if (themeRef.current === 'system') {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        };

        if (mq.addEventListener) {
            mq.addEventListener('change', handleChange);
            return () => mq.removeEventListener('change', handleChange);
        }

        mq.addListener(handleChange);
        return () => mq.removeListener(handleChange);
    }, []);

    return {theme, setTheme, isDarkMode};
}
