export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
	{ [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
	{ [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
	DateTime: any;
};

export type Query = {
	__typename?: 'Query';
	hasSocialLinked: Scalars['Boolean'];
	getAPICallsForWeek: Array<ApiCall>;
	getEmail: Email;
	getFAQs: Array<Faq>;
	getGame: Game;
	getCurrentWeek: Scalars['Int'];
	getHistoryForYear: Array<History>;
	getAllLeagues: Array<League>;
	getLeaguesForUser: Array<UserLeague>;
	getLogs: Array<Log>;
	getNotificationsForUser: Array<Notification>;
	getMyPayments: Array<Payment>;
	getAllPicksForWeek: Array<Pick>;
	getMyPicksForWeek: Array<Pick>;
	getRules: Array<Rule>;
	getAllSurvivorPicksForWeek: Array<SurvivorPick>;
	getMySurvivorPicks: Array<SurvivorPick>;
	isAliveInSurvivor: Scalars['Boolean'];
	getSystemValue: SystemValue;
	getTeam: Team;
	getTeams: Array<Team>;
	getMyTiebreakerForWeek: Tiebreaker;
	getTiebreakersForWeek: Array<Tiebreaker>;
	getCurrentUser: User;
	getUsers: Array<User>;
	getWeek: Week;
};

export type QueryHasSocialLinkedArgs = {
	Type: Scalars['String'];
};

export type QueryGetApiCallsForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetEmailArgs = {
	EmailID: Scalars['String'];
};

export type QueryGetGameArgs = {
	GameID: Scalars['Int'];
};

export type QueryGetHistoryForYearArgs = {
	Year: Scalars['Int'];
};

export type QueryGetLeaguesForUserArgs = {
	UserID: Scalars['Int'];
};

export type QueryGetNotificationsForUserArgs = {
	UserID: Scalars['Int'];
};

export type QueryGetAllPicksForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetMyPicksForWeekArgs = {
	UserID: Scalars['Int'];
	Week: Scalars['Int'];
};

export type QueryGetAllSurvivorPicksForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetSystemValueArgs = {
	Name: Scalars['String'];
};

export type QueryGetTeamArgs = {
	TeamShort: Scalars['String'];
};

export type QueryGetMyTiebreakerForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetTiebreakersForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetWeekArgs = {
	Week?: Maybe<Scalars['Int']>;
};

export type ApiCall = {
	__typename?: 'APICall';
	apiCallID: Scalars['Int'];
	apiCallDate: Scalars['DateTime'];
	apiCallError?: Maybe<Scalars['String']>;
	apiCallResponse?: Maybe<Scalars['String']>;
	apiCallURL: Scalars['String'];
	apiCallWeek?: Maybe<Scalars['Int']>;
	apiCallYear: Scalars['Int'];
	apiCallAdded: Scalars['DateTime'];
	apiCallAddedBy: Scalars['String'];
	apiCallUpdated: Scalars['DateTime'];
	apiCallUpdatedBy: Scalars['String'];
};

export type Email = {
	__typename?: 'Email';
	emailID: Scalars['String'];
	emailType: EmailType;
	toUsers: Array<User>;
	subject?: Maybe<Scalars['String']>;
	html?: Maybe<Scalars['String']>;
	textOnly?: Maybe<Scalars['String']>;
	sms?: Maybe<Scalars['String']>;
	createdAt: Scalars['DateTime'];
	updatedAt?: Maybe<Scalars['DateTime']>;
};

/** The sent message type */
export enum EmailType {
	NewUser = 'newUser',
	Untrusted = 'untrusted',
	Verification = 'verification',
}

export type User = {
	__typename?: 'User';
	userID: Scalars['Int'];
	userEmail: Scalars['String'];
	userPhone?: Maybe<Scalars['String']>;
	userName?: Maybe<Scalars['String']>;
	userFirstName?: Maybe<Scalars['String']>;
	userLastName?: Maybe<Scalars['String']>;
	userTeamName?: Maybe<Scalars['String']>;
	userImage?: Maybe<Scalars['String']>;
	userReferredByRaw?: Maybe<Scalars['String']>;
	userReferredByUser?: Maybe<User>;
	userEmailVerified?: Maybe<Scalars['DateTime']>;
	userTrusted?: Maybe<Scalars['Boolean']>;
	userDoneRegistering: Scalars['Boolean'];
	userIsAdmin: Scalars['Boolean'];
	userPlaysSurvivor: Scalars['Boolean'];
	userPaymentType?: Maybe<PaymentType>;
	userPaymentAccount?: Maybe<Scalars['String']>;
	userPaid: Scalars['Float'];
	userAutoPicksLeft: Scalars['Int'];
	userAutoPickStrategy?: Maybe<AutoPickStrategy>;
	notifications: Notification;
	userLeagues: Array<UserLeague>;
	userAdded: Scalars['DateTime'];
	userAddedBy: Scalars['String'];
	userUpdated: Scalars['DateTime'];
	userUpdatedBy: Scalars['String'];
};

/** The chosen payment type for the user */
export enum PaymentType {
	Paypal = 'Paypal',
	Venmo = 'Venmo',
	Zelle = 'Zelle',
}

/** The strategy to employ for auto picking */
export enum AutoPickStrategy {
	Away = 'Away',
	Home = 'Home',
	Random = 'Random',
}

export type Notification = {
	__typename?: 'Notification';
	notificationID: Scalars['Int'];
	user: User;
	notificationType: NotificationType;
	notificationHoursBefore: Scalars['Int'];
	notificationAdded: Scalars['DateTime'];
	notificationAddedBy: Scalars['String'];
	notificationUpdated: Scalars['DateTime'];
	notificationUpdatedBy: Scalars['String'];
};

/** The type of the notification */
export enum NotificationType {
	Email = 'Email',
	QuickPickEmail = 'QuickPickEmail',
	Sms = 'SMS',
}

export type UserLeague = {
	__typename?: 'UserLeague';
	userLeagueID: Scalars['Int'];
	user: User;
	league: League;
	userLeagueAdded: Scalars['DateTime'];
	userLeagueAddedBy: Scalars['String'];
	userLeagueUpdated: Scalars['DateTime'];
	userLeagueUpdatedBy: Scalars['String'];
};

export type League = {
	__typename?: 'League';
	leagueID: Scalars['Int'];
	leagueName: Scalars['String'];
	admin?: Maybe<User>;
	leagueAdded: Scalars['DateTime'];
	leagueAddedBy: Scalars['String'];
	leagueUpdated: Scalars['DateTime'];
	leagueUpdatedBy: Scalars['String'];
	userLeagues: Array<UserLeague>;
};

export type Faq = ISupportContent & {
	__typename?: 'FAQ';
	supportContentID: Scalars['Int'];
	supportContentType: SupportContentType;
	supportContentOrder: Scalars['Int'];
	supportContentDescription: Scalars['String'];
	supportContentKeywords?: Maybe<Scalars['String']>;
	supportContentAdded: Scalars['DateTime'];
	supportContentAddedBy: Scalars['String'];
	supportContentUpdated: Scalars['DateTime'];
	supportContentUpdatedBy: Scalars['String'];
	supportContentDescription2?: Maybe<Scalars['String']>;
	supportContentCategory?: Maybe<Scalars['String']>;
};

export type ISupportContent = {
	supportContentID: Scalars['Int'];
	supportContentType: SupportContentType;
	supportContentOrder: Scalars['Int'];
	supportContentDescription: Scalars['String'];
	supportContentKeywords?: Maybe<Scalars['String']>;
	supportContentAdded: Scalars['DateTime'];
	supportContentAddedBy: Scalars['String'];
	supportContentUpdated: Scalars['DateTime'];
	supportContentUpdatedBy: Scalars['String'];
};

/** The type of support content */
export enum SupportContentType {
	Faq = 'FAQ',
	Rule = 'Rule',
}

export type Game = {
	__typename?: 'Game';
	gameID: Scalars['Int'];
	gameWeek: Scalars['Int'];
	gameNumber: Scalars['Int'];
	homeTeam: Team;
	gameHomeSpread?: Maybe<Scalars['Float']>;
	visitorTeam: Team;
	gameVisitorSpread?: Maybe<Scalars['Float']>;
	winnerTeam?: Maybe<Team>;
	gameStatus: GameStatus;
	gameKickoff: Scalars['DateTime'];
	gameTimeLeftInSeconds: Scalars['Int'];
	teamHasPossession?: Maybe<Team>;
	teamInRedzone?: Maybe<Team>;
	gameAdded: Scalars['DateTime'];
	gameAddedBy: Scalars['String'];
	gameUpdated: Scalars['DateTime'];
	gameUpdatedBy: Scalars['String'];
};

export type Team = {
	__typename?: 'Team';
	teamID: Scalars['Int'];
	teamCity: Scalars['String'];
	teamName: Scalars['String'];
	teamShortName: Scalars['String'];
	teamAltShortName: Scalars['String'];
	teamConference: TeamConference;
	teamDivision: TeamDivision;
	teamLogo: Scalars['String'];
	teamPrimaryColor: Scalars['String'];
	teamSecondaryColor: Scalars['String'];
	teamRushDefenseRank?: Maybe<Scalars['Int']>;
	teamPassDefenseRank?: Maybe<Scalars['Int']>;
	teamRushOffenseRank?: Maybe<Scalars['Int']>;
	teamPassOffenseRank?: Maybe<Scalars['Int']>;
	teamByeWeek: Scalars['Int'];
	teamAdded: Scalars['DateTime'];
	teamAddedBy: Scalars['String'];
	teamUpdated: Scalars['DateTime'];
	teamUpdatedBy: Scalars['String'];
};

/** The NFL conference of the team */
export enum TeamConference {
	Afc = 'AFC',
	Nfc = 'NFC',
}

/** The NFL division of the team */
export enum TeamDivision {
	East = 'East',
	North = 'North',
	South = 'South',
	West = 'West',
}

/** The game's current status */
export enum GameStatus {
	Pregame = 'Pregame',
	Incomplete = 'Incomplete',
	Q1 = 'Q1',
	Q2 = 'Q2',
	Halftime = 'Halftime',
	Q3 = 'Q3',
	Q4 = 'Q4',
	Complete = 'Complete',
}

export type History = {
	__typename?: 'History';
	historyID: Scalars['Int'];
	user: User;
	league: League;
	historyYear: Scalars['Int'];
	historyType: HistoryType;
	historyWeek?: Maybe<Scalars['Int']>;
	historyPlace: Scalars['Int'];
	historyAdded: Scalars['DateTime'];
	historyAddedBy: Scalars['String'];
	historyUpdated: Scalars['DateTime'];
	historyUpdatedBy: Scalars['String'];
};

/** The type of the history item */
export enum HistoryType {
	Overall = 'Overall',
	Survivor = 'Survivor',
	Weekly = 'Weekly',
}

export type Log = {
	__typename?: 'Log';
	logID: Scalars['Int'];
	logAction: LogAction;
	logDate: Scalars['DateTime'];
	logMessage?: Maybe<Scalars['String']>;
	user?: Maybe<User>;
	league?: Maybe<League>;
	logIsRead?: Maybe<Scalars['Boolean']>;
	logIsDeleted?: Maybe<Scalars['Boolean']>;
	toUser?: Maybe<User>;
	logAdded: Scalars['DateTime'];
	logAddedBy: Scalars['String'];
	logUpdated: Scalars['DateTime'];
	logUpdatedBy: Scalars['String'];
};

/** The logged action type */
export enum LogAction {
	Error404 = 'Error404',
	AuthenticationError = 'AuthenticationError',
	CreatedAccount = 'CreatedAccount',
	LinkedAccount = 'LinkedAccount',
	Login = 'Login',
	Logout = 'Logout',
	Message = 'Message',
	Paid = 'Paid',
	Register = 'Register',
	Slack = 'Slack',
	SubmitPicks = 'SubmitPicks',
	SurvivorPick = 'SurvivorPick',
}

export type Payment = {
	__typename?: 'Payment';
	paymentDescription: Scalars['String'];
	paymentWeek?: Maybe<Scalars['Int']>;
	paymentAmount: Scalars['Float'];
	paymentUser: User;
};

export type Pick = {
	__typename?: 'Pick';
	pickID: Scalars['Int'];
	user: User;
	league: League;
	game: Game;
	team?: Maybe<Team>;
	pickPoints?: Maybe<Scalars['Int']>;
	pickAdded: Scalars['DateTime'];
	pickAddedBy: Scalars['String'];
	pickUpdated: Scalars['DateTime'];
	pickUpdatedBy: Scalars['String'];
};

export type Rule = ISupportContent & {
	__typename?: 'Rule';
	supportContentID: Scalars['Int'];
	supportContentType: SupportContentType;
	supportContentOrder: Scalars['Int'];
	supportContentDescription: Scalars['String'];
	supportContentKeywords?: Maybe<Scalars['String']>;
	supportContentAdded: Scalars['DateTime'];
	supportContentAddedBy: Scalars['String'];
	supportContentUpdated: Scalars['DateTime'];
	supportContentUpdatedBy: Scalars['String'];
};

export type SurvivorPick = {
	__typename?: 'SurvivorPick';
	survivorPickID: Scalars['Int'];
	user: User;
	league: League;
	survivorPickWeek: Scalars['Int'];
	game?: Maybe<Game>;
	team?: Maybe<Team>;
	survivorPickAdded: Scalars['DateTime'];
	survivorPickAddedBy: Scalars['String'];
	survivorPickUpdated: Scalars['DateTime'];
	survivorPickUpdatedBy: Scalars['String'];
};

export type SystemValue = {
	__typename?: 'SystemValue';
	systemValueID: Scalars['Int'];
	systemValueName: Scalars['String'];
	systemValueValue?: Maybe<Scalars['String']>;
	systemValueAdded: Scalars['DateTime'];
	systemValueAddedBy: Scalars['String'];
	systemValueUpdated: Scalars['DateTime'];
	systemValueUpdatedBy: Scalars['String'];
};

export type Tiebreaker = {
	__typename?: 'Tiebreaker';
	tiebreakerID: Scalars['Int'];
	user?: Maybe<User>;
	league?: Maybe<League>;
	tiebreakerWeek: Scalars['Int'];
	tiebreakerLastScore?: Maybe<Scalars['Int']>;
	tiebreakerHasSubmitted: Scalars['Boolean'];
	tiebreakerAdded: Scalars['DateTime'];
	tiebreakerAddedBy: Scalars['String'];
	tiebreakerUpdated: Scalars['DateTime'];
	tiebreakerUpdatedBy: Scalars['String'];
};

export type Week = {
	__typename?: 'Week';
	weekNumber: Scalars['Int'];
	weekStarts: Scalars['DateTime'];
	weekStatus: WeekStatus;
	weekFirstGame: Game;
	weekLastGame: Game;
	weekNumberOfGames: Scalars['Int'];
};

/** The status of the week */
export enum WeekStatus {
	Complete = 'Complete',
	InProgress = 'InProgress',
	NotStarted = 'NotStarted',
}

export type Mutation = {
	__typename?: 'Mutation';
	writeLog: Log;
	finishRegistration: User;
};

export type MutationWriteLogArgs = {
	data: WriteLogInput;
};

export type MutationFinishRegistrationArgs = {
	data: FinishRegistrationInput;
};

/** New log data */
export type WriteLogInput = {
	logAction: LogAction;
	logMessage: Scalars['String'];
	leagueID?: Maybe<Scalars['Int']>;
	sub?: Maybe<Scalars['String']>;
};

/** User registration data */
export type FinishRegistrationInput = {
	userFirstName: Scalars['String'];
	userLastName: Scalars['String'];
	userName: Scalars['String'];
	userPaymentAccount: Scalars['String'];
	userPaymentType: PaymentType;
	userPlaysSurvivor: Scalars['Boolean'];
	userReferredByRaw: Scalars['String'];
	userTeamName?: Maybe<Scalars['String']>;
};
