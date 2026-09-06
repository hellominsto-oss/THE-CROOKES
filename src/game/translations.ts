import type { Language } from './types';

type Dict = Record<string, string>;

const en: Dict = {
  // Brand
  appTitle: 'THE CROOKS',
  appSubtitle: 'A Social Deduction Party Game',

  // Language
  english: 'English',
  arabic: 'العربية',
  language: 'Language',

  // Setup - Player Count
  playerCount: 'Number of Players',
  playerCountHint: 'Choose how many people are playing (3–20)',
  minPlayersError: 'At least 3 players are required.',
  maxPlayersError: 'Maximum 20 players allowed.',

  // Setup - Player Names
  playerNames: 'Player Names',
  playerNamesHint: 'Enter names in the order players will pass the phone. This order stays fixed all game.',
  playerName: 'Player',
  enterName: 'Enter name',
  next: 'Next',
  back: 'Back',

  // Setup - Game Config
  gameSetup: 'Game Setup',
  crooks: 'Crooks',
  citizens: 'Citizens',
  rounds: 'Rounds',
  crooksHint: 'How many Crooks are hiding among you? (1–10)',
  roundsHint: 'How many rounds will the game last? (3–15)',
  citizensAuto: 'Citizens are calculated automatically.',
  startGame: 'Start Game',
  invalidCrookCount: 'Crooks must be at least 1 and at most 10.',
  invalidRoundCount: 'Rounds must be at least 3 and at most 15.',
  crooksExceedPlayers: 'Crooks cannot exceed total players.',

  // Role Reveal
  roleRevealTitle: 'Role Assignment',
  roleRevealHint: 'Pass the phone to each player so they can secretly see their role.',
  passPhoneTo: 'Pass the phone to',
  tapToReveal: 'Tap to reveal your role',
  tapToContinue: 'Tap to continue',
  yourRole: 'Your Role',
  citizen: 'Citizen',
  crook: 'Crook',
  balance: 'Balance',
  fellowCrooks: 'Fellow Crooks',
  youAreAloneCrook: 'You are the only Crook.',
  noAssistant: 'There is no Assistant — no one can be silenced.',
  roleRevealDone: 'All players have seen their roles.',
  startRound: 'Start Round',

  // Round
  round: 'Round',
  roundOf: 'of',
  roundStart: 'Round Start',
  planOwnerLabel: 'Plan Owner',
  assistantLabel: 'Assistant',
  noActionCrook: 'You have no action this round.',
  acknowledge: 'Got it',

  // Plan Creation
  createPlan: 'Create the Transfer Plan',
  planHint: 'Choose a source, an amount (0–50), and a destination.',
  source: 'Source',
  destination: 'Destination',
  amount: 'Amount',
  selectSource: 'Select source player',
  selectDestination: 'Select destination player',
  confirmPlan: 'Confirm Plan',
  sameSourceDest: 'Source and destination must be different.',
  amountRangeError: 'Amount must be between 0 and 50.',

  // Assistant Action
  assistantAction: 'Assistant Action',
  assistantSeesPlan: 'The Plan Owner created this plan:',
  chooseToSilence: 'Choose a player to silence (optional)',
  silenceHint: 'The silenced player cannot speak during discussion this round.',
  noOneToSilence: 'Skip silencing',
  confirmSilence: 'Confirm',
  silencedNoOne: 'No one was silenced.',
  planSummary: '{source} → {destination}',
  coins: 'coins',

  // Round Result
  roundResult: 'Round Result',
  noChanges: 'No coins were transferred.',
  wasSilenced: '{name} was silenced this round.',
  noOneSilenced: 'No one was silenced.',
  continue: 'Continue',

  // Discussion
  talkItOut: 'TALK IT OUT',
  talkItOutHint: 'Discuss what happened. Who gained coins? Who lost them? Who was silenced?',
  startVoting: 'Start Voting',

  // Voting
  voting: 'Voting',
  votingHint: 'Vote for the player you suspect is a Crook.',
  votingRevoteHint: 'Revoting between tied players only. Choose one.',
  yourBalance: 'Your Balance',
  voteFor: 'Vote for',
  confirmVote: 'Confirm Vote',
  mustSelectVote: 'Please select a player to vote for.',
  votesTied: 'The vote is tied. Starting a revote.',
  votingComplete: 'All votes are in.',

  // Elimination
  eliminated: '{name} was eliminated.',
  wasCitizen: '{name} was a Citizen.',
  wasCrook: '{name} was a Crook.',

  // Rewards
  rewardTitle: 'Coin Distribution',
  citizenEliminatedReward: 'A Citizen was eliminated. Their coins go to the Crooks.',
  crookEliminatedReward: 'A Crook was eliminated. Their coins go to the Citizens who voted for them.',
  eachCrookReceives: 'Each living Crook receives',
  eachVotingCitizenReceives: 'Each Citizen who voted for this Crook receives',
  noVotingCitizens: 'No Citizens voted for this Crook. Coins are lost.',
  remainderNote: 'Remainder coins distributed by fixed player order.',

  // Game Over
  citizensWin: 'CITIZENS WIN',
  crooksWin: 'THE CROOKS WIN',
  citizensWinAllEliminated: 'All Crooks were eliminated.',
  citizensWinBalance: 'The Citizens had the highest balance.',
  crooksWinBalance: 'The highest Crook balance was greater than the highest Citizen balance.',
  tiedBalance: 'The highest balances were tied. Citizens win the tie.',
  highestCrookBalance: 'Highest Crook Balance',
  highestCitizenBalance: 'Highest Citizen Balance',
  playAgain: 'Play Again',
  newGame: 'New Game',

  // Privacy
  imReady: "I'm Ready",
  hideInfo: 'Tap to hide',
  passToNext: 'Pass the phone to the next player',
  finished: 'Done',
  yourTurn: 'Your Turn',
};

