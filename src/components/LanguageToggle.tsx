import { useLang } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';
import type { Language } from '@/game/types';

export function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="inline-flex items-center gap-1 bg-ink-800/80 border border-ink-600/60 rounded-full p-1">
      <Languages size={16} className="text-gray-500 mx-2" />
      {(['en', 'ar'] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
            lang === l
              ? 'bg-gold-500 text-ink-950'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {l === 'en' ? 'EN' : 'ع'}
        </button>
      ))}
    </div>
  );
}
