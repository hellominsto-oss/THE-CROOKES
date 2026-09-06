import { useLang } from '@/contexts/LanguageContext';
import { CoinAmount } from '@/components/CoinIcon';
import type { GameState } from '@/game/types';
import { Shield, Skull, Coins, ArrowRight } from 'lucide-react';

interface EliminationScreenProps {
  state: GameState;
  onContinue: () => void;
}

export function EliminationScreen({ state, onContinue }: EliminationScreenProps) {
  const { t } = useLang();
  const eliminated = state.players.find((p) => p.id === state.eliminatedPlayerId);
  if (!eliminated) return null;

  const isCrook = eliminated.role === 'crook';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-radial-blood">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in-up">
        <div className="relative inline-block">
          <div className={`absolute inset-0 blur-3xl rounded-full ${isCrook ? 'bg-blood-500/30' : 'bg-emerald-500/20'}`} />
          <div className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center ${
            isCrook ? 'bg-blood-900/40 border-blood-600/50' : 'bg-emerald-900/30 border-emerald-600/40'
          }`}>
            {isCrook ? <Skull size={48} className="text-blood-400" /> : <Shield size={48} className="text-emerald-400" />}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-gray-100">
            {t('eliminated', { name: eliminated.name })}
          </h2>
          <p className={`text-xl font-display font-bold mt-3 ${
            isCrook ? 'text-blood-300' : 'text-emerald-300'
          }`}>
            {isCrook ? t('wasCrook', { name: eliminated.name }) : t('wasCitizen', { name: eliminated.name })}
          </p>
        </div>

        <button onClick={onContinue} className="btn-primary w-full text-lg">
          {t('continue')}
        </button>
      </div>
    </div>
  );
}

interface RewardScreenProps {
  state: GameState;
  onContinue: () => void;
}

export function RewardScreen({ state, onContinue }: RewardScreenProps) {
  const { t } = useLang();
  const eliminated = state.players.find((p) => p.id === state.eliminatedPlayerId);
  if (!eliminated) return null;

  const isCrook = eliminated.role === 'crook';
  const hasRecipients = state.rewardRecipients.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
      <div className="max-w-md w-full space-y-6 animate-fade-in-up">
        <div className="text-center">
          <Coins size={40} className="text-gold-400 mx-auto mb-3" />
          <h2 className="text-2xl font-display font-bold text-gold-300">{t('rewardTitle')}</h2>
          <p className="text-gray-400 text-sm mt-2">
            {isCrook ? t('crookEliminatedReward') : t('citizenEliminatedReward')}
          </p>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">{t('balance')}</span>
            <CoinAmount amount={eliminated.balance} size="lg" />
          </div>

          {hasRecipients ? (
            <>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mb-3">
                <span>{eliminated.name}</span>
                <ArrowRight size={14} />
                <span>
                  {isCrook ? t('eachVotingCitizenReceives') : t('eachCrookReceives')}
                </span>
              </div>
              <div className="space-y-2">
                {state.rewardRecipients.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-ink-700/60 px-4 py-3"
                  >
                    <span className="text-gray-200 font-medium">{r.name}</span>
                    <CoinAmount amount={r.amount} delta size="md" />
                  </div>
                ))}
              </div>
              <p className="text-gray-500 text-xs text-center mt-3">{t('remainderNote')}</p>
            </>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">{t('noVotingCitizens')}</p>
          )}
        </div>

        <button onClick={onContinue} className="btn-primary w-full text-lg">
          {t('continue')}
        </button>
      </div>
    </div>
  );
}
