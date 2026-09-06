import { useState, useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { PassPhone, PrivacyShield } from '@/components/PassPhone';
import { CoinPile } from '@/components/CoinIcon';
import { PlayerSelectCard } from '@/components/PlayerSelectCard';
import type { GameState, TransferPlan } from '@/game/types';
import { getLivingPlayers, getLivingCrooks, getPlanOwner, getAssistant } from '@/game/logic';
import { Skull, Shield, ArrowRight } from 'lucide-react';

interface PrivateActionsScreenProps {
  state: GameState;
  onShowInfo: () => void;
  onHideInfo: () => void;
  onCreatePlan: (plan: TransferPlan) => void;
  onSetSilence: (targetId: number | null) => void;
  onAcknowledgeNoAction: () => void;
  onNext: () => void;
}

export function PrivateActionsScreen({
  state, onShowInfo, onHideInfo, onCreatePlan, onSetSilence, onAcknowledgeNoAction, onNext,
}: PrivateActionsScreenProps) {
  const { t } = useLang();
  const livingPlayers = getLivingPlayers(state);
  const currentPlayer = livingPlayers[state.privateActionIndex];

  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button onClick={onNext} className="btn-primary">{t('continue')}</button>
      </div>
    );
  }

  const isCrook = currentPlayer.role === 'crook';
  const owner = getPlanOwner(state);
  const assistant = getAssistant(state);
  const isOwner = owner?.id === currentPlayer.id;
  const isAssistant = assistant?.id === currentPlayer.id;
  const fellowCrooks = isCrook
    ? getLivingCrooks(state).filter((c) => c.id !== currentPlayer.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <PassPhone
        playerName={currentPlayer.name}
        onReady={onShowInfo}
        showContent={state.showPrivateInfo}
        onHide={onHideInfo}
      >
        <PrivacyShield show={state.showPrivateInfo} onReveal={onShowInfo}>
          <div className="flex flex-col items-center gap-6 py-4">
            <h3 className="text-2xl font-display font-bold text-gray-100">{currentPlayer.name}</h3>

            <div className={`inline-flex items-center gap-2 text-sm font-semibold ${
              isCrook ? 'text-blood-300' : 'text-emerald-300'
            }`}>
              {isCrook ? <Skull size={18} className="text-blood-400" /> : <Shield size={18} className="text-emerald-400" />}
              {isCrook ? t('crook') : t('citizen')}
            </div>

            <div className="mt-1">
              <p className="text-gray-400 text-sm text-center mb-2">{t('balance')}</p>
              <CoinPile amount={currentPlayer.balance} />
            </div>

            {isCrook && fellowCrooks.length > 0 && (
              <div className="w-full max-w-sm">
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
              </div>
            )}

            {isCrook && fellowCrooks.length === 0 && (
              <p className="text-blood-300 text-sm text-center">{t('youAreAloneCrook')}</p>
            )}

            {isCrook && isOwner && (
              <PlanCreationForm
                state={state}
                onSubmit={onCreatePlan}
              />
            )}

            {isCrook && isAssistant && (
              <AssistantActionForm
                state={state}
                onSubmit={onSetSilence}
              />
            )}

            {isCrook && !isOwner && !isAssistant && (
              <div className="text-center space-y-4">
                <p className="text-gray-400">{t('noActionCrook')}</p>
                <button onClick={onAcknowledgeNoAction} className="btn-secondary min-w-[200px]">
                  {t('acknowledge')}
                </button>
              </div>
            )}

            {!isCrook && (
              <button onClick={onAcknowledgeNoAction} className="btn-secondary min-w-[200px]">
                {t('acknowledge')}
              </button>
            )}
          </div>
        </PrivacyShield>
      </PassPhone>
    </div>
  );
}

