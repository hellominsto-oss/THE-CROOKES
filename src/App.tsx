import { useReducer, useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageProvider';
import { useLang } from '@/contexts/LanguageContext';
import { gameReducer, createInitialState } from '@/game/reducer';
import type { Action } from '@/game/reducer';
import type { GameState } from '@/game/types';
import { HomeScreen } from '@/screens/HomeScreen';
import { SetupScreen } from '@/screens/SetupScreen';
import { RoleRevealScreen } from '@/screens/RoleRevealScreen';
import { PrivateActionsScreen } from '@/screens/PrivateActionsScreen';
import { RoundResultScreen, DiscussionScreen } from '@/screens/RoundResultScreen';
import { VotingScreen } from '@/screens/VotingScreen';
import { EliminationScreen, RewardScreen } from '@/screens/EliminationScreen';
import { GameOverScreen } from '@/screens/GameOverScreen';

function GameRouter() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState('en'));
  const { lang } = useLang();

  // Sync language changes into game state
  useEffect(() => {
    dispatch({ type: 'SET_LANGUAGE', lang });
  }, [lang]);

  return <PhaseRouter state={state} dispatch={dispatch} />;
}

function PhaseRouter({
  state,
  dispatch,
}: {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}) {
  const { t } = useLang();

  switch (state.phase) {
    case 'HOME':
      return <HomeScreen onStart={() => dispatch({ type: 'ENTER_SETUP' })} />;

    case 'SETUP_PLAYER_COUNT':
    case 'SETUP_PLAYER_NAMES':
    case 'SETUP_GAME_CONFIG':
      return (
        <SetupScreen
          state={state}
          onPlayerCount={(count) => dispatch({ type: 'SET_PLAYER_COUNT', count })}
          onPlayerNames={(names) => dispatch({ type: 'SET_PLAYER_NAMES', names })}
          onGameConfig={(crookCount, totalRounds) => {
            dispatch({ type: 'SET_GAME_CONFIG', crookCount, totalRounds });
            dispatch({ type: 'START_GAME' });
          }}
          onBack={() => dispatch({ type: 'RESTART' })}
        />
      );

    case 'ROLE_REVEAL':
      return (
        <RoleRevealScreen
          state={state}
          onReveal={() => dispatch({ type: 'REVEAL_ROLE' })}
          onHide={() => {
            dispatch({ type: 'HIDE_ROLE' });
            dispatch({ type: 'NEXT_ROLE_REVEAL' });
          }}
        />
      );

    case 'ROUND_START':
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 bg-radial-gold">
          <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">
                {t('round')}
              </p>
              <h2 className="text-5xl font-display font-black text-gold-300">
                {state.currentRound}
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                {t('roundOf')} {state.totalRounds}
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'START_ROUND' })}
              className="btn-primary text-lg w-full max-w-xs"
            >
              {t('startRound')}
            </button>
          </div>
        </div>
      );

    case 'PRIVATE_ACTIONS':
      return (
        <PrivateActionsScreen
          state={state}
          onShowInfo={() => dispatch({ type: 'SHOW_PRIVATE_INFO' })}
          onHideInfo={() => dispatch({ type: 'HIDE_PRIVATE_INFO' })}
          onCreatePlan={(plan) => {
            dispatch({ type: 'CREATE_PLAN', plan });
            dispatch({ type: 'NEXT_PRIVATE_ACTION' });
          }}
          onSetSilence={(targetId) => {
            dispatch({ type: 'SET_SILENCE', targetId });
            dispatch({ type: 'NEXT_PRIVATE_ACTION' });
          }}
          onAcknowledgeNoAction={() => {
            dispatch({ type: 'ACKNOWLEDGE_NO_ACTION' });
            dispatch({ type: 'NEXT_PRIVATE_ACTION' });
          }}
          onNext={() => dispatch({ type: 'SHOW_ROUND_RESULT' })}
        />
      );

    case 'ROUND_RESULT':
      return (
        <RoundResultScreen
          state={state}
          onContinue={() => dispatch({ type: 'START_DISCUSSION' })}
        />
      );

    case 'DISCUSSION':
      return (
        <DiscussionScreen
          state={state}
          onStartVoting={() => dispatch({ type: 'START_VOTING' })}
        />
      );

    case 'VOTING':
      return (
        <VotingScreen
          state={state}
          onShowInfo={() => dispatch({ type: 'SHOW_VOTE_INFO' })}
          onHideInfo={() => dispatch({ type: 'HIDE_VOTE_INFO' })}
          onCastVote={(targetId) => {
            dispatch({ type: 'CAST_VOTE', targetId });
            dispatch({ type: 'NEXT_VOTE' });
          }}
          onNext={() => dispatch({ type: 'NEXT_VOTE' })}
          isRevote={false}
        />
      );

    case 'REVOTE':
      return (
        <VotingScreen
          state={state}
          onShowInfo={() => dispatch({ type: 'SHOW_VOTE_INFO' })}
          onHideInfo={() => dispatch({ type: 'HIDE_VOTE_INFO' })}
          onCastVote={(targetId) => {
            dispatch({ type: 'CAST_VOTE', targetId });
            dispatch({ type: 'NEXT_VOTE' });
          }}
          onNext={() => dispatch({ type: 'NEXT_VOTE' })}
          isRevote={true}
        />
      );

    case 'ELIMINATION':
      return (
        <EliminationScreen
          state={state}
          onContinue={() => dispatch({ type: 'SHOW_ELIMINATION' })}
        />
      );

    case 'REWARD_DISTRIBUTION':
      return (
        <RewardScreen
          state={state}
          onContinue={() => dispatch({ type: 'DISTRIBUTE_REWARDS' })}
        />
      );

    case 'NEXT_ROUND':
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
          <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
            <p className="text-gray-400">{t('round')} {state.currentRound + 1}</p>
            <button
              onClick={() => dispatch({ type: 'NEXT_ROUND' })}
              className="btn-primary text-lg w-full max-w-xs"
            >
              {t('startRound')}
            </button>
          </div>
        </div>
      );

    case 'GAME_OVER':
      return <GameOverScreen state={state} onRestart={() => dispatch({ type: 'RESTART' })} />;

    default:
      return <HomeScreen onStart={() => dispatch({ type: 'ENTER_SETUP' })} />;
  }
}

function App() {
  return (
    <LanguageProvider>
      <GameRouter />
    </LanguageProvider>
  );
}

export default App;