const ar: Dict = {
  // Brand
  appTitle: 'اللصوص',
  appSubtitle: 'لعبة استنتاج اجتماعي',

  // Language
  english: 'English',
  arabic: 'العربية',
  language: 'اللغة',

  // Setup - Player Count
  playerCount: 'عدد اللاعبين',
  playerCountHint: 'اختر عدد المشاركين (٣ إلى ٢٠)',
  minPlayersError: 'يلزم وجود ٣ لاعبين على الأقل.',
  maxPlayersError: 'الحد الأقصى ٢٠ لاعباً.',

  // Setup - Player Names
  playerNames: 'أسماء اللاعبين',
  playerNamesHint: 'أدخل الأسماء بنفس ترتيب تمرير الهاتف. يبقى هذا الترتيب ثابتاً طوال اللعبة.',
  playerName: 'اللاعب',
  enterName: 'أدخل الاسم',
  next: 'التالي',
  back: 'رجوع',

  // Setup - Game Config
  gameSetup: 'إعداد اللعبة',
  crooks: 'اللصوص',
  citizens: 'المواطنون',
  rounds: 'الجولات',
  crooksHint: 'كم لصاً يختبئ بينكم؟ (١ إلى ١٠)',
  roundsHint: 'كم جولة تستمر اللعبة؟ (٣ إلى ١٥)',
  citizensAuto: 'يُحسب عدد المواطنين تلقائياً.',
  startGame: 'ابدأ اللعبة',
  invalidCrookCount: 'يجب أن يكون عدد اللصوص بين ١ و ١٠.',
  invalidRoundCount: 'يجب أن يكون عدد الجولات بين ٣ و ١٥.',
  crooksExceedPlayers: 'لا يمكن أن يزيد عدد اللصوص عن عدد اللاعبين.',

  // Role Reveal
  roleRevealTitle: 'توزيع الأدوار',
  roleRevealHint: 'مرر الهاتف لكل لاعب ليرى دوره سراً.',
  passPhoneTo: 'مرر الهاتف إلى',
  tapToReveal: 'اضغط لكشف دورك',
  tapToContinue: 'اضغط للمتابعة',
  yourRole: 'دورك',
  citizen: 'مواطن',
  crook: 'لص',
  balance: 'الرصيد',
  fellowCrooks: 'اللصوص زملاؤك',
  youAreAloneCrook: 'أنت اللص الوحيد.',
  noAssistant: 'لا يوجد مساعد — لا يمكن كتم أحد.',
  roleRevealDone: 'رأى جميع اللاعبين أدوارهم.',
  startRound: 'ابدأ الجولة',

  // Round
  round: 'الجولة',
  roundOf: 'من',
  roundStart: 'بداية الجولة',
  planOwnerLabel: 'صاحب الخطة',
  assistantLabel: 'المساعد',
  noActionCrook: 'لا يوجد لك إجراء في هذه الجولة.',
  acknowledge: 'حسناً',

  // Plan Creation
  createPlan: 'أنشئ خطة التحويل',
  planHint: 'اختر المصدر والمبلغ (٠ إلى ٥٠) والوجهة.',
  source: 'المصدر',
  destination: 'الوجهة',
  amount: 'المبلغ',
  selectSource: 'اختر اللاعب المصدر',
  selectDestination: 'اختر اللاعب الوجهة',
  confirmPlan: 'تأكيد الخطة',
  sameSourceDest: 'يجب أن يكون المصدر مختلفاً عن الوجهة.',
  amountRangeError: 'يجب أن يكون المبلغ بين ٠ و ٥٠.',

  // Assistant Action
  assistantAction: 'إجراء المساعد',
  assistantSeesPlan: 'أنشأ صاحب الخطة الخطة التالية:',
  chooseToSilence: 'اختر لاعباً لكتمه (اختياري)',
  silenceHint: 'لا يمكن للاعب المكتوم التحدث أثناء النقاش في هذه الجولة.',
  noOneToSilence: 'تخطّي الكتم',
  confirmSilence: 'تأكيد',
  silencedNoOne: 'لم يُكتم أحد.',
  planSummary: '{source} ← {destination}',
  coins: 'عملات',

  // Round Result
  roundResult: 'نتيجة الجولة',
  noChanges: 'لم تُحوّل أي عملات.',
  wasSilenced: 'كُتِم {name} في هذه الجولة.',
  noOneSilenced: 'لم يُكتم أحد.',
  continue: 'متابعة',

  // Discussion
  talkItOut: 'اتكلموا مع بعض',
  talkItOutHint: 'ناقشوا ما حدث. من كسب عملات؟ من خسرها؟ من كُتِم؟',
  startVoting: 'ابدأ التصويت',

  // Voting
  voting: 'التصويت',
  votingHint: 'صوّت للاعب الذي تشتبه أنه لص.',
  votingRevoteHint: 'إعادة تصويت بين المتعادلين فقط. اختر واحداً.',
  yourBalance: 'رصيدك',
  voteFor: 'صوّت لـ',
  confirmVote: 'تأكيد التصويت',
  mustSelectVote: 'يرجى اختيار لاعب للتصويت عليه.',
  votesTied: 'التصويت متعادل. بدء إعادة التصويت.',
  votingComplete: 'تم استلام جميع الأصوات.',

  // Elimination
  eliminated: 'تم استبعاد {name}.',
  wasCitizen: 'كان {name} مواطناً.',
  wasCrook: 'كان {name} لصاً.',

  // Rewards
  rewardTitle: 'توزيع العملات',
  citizenEliminatedReward: 'تم استبعاد مواطن. تذهب عملاته إلى اللصوص.',
  crookEliminatedReward: 'تم استبعاد لص. تذهب عملاته إلى المواطنين الذين صوّتوا له.',
  eachCrookReceives: 'يحصل كل لص حي على',
  eachVotingCitizenReceives: 'يحصل كل مواطن صوّت لهذا اللص على',
  noVotingCitizens: 'لم يصوّت أي مواطن لهذا اللص. ضاعت العملات.',
  remainderNote: 'وُزّعت العملات المتبقية حسب ترتيب اللاعبين الثابت.',

  // Game Over
  citizensWin: 'فاز المواطنون',
  crooksWin: 'فاز اللصوص',
  citizensWinAllEliminated: 'تم استبعاد جميع اللصوص.',
  citizensWinBalance: 'كان رصيد المواطنين أعلى.',
  crooksWinBalance: 'كان أعلى رصيد للصوص أكبر من أعلى رصيد للمواطنين.',
  tiedBalance: 'تساوى أعلى رصيدين. يفوز المواطنون بالتعادل.',
  highestCrookBalance: 'أعلى رصيد للص',
  highestCitizenBalance: 'أعلى رصيد لمواطن',
  playAgain: 'العب مرة أخرى',
  newGame: 'لعبة جديدة',

  // Privacy
  imReady: 'أنا جاهز',
  hideInfo: 'اضغط لإخفاء',
  passToNext: 'مرر الهاتف للاعب التالي',
  finished: 'تم',
  yourTurn: 'دورك',
};

const dicts: Record<Language, Dict> = { en, ar };

export function translate(lang: Language, key: string, params?: Record<string, string | number>): string {
  let s = dicts[lang][key] ?? en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}
