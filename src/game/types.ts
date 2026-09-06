export type Language = 'en' | 'ar';

export type Role = 'citizen' | 'crook';

export type GamePhase =
  | 'HOME'
  | 'SETUP_PLAYER_COUNT'
  | 'SETUP_PLAYER_NAMES'
  | 'SETUP_GAME_CONFIG'
  | 'ROLE_REVEAL'
  | 'ROUND_START'
  | 'PRIVATE_ACTIONS'
  | 'PLAN_CREATION'
  | 'ASSISTANT_ACTION'
  | 'ROUND_RESULT'
  | 'DISCUSSION'
  | 'VOTING'
  | 'REVOTE'
  | 'TALLY_VOTES'
  | 'ELIMINATION'
  | 'REWARD_DISTRIBUTION'
  | 'NEXT_ROUND'
  | 'GAME_OVER';

export interface Player {
  id: number;
  name: string;
  fixedOrder: number;
  role: Role;
  balance: number;
  alive: boolean;
  currentVote: number | null;
  votedForThisCrook: boolean;
}

export interface TransferPlan {
  sourceId: number;
  amount: number;
  destinationId: number;
}

export interface RoundChange {
  playerId: number;
  playerName: string;
  delta: number;
}

export interface GameState {
  language: Language;
  totalPlayers: number;
  totalRounds: number;
  crookCount: number;
  currentRound: number;
  players: Player[];
  currentPlan: TransferPlan | null;
  planOwnerId: number | null;
  assistantId: number | null;
  silencedPlayerId: number | null;
  roundChanges: RoundChange[];
  votes: Record<number, number>;
  tiedPlayers: number[];
  eliminatedPlayerId: number | null;
  gameStatus: 'playing' | 'citizens_win' | 'crooks_win';
  phase: GamePhase;
  roleRevealIndex: number;
  privateActionIndex: number;
  voteIndex: number;
  showPrivateInfo: boolean;
  lastEliminatedRole: Role | null;
  lastEliminatedName: string | null;
  rewardRecipients: { name: string; amount: number }[];
  winReason: string;
  highestCrookBalance: number;
  highestCitizenBalance: number;
}
