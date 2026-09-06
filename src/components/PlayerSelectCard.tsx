import { useLang } from '@/contexts/LanguageContext';
import { CoinIcon } from './CoinIcon';
import type { Player } from '@/game/types';
import { Check, X, VolumeX } from 'lucide-react';

interface PlayerSelectCardProps {
  player: Player;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showRole?: boolean;
  showBalance?: boolean;
  showSilenced?: boolean;
  showEliminated?: boolean;
  size?: 'sm' | 'md';
}

export function PlayerSelectCard({
  player,
  selected,
  onClick,
  disabled,
  showRole = false,
  showBalance = false,
  showSilenced = false,
  showEliminated = false,
  size = 'md',
}: PlayerSelectCardProps) {
  const { t } = useLang();
  const padding = size === 'sm' ? 'p-3' : 'p-4';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${padding} rounded-xl border-2 transition-all text-left ${
        selected
          ? 'border-gold-500 bg-gold-900/30 shadow-lg shadow-gold-900/20'
          : disabled
            ? 'border-ink-600/40 bg-ink-800/40 opacity-50 cursor-not-allowed'
            : 'border-ink-600/60 bg-ink-800/80 hover:border-gold-600/40 hover:bg-ink-700/80'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {selected && <Check size={20} className="text-gold-400 shrink-0" />}
          <div className="min-w-0">
            <p className={`font-semibold text-gray-100 truncate ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
              {player.name}
            </p>
            {showRole && (
              <p className={`text-xs ${player.role === 'crook' ? 'text-blood-400' : 'text-emerald-400'}`}>
                {player.role === 'crook' ? t('crook') : t('citizen')}
              </p>
            )}
            {showSilenced && (
              <p className="text-xs text-orange-400 flex items-center gap-1">
                <VolumeX size={12} /> {t('wasSilenced', { name: '' }).replace('  ', ' ')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showBalance && (
            <span className="inline-flex items-center gap-1 text-gold-300 font-bold text-sm">
              <CoinIcon size={14} className="text-gold-400" />
              {player.balance}
            </span>
          )}
          {showEliminated && !player.alive && (
            <X size={18} className="text-blood-500" />
          )}
        </div>
      </div>
    </button>
  );
}
