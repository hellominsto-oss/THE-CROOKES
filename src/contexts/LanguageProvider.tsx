import { useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { LanguageContext, makeT } from './LanguageContext';
import type { Language } from '@/game/types';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  const setLang = useCallback((l: Language) => {
    setLangState(l);
  }, []);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';
  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const value = useMemo(
    () => ({ lang, setLang, t, dir }),
    [lang, setLang, t, dir],
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={dir} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}
