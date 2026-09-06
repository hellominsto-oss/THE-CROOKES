import { useLang } from '@/contexts/LanguageContext';
import { RoundResultList } from '@/components/RoundResultList';
import { LanguageToggle } from '@/components/LanguageToggle';
import type { GameState } from '@/game/types';
import { MessageCircle } from 'lucide-react';

interface RoundResultScreenProps {
  state: GameState;
  onContinue: () => void;
}

export function RoundResultScreen({ state, onContinue }: RoundResultScreenProps) {
  const { t } = useLang();
  const silencedName = state.silencedPlayerId !== null
    ? state.players.find((p) => p.id === state.silencedPlayerId)?.name ?? null
    : null;

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <span className="chip bg-ink-700/80 text-gray-400">
          {t('round')} {state.currentRound} {t('roundOf')} {state.totalRounds}
        </span>
        <LanguageToggle />
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        <h2 className="text-3xl font-display font-bold text-gold-300 mb-6 text-center">
          {t('roundResult')}
        </h2>

        <RoundResultList changes={state.roundChanges} silencedName={silencedName} />

        <button onClick={onContinue} className="btn-primary w-full text-lg mt-8">
          {t('continue')}
        </button>
      </div>
    </div>
  );
}

interface DiscussionScreenProps {
  state: GameState;
  onStartVoting: () => void;
}

export function DiscussionScreen({ state, onStartVoting }: DiscussionScreenProps) {
  const { t } = useLang();
  const silencedName = state.silencedPlayerId !== null
    ? state.players.find((p) => p.id === state.silencedPlayerId)?.name ?? null
    : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-radial-gold">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl bg-gold-500/20 rounded-full" />
          <div className="relative w-24 h-24 rounded-full bg-ink-800 border-2 border-gold-600/50 flex items-center justify-center">
            <MessageCircle size={48} className="text-gold-400" />
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-display font-black text-gold-300 tracking-wide">
            {t('talkItOut')}
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto">
            {t('talkItOutHint')}
          </p>
        </div>

        {silencedName && (
          <div className="card-surface p-4 border-orange-700/30">
            <p className="text-orange-200 font-semibold text-sm">
              {t('wasSilenced', { name: silencedName })}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="card-surface p-3 flex items-center justify-between text-sm">
            <span className="text-gray-400">{t('round')}</span>
            <span className="text-gold-300 font-bold">
              {state.currentRound} / {state.totalRounds}
            </span>
          </div>
        </div>

        <button onClick={onStartVoting} className="btn-primary text-lg w-full max-w-xs">
          {t('startVoting')}
        </button>
      </div>
    </div>
  );
}
