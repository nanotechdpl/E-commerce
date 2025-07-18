'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

export interface SidebarContextInterface {
    openSidebar: boolean;
    setOpenSidebar: (state: boolean) => void;
}

export interface ThemeContextInterface {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

export const SidebarContext = createContext({} as SidebarContextInterface);
export const ThemeContext = createContext({} as ThemeContextInterface);

type Props = {
    children: ReactNode;
};

export const ColorTheme = {
    light: 'light',
    dark: 'dark'
};

const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('color-theme') as keyof typeof ColorTheme;
        if (typeof storedPrefs === 'string' && storedPrefs in ColorTheme) {
            return storedPrefs;
        }

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'dark';
        }
    }

    return 'light'; // light theme as the default;
};

export default function SidebarProvider({ children }: Props) {
    const [openSidebar, setOpenSidebar] = useState<boolean>(true);
    const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);

    useEffect(() => {
        const handleResize = () => {
            setOpenSidebar(window.innerWidth < 1200 ? false : true);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const rawSetTheme = (rawTheme: string) => {
        const root = window.document.documentElement;
        const isDark = rawTheme === 'dark';

        root.classList.remove(isDark ? 'light' : 'dark');
        root.classList.add(rawTheme);

        localStorage.setItem('color-theme', rawTheme);
    };

    useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);

    return (
        <SidebarContext.Provider
            value={{
                openSidebar,
                setOpenSidebar,
            }}
        >
            <ThemeContext.Provider
                value={{
                    theme,
                    setTheme,
                }}
            >
                {children}
            </ThemeContext.Provider>
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    return useContext(SidebarContext);
}
