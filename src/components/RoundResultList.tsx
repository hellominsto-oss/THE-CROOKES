import { useLang } from '@/contexts/LanguageContext';
import { CoinAmount } from './CoinIcon';
import type { RoundChange } from '@/game/types';
import { TrendingDown, TrendingUp, VolumeX } from 'lucide-react';

export function RoundResultList({
  changes,
  silencedName,
}: {
  changes: RoundChange[];
  silencedName: string | null;
}) {
  const { t } = useLang();

  return (
    <div className="space-y-3">
      {changes.length === 0 ? (
        <p className="text-gray-400 text-center py-6">{t('noChanges')}</p>
      ) : (
        changes.map((c, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl p-4 border ${
              c.delta < 0
                ? 'bg-blood-900/20 border-blood-700/30'
                : 'bg-emerald-900/20 border-emerald-600/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {c.delta < 0 ? (
                <TrendingDown size={20} className="text-blood-400" />
              ) : (
                <TrendingUp size={20} className="text-emerald-400" />
              )}
              <span className="font-semibold text-gray-100">{c.playerName}</span>
            </div>
            <CoinAmount amount={c.delta} delta size="lg" />
          </div>
        ))
      )}

      {silencedName && (
        <div className="flex items-center gap-3 rounded-xl p-4 bg-orange-900/20 border border-orange-700/30">
          <VolumeX size={20} className="text-orange-400" />
          <span className="text-orange-200 font-semibold">
            {t('wasSilenced', { name: silencedName })}
          </span>
        </div>
      )}

      {!silencedName && (
        <p className="text-gray-500 text-sm text-center">{t('noOneSilenced')}</p>
      )}
    </div>
  );
}
