import { useState } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Users, ChevronRight, ChevronLeft, User, VenetianMask, Swords } from 'lucide-react';
import type { GameState } from '@/game/types';

interface SetupScreenProps {
  state: GameState;
  onPlayerCount: (count: number) => void;
  onPlayerNames: (names: string[]) => void;
  onGameConfig: (crookCount: number, totalRounds: number) => void;
  onBack: () => void;
}

type SetupStep = 'count' | 'names' | 'config';

export function SetupScreen({ state, onPlayerCount, onPlayerNames, onGameConfig, onBack }: SetupScreenProps) {
  const { t, dir } = useLang();
  const [step, setStep] = useState<SetupStep>('count');
  const [count, setCount] = useState(state.totalPlayers || 6);
  const [names, setNames] = useState<string[]>(state.players.map((p) => p.name));
  const [crookCount, setCrookCount] = useState(state.crookCount || 1);
  const [rounds, setRounds] = useState(state.totalRounds || 5);
  const [error, setError] = useState('');

  const BackIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;

  const handleCountNext = () => {
    if (count < 3) { setError(t('minPlayersError')); return; }
    if (count > 20) { setError(t('maxPlayersError')); return; }
    setError('');
    onPlayerCount(count);
    if (names.length !== count) {
      setNames(new Array(count).fill(''));
    }
    setStep('names');
  };

  const handleNamesNext = () => {
    if (names.some((n) => !n.trim())) { setError(t('enterName')); return; }
    setError('');
    onPlayerNames(names.map((n) => n.trim()));
    setStep('config');
  };

  const handleConfigStart = () => {
    if (crookCount < 1 || crookCount > 10) { setError(t('invalidCrookCount')); return; }
    if (rounds < 3 || rounds > 15) { setError(t('invalidRoundCount')); return; }
    if (crookCount >= count) { setError(t('crooksExceedPlayers')); return; }
    setError('');
    onGameConfig(crookCount, rounds);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            if (step === 'config') setStep('names');
            else if (step === 'names') setStep('count');
            else onBack();
          }}
          className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <BackIcon size={20} />
          {t('back')}
        </button>
        <LanguageToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto">
        {step === 'count' && (
          <div className="w-full animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-gold-400" size={28} />
              <h2 className="text-2xl font-display font-bold text-gold-300">{t('playerCount')}</h2>
            </div>
            <p className="text-gray-400 text-sm mb-8">{t('playerCountHint')}</p>

            <div className="card-surface p-6 mb-6">
              <div className="text-center mb-6">
                <span className="text-6xl font-display font-black text-gold-300">{count}</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>3</span>
                <span>20</span>
              </div>
            </div>

            {error && <p className="text-blood-400 text-sm mb-4 text-center">{error}</p>}

            <button onClick={handleCountNext} className="btn-primary w-full text-lg">
              {t('next')}
            </button>
          </div>
        )}

        {step === 'names' && (
          <div className="w-full animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <User className="text-gold-400" size={28} />
              <h2 className="text-2xl font-display font-bold text-gold-300">{t('playerNames')}</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">{t('playerNamesHint')}</p>

            <div className="space-y-3 mb-6 max-h-[45vh] overflow-y-auto scrollbar-hide">
              {names.map((name, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-gold-400 font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const updated = [...names];
                      updated[i] = e.target.value;
                      setNames(updated);
                    }}
                    placeholder={`${t('playerName')} ${i + 1}`}
                    className="input-field"
                    maxLength={20}
                  />
                </div>
              ))}
            </div>

            {error && <p className="text-blood-400 text-sm mb-4 text-center">{error}</p>}

            <button onClick={handleNamesNext} className="btn-primary w-full text-lg">
              {t('next')}
            </button>
          </div>
        )}

        {step === 'config' && (
          <div className="w-full animate-fade-in-up">
            <h2 className="text-2xl font-display font-bold text-gold-300 mb-2">{t('gameSetup')}</h2>
            <p className="text-gray-400 text-sm mb-6">{t('citizensAuto')}</p>

            <div className="space-y-5 mb-6">
              <ConfigRow
                icon={<VenetianMask />}
                label={t('crooks')}
                hint={t('crooksHint')}
                value={crookCount}
                min={1}
                max={Math.min(10, count - 1)}
                onChange={setCrookCount}
              />

              <div className="card-surface p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-200 font-semibold">{t('citizens')}</p>
                </div>
                <span className="text-3xl font-display font-bold text-emerald-400">
                  {count - crookCount}
                </span>
              </div>

              <ConfigRow
                icon={<Swords />}
                label={t('rounds')}
                hint={t('roundsHint')}
                value={rounds}
                min={3}
                max={15}
                onChange={setRounds}
              />
            </div>

            {error && <p className="text-blood-400 text-sm mb-4 text-center">{error}</p>}

            <button onClick={handleConfigStart} className="btn-primary w-full text-lg">
              {t('startGame')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConfigRow({
  icon, label, hint, value, min, max, onChange,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gold-400">{icon}</span>
          <span className="text-gray-200 font-semibold">{label}</span>
        </div>
        <span className="text-2xl font-display font-bold text-gold-300">{value}</span>
      </div>
      <p className="text-gray-500 text-xs mb-3">{hint}</p>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold-500"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}


