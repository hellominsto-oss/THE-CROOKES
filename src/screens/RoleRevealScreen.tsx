import { useLang } from '@/contexts/LanguageContext';
import { PassPhone, PrivacyShield } from '@/components/PassPhone';
import { CoinPile } from '@/components/CoinIcon';
import type { GameState, Player } from '@/game/types';
import { getLivingCrooks } from '@/game/logic';
import { Eye, Shield, Skull } from 'lucide-react';

interface RoleRevealScreenProps {
  state: GameState;
  onReveal: () => void;
  onHide: () => void;
  onNext: () => void;
}

export function RoleRevealScreen({ state, onReveal, onHide, onNext }: RoleRevealScreenProps) {
  const { t } = useLang();
  const player = state.players[state.roleRevealIndex];
  if (!player) return null;

  const isLast = state.roleRevealIndex === state.totalPlayers - 1;
  const fellowCrooks = player.role === 'crook'
    ? getLivingCrooks(state).filter((c) => c.id !== player.id)
    : [];

  // After last player hides, show a clean transition screen
  if (isLast && !state.showPrivateInfo && state.roleRevealIndex === state.totalPlayers - 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-radial-gold">
        <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
          <div className="relative inline-block">
            <div className="absolute inset-0 blur-3xl bg-gold-500/20 rounded-full" />
            <div className="relative w-24 h-24 rounded-full bg-ink-800 border-2 border-gold-600/50 flex items-center justify-center">
              <Eye size={48} className="text-gold-400" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-gold-300">
              {t('roleRevealDone')}
            </h2>
          </div>
          <button onClick={onNext} className="btn-primary text-lg w-full max-w-xs">
            {t('startRound')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="text-center mb-4">
        <h2 className="text-xl font-display font-bold text-gold-300">{t('roleRevealTitle')}</h2>
        <p className="text-gray-500 text-xs mt-1">
          {state.roleRevealIndex + 1} / {state.totalPlayers}
        </p>
      </div>

      <PassPhone
        playerName={player.name}
        onReady={onReveal}
        showContent={state.showPrivateInfo}
        variant="reveal"
        onHide={onHide}
      >
        <PrivacyShield show={state.showPrivateInfo} onReveal={onReveal}>
          <div className="flex flex-col items-center gap-6 py-8">
            <h3 className="text-2xl font-display font-bold text-gray-100">{player.name}</h3>

            <RoleCard player={player} />

            <div className="mt-2">
              <p className="text-gray-400 text-sm text-center mb-2">{t('balance')}</p>
              <CoinPile amount={player.balance} />
            </div>

            {player.role === 'crook' && (
              <div className="w-full max-w-sm">
                {fellowCrooks.length > 0 ? (
                  <div className="card-surface p-4">
                    <p className="text-blood-300 font-semibold text-sm mb-3 flex items-center gap-2">
                      <Skull size={18} className="text-blood-400" />
                      {t('fellowCrooks')}
                    </p>
                    <div className="space-y-2">
                      {fellowCrooks.map((c) => (
                        <div key={c.id} className="flex items-center gap-2 text-gray-200">
                          <span className="w-2 h-2 rounded-full bg-blood-500" />
                          {c.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-blood-300 text-sm text-center">{t('youAreAloneCrook')}</p>
                )}
                {fellowCrooks.length === 0 && (
                  <p className="text-gray-500 text-xs text-center mt-2">{t('noAssistant')}</p>
                )}
              </div>
            )}

            <button
              onClick={isLast ? onHide : onHide}
              className="btn-secondary min-w-[200px] mt-4"
            >
              {t('hideInfo')}
            </button>
          </div>
        </PrivacyShield>
      </PassPhone>
    </div>
  );
}

function RoleCard({ player }: { player: Player }) {
  const { t } = useLang();
  const isCrook = player.role === 'crook';

  return (
    <div
      className={`relative w-64 h-80 rounded-2xl border-2 flex flex-col items-center justify-center gap-4 overflow-hidden ${
        isCrook
          ? 'bg-gradient-to-b from-blood-900/40 to-ink-900 border-blood-600/50'
          : 'bg-gradient-to-b from-emerald-900/30 to-ink-900 border-emerald-600/40'
      }`}
    >
      <div className={`absolute inset-0 opacity-10 ${
        isCrook ? 'bg-radial-blood' : ''
      }`} />
      <div className="relative">
        {isCrook ? (
          <Skull size={72} className="text-blood-400" />
        ) : (
          <Shield size={72} className="text-emerald-400" />
        )}
      </div>
      <div className="relative text-center">
        <p className="text-gray-400 text-sm uppercase tracking-widest">{t('yourRole')}</p>
        <p className={`text-3xl font-display font-black mt-1 ${
          isCrook ? 'text-blood-300' : 'text-emerald-300'
        }`}>
          {isCrook ? t('crook') : t('citizen')}
        </p>
      </div>
    </div>
  );
}
