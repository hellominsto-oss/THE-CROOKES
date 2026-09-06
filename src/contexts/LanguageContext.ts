import { createContext, useContext } from 'react';
import type { Language } from '@/game/types';
import { translate } from '@/game/translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

export function makeT(lang: Language) {
  return (key: string, params?: Record<string, string | number>) => translate(lang, key, params);
}
