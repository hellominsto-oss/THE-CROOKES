import type { GameState, TransferPlan, GamePhase, Language } from './types';
import {
  createInitialState,
  assignRoles,
  createPlayers,
  getLivingPlayers,
  getLivingCrooks,
  executeTransfer,
  distributeCitizenReward,
  distributeCrookReward,
  tallyVotes,
  checkWinCondition,
  getHighestBalances,
} from './logic';

export type Action =
  | { type: 'SET_LANGUAGE'; lang: Language }
  | { type: 'ENTER_SETUP' }
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'SET_PLAYER_NAMES'; names: string[] }
  | { type: 'SET_GAME_CONFIG'; crookCount: number; totalRounds: number }
  | { type: 'START_GAME' }
  | { type: 'REVEAL_ROLE' }
  | { type: 'HIDE_ROLE' }
  | { type: 'NEXT_ROLE_REVEAL' }
  | { type: 'START_ROUND' }
  | { type: 'SHOW_PRIVATE_INFO' }
  | { type: 'HIDE_PRIVATE_INFO' }
  | { type: 'ACKNOWLEDGE_NO_ACTION' }
  | { type: 'NEXT_PRIVATE_ACTION' }
  | { type: 'CREATE_PLAN'; plan: TransferPlan }
  | { type: 'SET_SILENCE'; targetId: number | null }
  | { type: 'SHOW_ROUND_RESULT' }
  | { type: 'START_DISCUSSION' }
  | { type: 'START_VOTING' }
  | { type: 'SHOW_VOTE_INFO' }
  | { type: 'CAST_VOTE'; targetId: number }
  | { type: 'HIDE_VOTE_INFO' }
  | { type: 'NEXT_VOTE' }
  | { type: 'TALLY_VOTES' }
  | { type: 'SHOW_ELIMINATION' }
  | { type: 'DISTRIBUTE_REWARDS' }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESTART' };

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.lang };

    case 'ENTER_SETUP':
      return { ...state, phase: 'SETUP_PLAYER_COUNT' };

    case 'SET_PLAYER_COUNT':
      return { ...state, totalPlayers: action.count };

    case 'SET_PLAYER_NAMES':
      return { ...state, players: action.names.map((name, i) => ({
        id: i, name, fixedOrder: i, role: 'citizen', balance: 100,
        alive: true, currentVote: null, votedForThisCrook: false,
      })) };

    case 'SET_GAME_CONFIG':
      return { ...state, crookCount: action.crookCount, totalRounds: action.totalRounds };

    case 'START_GAME': {
      const roles = assignRoles(state.totalPlayers, state.crookCount);
      const players = createPlayers(
        state.players.map((p) => p.name),
        roles,
      );
      return {
        ...state,
        players,
        currentRound: 1,
        phase: 'ROLE_REVEAL',
        roleRevealIndex: 0,
        showPrivateInfo: false,
      };
    }

    case 'REVEAL_ROLE':
      return { ...state, showPrivateInfo: true };

    case 'HIDE_ROLE':
      return { ...state, showPrivateInfo: false };

    case 'NEXT_ROLE_REVEAL': {
      const nextIndex = state.roleRevealIndex + 1;
      if (nextIndex >= state.totalPlayers) {
        return { ...state, phase: 'ROUND_START', showPrivateInfo: false, roleRevealIndex: 0 };
      }
      return { ...state, roleRevealIndex: nextIndex, showPrivateInfo: false };
    }

    case 'START_ROUND': {
      const crooks = getLivingCrooks(state);
      const owner = crooks.length > 0 ? crooks[0] : null;
      const assistant = crooks.length > 1 ? crooks[1] : null;

      const livingIds = getLivingPlayers(state).map((p) => p.id);

      const resetPlayers = state.players.map((p) => ({
        ...p,
        votedForThisCrook: false,
        currentVote: null,
      }));

      return {
        ...state,
        players: resetPlayers,
        phase: 'PRIVATE_ACTIONS',
        privateActionIndex: 0,
        showPrivateInfo: false,
        currentPlan: null,
        planOwnerId: owner?.id ?? null,
        assistantId: assistant?.id ?? null,
        silencedPlayerId: null,
        roundChanges: [],
        votes: {},
        tiedPlayers: livingIds,
        eliminatedPlayerId: null,
        lastEliminatedRole: null,
        lastEliminatedName: null,
        rewardRecipients: [],
      };
    }

    case 'SHOW_PRIVATE_INFO':
      return { ...state, showPrivateInfo: true };

    case 'HIDE_PRIVATE_INFO':
      return { ...state, showPrivateInfo: false };

    case 'ACKNOWLEDGE_NO_ACTION':
      return { ...state, showPrivateInfo: false };

    case 'NEXT_PRIVATE_ACTION': {
      const livingAll = getLivingPlayers(state);
      const nextIndex = state.privateActionIndex + 1;

      if (nextIndex >= livingAll.length) {
        return { ...state, phase: 'ROUND_RESULT', showPrivateInfo: false, privateActionIndex: 0 };
      }
      return { ...state, privateActionIndex: nextIndex, showPrivateInfo: false };
    }

    case 'CREATE_PLAN': {
      const { changes, newBalances } = executeTransfer(state, action.plan);
      const updatedPlayers = state.players.map((p) => {
        const newBal = newBalances.get(p.id);
        return newBal !== undefined ? { ...p, balance: newBal } : p;
      });

      return {
        ...state,
        players: updatedPlayers,
        currentPlan: action.plan,
        roundChanges: changes,
        showPrivateInfo: false,
      };
    }

    case 'SET_SILENCE':
      return {
        ...state,
        silencedPlayerId: action.targetId,
        showPrivateInfo: false,
      };

    case 'SHOW_ROUND_RESULT':
      return { ...state, phase: 'ROUND_RESULT' };

    case 'START_DISCUSSION':
      return { ...state, phase: 'DISCUSSION' };

    case 'START_VOTING': {
      const livingIds = getLivingPlayers(state).map((p) => p.id);
      return {
        ...state,
        phase: 'VOTING',
        voteIndex: 0,
        votes: {},
        tiedPlayers: livingIds,
        showPrivateInfo: false,
      };
    }

    case 'SHOW_VOTE_INFO':
      return { ...state, showPrivateInfo: true };

    case 'CAST_VOTE': {
      const livingIds = getLivingPlayers(state).map((p) => p.id);
      const currentVoter = livingIds[state.voteIndex];
      if (currentVoter === undefined) return state;

      const newVotes = { ...state.votes, [currentVoter]: action.targetId };

      const updatedPlayers = state.players.map((p) => {
        if (p.id === action.targetId && p.role === 'crook') {
          return { ...p, votedForThisCrook: true };
        }
        return p;
      });

      return {
        ...state,
        votes: newVotes,
        players: updatedPlayers,
        showPrivateInfo: false,
      };
    }

    case 'HIDE_VOTE_INFO':
      return { ...state, showPrivateInfo: false };

    case 'NEXT_VOTE': {
      const livingIds = getLivingPlayers(state).map((p) => p.id);
      const nextVoteIndex = state.voteIndex + 1;

      if (nextVoteIndex >= livingIds.length) {
        return { ...state, phase: 'TALLY_VOTES', voteIndex: 0, showPrivateInfo: false };
      }
      return { ...state, voteIndex: nextVoteIndex, showPrivateInfo: false };
    }

    case 'TALLY_VOTES': {
      const eligibleIds = state.tiedPlayers.length > 0 ? state.tiedPlayers : getLivingPlayers(state).map((p) => p.id);
      const { eliminatedId, tiedIds } = tallyVotes(state, eligibleIds);

      if (eliminatedId !== null) {
        const updatedPlayers = state.players.map((p) =>
          p.id === eliminatedId ? { ...p, alive: false } : p,
        );

        return {
          ...state,
          players: updatedPlayers,
          eliminatedPlayerId: eliminatedId,
          tiedPlayers: [],
          phase: 'ELIMINATION',
        };
      }

      return {
        ...state,
        tiedPlayers: tiedIds,
        phase: 'REVOTE',
        voteIndex: 0,
        votes: {},
        showPrivateInfo: false,
        players: state.players.map((p) => ({ ...p, votedForThisCrook: false })),
      };
    }

    case 'SHOW_ELIMINATION': {
      const eliminated = state.players.find((p) => p.id === state.eliminatedPlayerId);
      if (!eliminated) return state;

      return {
        ...state,
        phase: 'REWARD_DISTRIBUTION',
        lastEliminatedRole: eliminated.role,
        lastEliminatedName: eliminated.name,
      };
    }

    case 'DISTRIBUTE_REWARDS': {
      const eliminated = state.players.find((p) => p.id === state.eliminatedPlayerId);
      if (!eliminated) return state;

      let rewards: Map<number, number>;
      const recipients: { name: string; amount: number }[] = [];

      if (eliminated.role === 'citizen') {
        rewards = distributeCitizenReward(state, eliminated);
      } else {
        rewards = distributeCrookReward(state, eliminated);
      }

      const updatedPlayers = state.players.map((p) => {
        if (p.id === eliminated.id) {
          return { ...p, balance: 0 };
        }
        const reward = rewards.get(p.id);
        if (reward !== undefined) {
          recipients.push({ name: p.name, amount: reward });
          return { ...p, balance: p.balance + reward };
        }
        return p;
      });

      recipients.sort((a, b) => b.amount - a.amount);

      const status = checkWinCondition({ ...state, players: updatedPlayers });

      if (status !== 'playing') {
        const balances = getHighestBalances({ ...state, players: updatedPlayers });
        let winReason = '';
        if (status === 'citizens_win') {
          if (getLivingCrooks({ ...state, players: updatedPlayers }).length === 0) {
            winReason = 'citizensWinAllEliminated';
          } else {
            winReason = 'tiedBalance';
          }
        } else {
          winReason = 'crooksWinBalance';
        }

        return {
          ...state,
          players: updatedPlayers,
          rewardRecipients: recipients,
          gameStatus: status,
          phase: 'GAME_OVER',
          winReason,
          highestCrookBalance: balances.crook,
          highestCitizenBalance: balances.citizen,
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        rewardRecipients: recipients,
        phase: 'NEXT_ROUND',
      };
    }

    case 'NEXT_ROUND': {
      const nextRound = state.currentRound + 1;
      const status = checkWinCondition(state);

      if (status !== 'playing') {
        const balances = getHighestBalances(state);
        let winReason = '';
        if (status === 'citizens_win') {
          winReason = getLivingCrooks(state).length === 0
            ? 'citizensWinAllEliminated'
            : 'citizensWinBalance';
        } else {
          winReason = 'crooksWinBalance';
        }
        return {
          ...state,
          currentRound: nextRound,
          gameStatus: status,
          phase: 'GAME_OVER',
          winReason,
          highestCrookBalance: balances.crook,
          highestCitizenBalance: balances.citizen,
        };
      }

      return {
        ...state,
        currentRound: nextRound,
        phase: 'ROUND_START',
      };
    }

    case 'RESTART':
      return createInitialState(state.language);

    default:
      return state;
  }
}

export { createInitialState };
export type { GameState, GamePhase };
