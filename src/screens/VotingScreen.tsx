import { useState, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { PassPhone, PrivacyShield } from '@/components/PassPhone';
import { CoinPile } from '@/components/CoinIcon';
import { PlayerSelectCard } from '@/components/PlayerSelectCard';
import type { GameState } from '@/game/types';
import { getLivingPlayers } from '@/game/logic';
import { Vote as VoteIcon } from 'lucide-react';

interface VotingScreenProps {
  state: GameState;
  onShowInfo: () => void;
  onHideInfo: () => void;
  onCastVote: (targetId: number) => void;
  onNext: () => void;
  isRevote: boolean;
}

export function VotingScreen({
  state, onShowInfo, onHideInfo, onCastVote, onNext, isRevote,
}: VotingScreenProps) {
  const { t } = useLang();
  const livingPlayers = getLivingPlayers(state);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);

  const eligibleIds = state.tiedPlayers.length > 0 ? state.tiedPlayers : livingPlayers.map((p) => p.id);
  const currentVoter = livingPlayers[state.voteIndex];

  // Reset selection when voter changes
  useEffect(() => {
    setSelectedTarget(null);
  }, [state.voteIndex]);

  if (!currentVoter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={onNext} className="btn-primary">{t('continue')}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 text-gold-300 text-sm font-semibold">
          <VoteIcon size={18} className="text-gold-400" />
          {isRevote ? t('votingRevoteHint') : t('votingHint')}
        </div>
        <p className="text-gray-500 text-xs mt-1">
          {state.voteIndex + 1} / {livingPlayers.length}
        </p>
      </div>

      <PassPhone
        playerName={currentVoter.name}
        onReady={onShowInfo}
        showContent={state.showPrivateInfo}
        onHide={onHideInfo}
      >
        <PrivacyShield show={state.showPrivateInfo} onReveal={onShowInfo}>
          <div className="flex flex-col items-center gap-6 py-4">
            <h3 className="text-2xl font-display font-bold text-gray-100">{currentVoter.name}</h3>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">{t('yourBalance')}</span>
              <CoinPile amount={currentVoter.balance} />
            </div>

            <div className="w-full max-w-md">
              <p className="text-gray-300 text-sm font-semibold mb-3">{t('voteFor')}</p>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {eligibleIds.map((id) => {
                  const p = state.players.find((pl) => pl.id === id)!;
                  return (
                    <PlayerSelectCard
                      key={id}
                      player={p}
                      selected={selectedTarget === id}
                      onClick={() => setSelectedTarget(id)}
                      size="sm"
                    />
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => selectedTarget !== null && onCastVote(selectedTarget)}
              disabled={selectedTarget === null}
              className="btn-primary w-full max-w-md text-lg"
            >
              {t('confirmVote')}
            </button>
          </div>
        </PrivacyShield>
      </PassPhone>
    </div>
  );
}
