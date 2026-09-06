import type { GameState, Player, Role, TransferPlan, RoundChange } from './types';

export function createInitialState(language: 'en' | 'ar'): GameState {
  return {
    language,
    totalPlayers: 0,
    totalRounds: 3,
    crookCount: 1,
    currentRound: 0,
    players: [],
    currentPlan: null,
    planOwnerId: null,
    assistantId: null,
    silencedPlayerId: null,
    roundChanges: [],
    votes: {},
    tiedPlayers: [],
    eliminatedPlayerId: null,
    gameStatus: 'playing',
    phase: 'HOME',
    roleRevealIndex: 0,
    privateActionIndex: 0,
    voteIndex: 0,
    showPrivateInfo: false,
    lastEliminatedRole: null,
    lastEliminatedName: null,
    rewardRecipients: [],
    winReason: '',
    highestCrookBalance: 0,
    highestCitizenBalance: 0,
  };
}

export function assignRoles(playerCount: number, crookCount: number): Role[] {
  const roles: Role[] = [];
  for (let i = 0; i < crookCount; i++) roles.push('crook');
  for (let i = 0; i < playerCount - crookCount; i++) roles.push('citizen');
  return shuffle(roles);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createPlayers(names: string[], roles: Role[]): Player[] {
  return names.map((name, i) => ({
    id: i,
    name,
    fixedOrder: i,
    role: roles[i],
    balance: 100,
    alive: true,
    currentVote: null,
    votedForThisCrook: false,
  }));
}

export function getLivingPlayers(state: GameState): Player[] {
  return state.players
    .filter((p) => p.alive)
    .sort((a, b) => a.fixedOrder - b.fixedOrder);
}

export function getLivingCrooks(state: GameState): Player[] {
  return getLivingPlayers(state).filter((p) => p.role === 'crook');
}

export function getLivingCitizens(state: GameState): Player[] {
  return getLivingPlayers(state).filter((p) => p.role === 'citizen');
}

export function getPlanOwner(state: GameState): Player | null {
  const crooks = getLivingCrooks(state);
  return crooks.length > 0 ? crooks[0] : null;
}

export function getAssistant(state: GameState): Player | null {
  const crooks = getLivingCrooks(state);
  return crooks.length > 1 ? crooks[1] : null;
}

export function executeTransfer(
  state: GameState,
  plan: TransferPlan,
): { changes: RoundChange[]; newBalances: Map<number, number> } {
  const source = state.players.find((p) => p.id === plan.sourceId);
  const dest = state.players.find((p) => p.id === plan.destinationId);
  if (!source || !dest) return { changes: [], newBalances: new Map() };

  const actualAmount = Math.min(plan.amount, source.balance);
  const changes: RoundChange[] = [];

  if (actualAmount > 0) {
    changes.push({ playerId: source.id, playerName: source.name, delta: -actualAmount });
    changes.push({ playerId: dest.id, playerName: dest.name, delta: actualAmount });
  }

  const newBalances = new Map<number, number>();
  newBalances.set(source.id, source.balance - actualAmount);
  newBalances.set(dest.id, dest.balance + actualAmount);

  return { changes, newBalances };
}

export function distributeRemainder(
  total: number,
  recipients: Player[],
): { perPerson: number; remainder: number } {
  if (recipients.length === 0) return { perPerson: 0, remainder: 0 };
  const perPerson = Math.floor(total / recipients.length);
  const remainder = total - perPerson * recipients.length;
  return { perPerson, remainder };
}

export function distributeCitizenReward(state: GameState, eliminated: Player): Map<number, number> {
  const crooks = getLivingCrooks(state);
  const result = new Map<number, number>();
  if (crooks.length === 0 || eliminated.balance === 0) return result;

  const { perPerson, remainder } = distributeRemainder(eliminated.balance, crooks);
  const sortedCrooks = [...crooks].sort((a, b) => a.fixedOrder - b.fixedOrder);

  sortedCrooks.forEach((c, i) => {
    let amount = perPerson;
    if (i < remainder) amount += 1;
    result.set(c.id, amount);
  });

  return result;
}

export function distributeCrookReward(state: GameState, eliminated: Player): Map<number, number> {
  const result = new Map<number, number>();
  if (eliminated.balance === 0) return result;

  const votingCitizens = getLivingCitizens(state).filter((p) => p.votedForThisCrook);
  if (votingCitizens.length === 0) return result;

  const { perPerson, remainder } = distributeRemainder(eliminated.balance, votingCitizens);
  const sortedCitizens = [...votingCitizens].sort((a, b) => a.fixedOrder - b.fixedOrder);

  sortedCitizens.forEach((c, i) => {
    let amount = perPerson;
    if (i < remainder) amount += 1;
    result.set(c.id, amount);
  });

  return result;
}

export function tallyVotes(
  state: GameState,
  eligibleIds: number[],
): { eliminatedId: number | null; tiedIds: number[] } {
  const voteCount = new Map<number, number>();
  for (const id of eligibleIds) {
    voteCount.set(id, 0);
  }
  for (const vote of Object.values(state.votes)) {
    if (eligibleIds.includes(vote)) {
      voteCount.set(vote, (voteCount.get(vote) || 0) + 1);
    }
  }

  let maxVotes = 0;
  for (const count of voteCount.values()) {
    if (count > maxVotes) maxVotes = count;
  }

  const tiedIds: number[] = [];
  for (const [id, count] of voteCount) {
    if (count === maxVotes) tiedIds.push(id);
  }

  if (tiedIds.length === 1) {
    return { eliminatedId: tiedIds[0], tiedIds: [] };
  }

  return { eliminatedId: null, tiedIds };
}

export function checkWinCondition(state: GameState): 'playing' | 'citizens_win' | 'crooks_win' {
  const livingCrooks = getLivingCrooks(state);
  if (livingCrooks.length === 0) return 'citizens_win';

  if (state.currentRound >= state.totalRounds) {
    const highestCrook = Math.max(...livingCrooks.map((p) => p.balance));
    const livingCitizens = getLivingCitizens(state);
    const highestCitizen = livingCitizens.length > 0
      ? Math.max(...livingCitizens.map((p) => p.balance))
      : 0;

    if (highestCrook > highestCitizen) return 'crooks_win';
    return 'citizens_win';
  }

  return 'playing';
}

export function getHighestBalances(state: GameState): { crook: number; citizen: number } {
  const crooks = getLivingCrooks(state);
  const citizens = getLivingCitizens(state);
  return {
    crook: crooks.length > 0 ? Math.max(...crooks.map((p) => p.balance)) : 0,
    citizen: citizens.length > 0 ? Math.max(...citizens.map((p) => p.balance)) : 0,
  };
}