function PlanCreationForm({
  state, onSubmit,
}: {
  state: GameState;
  onSubmit: (plan: TransferPlan) => void;
}) {
  const { t } = useLang();
  const livingPlayers = getLivingPlayers(state);
  const [sourceId, setSourceId] = useState<number | null>(null);
  const [destId, setDestId] = useState<number | null>(null);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setSourceId(null);
    setDestId(null);
    setAmount(0);
    setError('');
  }, [state.privateActionIndex]);

  const handleConfirm = () => {
    if (sourceId === null || destId === null) return;
    if (sourceId === destId) { setError(t('sameSourceDest')); return; }
    if (amount < 0 || amount > 50) { setError(t('amountRangeError')); return; }
    setError('');
    onSubmit({ sourceId, amount, destinationId: destId });
  };

  return (
    <div className="w-full max-w-md space-y-5">
      <div className="text-center">
        <p className="text-gold-300 font-semibold text-sm uppercase tracking-widest">
          {t('planOwnerLabel')}
        </p>
        <p className="text-gray-400 text-sm mt-1">{t('planHint')}</p>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-semibold mb-2 block">{t('source')}</label>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {livingPlayers.map((p) => (
            <PlayerSelectCard
              key={p.id}
              player={p}
              selected={sourceId === p.id}
              onClick={() => setSourceId(p.id)}
              size="sm"
            />
          ))}
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-semibold mb-2 block">
          {t('amount')} <span className="text-gray-500">(0–50)</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={50}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1 accent-gold-500"
          />
          <span className="text-2xl font-display font-bold text-gold-300 w-12 text-center">
            {amount}
          </span>
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-semibold mb-2 block">{t('destination')}</label>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {livingPlayers.map((p) => (
            <PlayerSelectCard
              key={p.id}
              player={p}
              selected={destId === p.id}
              onClick={() => setDestId(p.id)}
              disabled={sourceId === p.id}
              size="sm"
            />
          ))}
        </div>
      </div>

      {error && <p className="text-blood-400 text-sm text-center">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={sourceId === null || destId === null}
        className="btn-primary w-full text-lg"
      >
        {t('confirmPlan')}
      </button>
    </div>
  );
}

function AssistantActionForm({
  state, onSubmit,
}: {
  state: GameState;
  onSubmit: (targetId: number | null) => void;
}) {
  const { t } = useLang();
  const livingPlayers = getLivingPlayers(state);
  const [targetId, setTargetId] = useState<number | null>(null);

  useEffect(() => {
    setTargetId(null);
  }, [state.privateActionIndex]);

  return (
    <div className="w-full max-w-md space-y-5">
      <div className="text-center">
        <p className="text-gold-300 font-semibold text-sm uppercase tracking-widest">
          {t('assistantLabel')}
        </p>
      </div>

      {state.currentPlan && (
        <div className="card-surface p-4">
          <p className="text-gray-400 text-sm mb-3">{t('assistantSeesPlan')}</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-lg font-bold text-gray-100">
              {state.players.find((p) => p.id === state.currentPlan!.sourceId)?.name}
            </span>
            <ArrowRight size={24} className="text-gold-400" />
            <span className="text-lg font-bold text-gray-100">
              {state.players.find((p) => p.id === state.currentPlan!.destinationId)?.name}
            </span>
            <span className="text-gold-300 font-bold text-lg ml-2">
              {state.currentPlan.amount} {t('coins')}
            </span>
          </div>
        </div>
      )}

      <div>
        <p className="text-gray-300 text-sm font-semibold mb-1">{t('chooseToSilence')}</p>
        <p className="text-gray-500 text-xs mb-3">{t('silenceHint')}</p>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
          {livingPlayers.map((p) => (
            <PlayerSelectCard
              key={p.id}
              player={p}
              selected={targetId === p.id}
              onClick={() => setTargetId(p.id === targetId ? null : p.id)}
              size="sm"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSubmit(null)}
          className="btn-secondary flex-1"
        >
          {t('noOneToSilence')}
        </button>
        <button
          onClick={() => onSubmit(targetId)}
          className="btn-primary flex-1"
        >
          {t('confirmSilence')}
        </button>
      </div>
    </div>
  );
}
