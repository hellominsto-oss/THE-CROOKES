import { useLang } from '@/contexts/LanguageContext';
import { Hand, Eye, EyeOff } from 'lucide-react';
import type { ReactNode } from 'react';

interface PassPhoneProps {
  playerName: string;
  onReady: () => void;
  readyLabel?: string;
  children?: ReactNode;
  showContent: boolean;
  onHide?: () => void;
  variant?: 'reveal' | 'action';
}

export function PassPhone({
  playerName,
  onReady,
  readyLabel,
  children,
  showContent,
  onHide,
  variant = 'action',
}: PassPhoneProps) {
  const { t } = useLang();

  if (!showContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 animate-fade-in px-6">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gold-500/20 rounded-full" />
          <div className="relative w-28 h-28 rounded-full bg-ink-800 border-2 border-gold-600/50 flex items-center justify-center animate-pulse-glow">
            <Hand size={48} className="text-gold-400" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
            {t('passPhoneTo')}
          </p>
          <h2 className="text-3xl font-display font-bold text-gold-300">
            {playerName}
          </h2>
        </div>
        <button onClick={onReady} className="btn-primary text-lg min-w-[200px]">
          {readyLabel ?? t('imReady')}
        </button>
        <p className="text-gray-500 text-xs max-w-xs text-center">
          {variant === 'reveal'
            ? t('roleRevealHint')
            : t('passToNext')}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {children}
      {onHide && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onHide}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm transition-colors"
          >
            <EyeOff size={16} />
            {t('hideInfo')}
          </button>
        </div>
      )}
    </div>
  );
}

export function PrivacyShield({
  show,
  onReveal,
  children,
}: {
  show: boolean;
  onReveal: () => void;
  children: ReactNode;
}) {
  const { t } = useLang();

  if (!show) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <button
          onClick={onReveal}
          className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-lg font-semibold"
        >
          <Eye size={24} />
          {t('tapToReveal')}
        </button>
      </div>
    );
  }

  return <div className="animate-scale-in">{children}</div>;
}
