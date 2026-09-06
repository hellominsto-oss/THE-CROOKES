import { useLang } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { CoinAmount } from '@/components/CoinIcon';
import type { GameState } from '@/game/types';
import { getLivingCrooks, getLivingCitizens } from '@/game/logic';
import { Shield, Skull, Coins } from 'lucide-react';

interface GameOverScreenProps {
  state: GameState;
  onRestart: () => void;
}

export function GameOverScreen({ state, onRestart }: GameOverScreenProps) {
  const { t } = useLang();
  const citizensWin = state.gameStatus === 'citizens_win';

  const livingCrooks = getLivingCrooks(state);
  const livingCitizens = getLivingCitizens(state);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-8 ${
      citizensWin ? 'bg-radial-gold' : 'bg-radial-blood'
    }`}>
      <div className="absolute top-6 right-6">
        <LanguageToggle />
      </div>

      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="relative inline-block">
          <div className={`absolute inset-0 blur-3xl rounded-full ${citizensWin ? 'bg-emerald-500/30' : 'bg-blood-500/30'}`} />
          <div className={`relative w-28 h-28 rounded-full border-2 flex items-center justify-center ${
            citizensWin
              ? 'bg-emerald-900/30 border-emerald-500/50'
              : 'bg-blood-900/40 border-blood-500/50'
          }`}>
            {citizensWin ? <Shield size={56} className="text-emerald-400" /> : <Skull size={56} className="text-blood-400" />}
          </div>
        </div>

        <div>
          <h1 className={`text-4xl font-display font-black tracking-wide ${
            citizensWin ? 'text-emerald-300' : 'text-blood-300'
          }`}>
            {citizensWin ? t('citizensWin') : t('crooksWin')}
          </h1>
          <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto">
            {state.winReason === 'citizensWinAllEliminated' && t('citizensWinAllEliminated')}
            {state.winReason === 'citizensWinBalance' && t('citizensWinBalance')}
            {state.winReason === 'crooksWinBalance' && t('crooksWinBalance')}
            {state.winReason === 'tiedBalance' && t('tiedBalance')}
          </p>
        </div>

        <div className="card-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <Skull size={16} className="text-blood-400" />
              {t('highestCrookBalance')}
            </span>
            <CoinAmount amount={state.highestCrookBalance} size="lg" />
          </div>
          <div className="h-px bg-ink-600/40" />
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm flex items-center gap-2">
              <Shield size={16} className="text-emerald-400" />
              {t('highestCitizenBalance')}
            </span>
            <CoinAmount amount={state.highestCitizenBalance} size="lg" />
          </div>
        </div>

        {(livingCrooks.length > 0 || livingCitizens.length > 0) && (
          <div className="card-surface p-4">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Final Standings</p>
            <div className="space-y-1.5">
              {state.players
                .sort((a, b) => b.fixedOrder - a.fixedOrder)
                .reverse()
                .map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between text-sm px-3 py-1.5 rounded-lg ${
                      p.alive ? 'bg-ink-700/40' : 'bg-ink-800/40 opacity-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.alive ? 'bg-emerald-500' : 'bg-blood-600'}`} />
                      <span className="text-gray-200">{p.name}</span>
                      {!p.alive && (
                        <span className={`text-xs ${p.role === 'crook' ? 'text-blood-400' : 'text-emerald-400'}`}>
                          {p.role === 'crook' ? t('crook') : t('citizen')}
                        </span>
                      )}
                    </span>
                    <span className="text-gold-300 font-bold flex items-center gap-1">
                      <Coins size={14} className="text-gold-400" />
                      {p.balance}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <button onClick={onRestart} className="btn-primary text-lg w-full max-w-xs mx-auto">
          {t('playAgain')}
        </button>
      </div>
    </div>
  );
}
