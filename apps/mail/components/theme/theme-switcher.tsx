'use client';

import { type MessageKey } from '@/config/navigation';
import type { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import system from '@/public/assets/system-mode.svg';
import light from '@/public/assets/light-mode.svg';
import dark from '@/public/assets/dark-mode.svg';

interface ModeToggleProps {
  className?: string;
}

interface ThemeItem {
  name: string;
  title: MessageKey;
  src: StaticImageData;
  alt: string;
}

const themes: ThemeItem[] = [
  {
    name: 'light',
    title: 'common.themes.light',
    src: light,
    alt: 'Light mode',
  },
  {
    name: 'dark',
    title: 'common.themes.dark',
    src: dark,
    alt: 'Dark mode',
  },
  {
    name: 'system',
    title: 'common.themes.system',
    src: system,
    alt: 'System mode',
  },
];

export function ModeToggle({ className }: ModeToggleProps) {
  const [mounted, setMounted] = useState(false);

  const t = useTranslations();

  // Fixes SSR hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const { theme, systemTheme, resolvedTheme, setTheme } = useTheme();

  async function handleThemeChange(newTheme: string) {
    let nextResolvedTheme = newTheme;

    if (newTheme === 'system' && systemTheme) {
      nextResolvedTheme = systemTheme;
    }

    function update() {
      setTheme(newTheme);
    }

    if (document.startViewTransition && nextResolvedTheme !== resolvedTheme) {
      document.documentElement.style.viewTransitionName = 'theme-transition';
      await document.startViewTransition(update).finished;
      document.documentElement.style.viewTransitionName = '';
    } else {
      update();
    }
  }

  if (!mounted) {
    return <div className="h-9" />;
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {themes.map((themeItem) => (
        <button
          key={themeItem.name}
          onClick={() => handleThemeChange(themeItem.name)}
          title={t(themeItem.title)}
          className="flex flex-col items-start gap-2"
        >
          <Image
            src={themeItem.src}
            alt={themeItem.alt}
            className={cn(
              'h-[60px] w-full rounded-xl transition-opacity hover:opacity-80 sm:h-[75px] md:h-[100px] lg:h-[120px]',
              theme === themeItem.name && 'object-cover ring-2 ring-blue-500',
            )}
          />
          <span className="text-sm">{t(themeItem.title)}</span>
        </button>
      ))}
    </div>
  );
}
