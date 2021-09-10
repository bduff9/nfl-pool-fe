/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey and Billy Alexander
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see {http://www.gnu.org/licenses/}.
 * Home: https://asitewithnoname.com/
 */
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

export type ApiCall = {
	__typename?: 'APICall';
	apiCallDate: Scalars['DateTime'];
	apiCallError?: Maybe<Scalars['String']>;
	apiCallID: Scalars['String'];
	apiCallResponse?: Maybe<Scalars['String']>;
	apiCallUrl: Scalars['String'];
	apiCallWeek?: Maybe<Scalars['Int']>;
	apiCallYear: Scalars['Int'];
};

export type ApiCallResult = {
	__typename?: 'APICallResult';
	count: Scalars['Int'];
	hasMore: Scalars['Boolean'];
	lastKey?: Maybe<Scalars['String']>;
	results: Array<ApiCall>;
};

export type Account = {
	__typename?: 'Account';
	accountAccessToken?: Maybe<Scalars['String']>;
	accountAccessTokenExpires?: Maybe<Scalars['DateTime']>;
	accountAdded: Scalars['DateTime'];
	accountAddedBy: Scalars['String'];
	accountCompoundID: Scalars['String'];
	accountID: Scalars['Int'];
	accountProviderAccountID: Scalars['String'];
	accountProviderID: Scalars['String'];
	accountProviderType: Scalars['String'];
	accountRefreshToken?: Maybe<Scalars['String']>;
	accountUpdated: Scalars['DateTime'];
	accountUpdatedBy: Scalars['String'];
	user: User;
};

/** The filter type for the admin users screen */
export enum AdminUserType {
	All = 'All',
	Inactive = 'Inactive',
	Incomplete = 'Incomplete',
	Owes = 'Owes',
	Registered = 'Registered',
	Rookies = 'Rookies',
	Veterans = 'Veterans',
}

/** Is this from the morning (AM) or evening (PM)? */
export enum AmPm {
	Am = 'AM',
	Pm = 'PM',
}

/** The strategy to employ for auto picking */
export enum AutoPickStrategy {
	Away = 'Away',
	Home = 'Home',
	Random = 'Random',
}

export type Backup = {
	__typename?: 'Backup';
	backupDate: Scalars['DateTime'];
	backupName: Scalars['String'];
	backupWhen: AmPm;
};

/** User profile data */
export type EditMyProfileInput = {
	userAutoPickStrategy?: Maybe<AutoPickStrategy>;
	userFirstName: Scalars['String'];
	userLastName: Scalars['String'];
	userPaymentAccount: Scalars['String'];
	userPaymentType: PaymentMethod;
	userPhone?: Maybe<Scalars['String']>;
	userTeamName?: Maybe<Scalars['String']>;
};

export type Email = {
	__typename?: 'Email';
	createdAt: Scalars['DateTime'];
	emailID: Scalars['String'];
	emailType: EmailType;
	html?: Maybe<Scalars['String']>;
	sms?: Maybe<Scalars['String']>;
	subject?: Maybe<Scalars['String']>;
	textOnly?: Maybe<Scalars['String']>;
	to: Array<Scalars['String']>;
	toUsers: Array<User>;
	updatedAt?: Maybe<Scalars['DateTime']>;
};

export type EmailResult = {
	__typename?: 'EmailResult';
	count: Scalars['Int'];
	hasMore: Scalars['Boolean'];
	lastKey?: Maybe<Scalars['String']>;
	results: Array<Email>;
};

/** The group to send an email to */
export enum EmailSendTo {
	All = 'All',
	New = 'New',
	Registered = 'Registered',
	Unregistered = 'Unregistered',
}

/** The sent message type */
export enum EmailType {
	Custom = 'custom',
	Interest = 'interest',
	InterestFinal = 'interestFinal',
	InvalidGamesFound = 'invalidGamesFound',
	NewUser = 'newUser',
	PickReminder = 'pickReminder',
	PicksSubmitted = 'picksSubmitted',
	PrizesSet = 'prizesSet',
	QuickPick = 'quickPick',
	QuickPickConfirmation = 'quickPickConfirmation',
	SurvivorReminder = 'survivorReminder',
	Untrusted = 'untrusted',
	UserTrusted = 'userTrusted',
	Verification = 'verification',
	WeekEnded = 'weekEnded',
	WeekStarted = 'weekStarted',
	Weekly = 'weekly',
}

export type Faq = ISupportContent & {
	__typename?: 'FAQ';
	supportContentAdded: Scalars['DateTime'];
	supportContentAddedBy: Scalars['String'];
	supportContentCategory?: Maybe<Scalars['String']>;
	supportContentDescription: Scalars['String'];
	supportContentDescription2?: Maybe<Scalars['String']>;
	supportContentID: Scalars['Int'];
	supportContentKeywords?: Maybe<Scalars['String']>;
	supportContentOrder: Scalars['Int'];
	supportContentType: SupportContentType;
	supportContentUpdated: Scalars['DateTime'];
	supportContentUpdatedBy: Scalars['String'];
};

/** User registration data */
export type FinishRegistrationInput = {
	userFirstName: Scalars['String'];
	userLastName: Scalars['String'];
	userName: Scalars['String'];
	userPaymentAccount: Scalars['String'];
	userPaymentType: PaymentMethod;
	userPlaysSurvivor: Scalars['Boolean'];
	userReferredByRaw: Scalars['String'];
	userTeamName?: Maybe<Scalars['String']>;
};

export type Game = {
	__typename?: 'Game';
	gameAdded: Scalars['DateTime'];
	gameAddedBy: Scalars['String'];
	gameHomeScore: Scalars['Float'];
	gameHomeSpread?: Maybe<Scalars['Float']>;
	gameID: Scalars['Int'];
	gameKickoff: Scalars['DateTime'];
	gameNumber: Scalars['Int'];
	gameStatus: GameStatus;
	gameTimeLeftInQuarter: Scalars['String'];
	gameTimeLeftInSeconds: Scalars['Int'];
	gameUpdated: Scalars['DateTime'];
	gameUpdatedBy: Scalars['String'];
	gameVisitorScore: Scalars['Float'];
	gameVisitorSpread?: Maybe<Scalars['Float']>;
	gameWeek: Scalars['Int'];
	homeTeam: Team;
	teamHasPossession?: Maybe<Team>;
	teamInRedzone?: Maybe<Team>;
	visitorTeam: Team;
	winnerTeam?: Maybe<Team>;
};

/** The game's current status */
export enum GameStatus {
	Final = 'Final',
	FirstQuarter = 'FirstQuarter',
	FourthQuarter = 'FourthQuarter',
	HalfTime = 'HalfTime',
	Invalid = 'Invalid',
	Overtime = 'Overtime',
	Pregame = 'Pregame',
	SecondQuarter = 'SecondQuarter',
	ThirdQuarter = 'ThirdQuarter',
}

export type ISupportContent = {
	supportContentAdded: Scalars['DateTime'];
	supportContentAddedBy: Scalars['String'];
	supportContentDescription: Scalars['String'];
	supportContentID: Scalars['Int'];
	supportContentKeywords?: Maybe<Scalars['String']>;
	supportContentOrder: Scalars['Int'];
	supportContentType: SupportContentType;
	supportContentUpdated: Scalars['DateTime'];
	supportContentUpdatedBy: Scalars['String'];
};

export type League = {
	__typename?: 'League';
	admin?: Maybe<User>;
	leagueAdded: Scalars['DateTime'];
	leagueAddedBy: Scalars['String'];
	leagueID: Scalars['Int'];
	leagueName: Scalars['String'];
	leagueUpdated: Scalars['DateTime'];
	leagueUpdatedBy: Scalars['String'];
	userLeagues: Array<UserLeague>;
};

export type Log = {
	__typename?: 'Log';
	league?: Maybe<League>;
	logAction: LogAction;
	logAdded: Scalars['DateTime'];
	logAddedBy: Scalars['String'];
	logData?: Maybe<Scalars['String']>;
	logDate: Scalars['DateTime'];
	logID: Scalars['Int'];
	logMessage?: Maybe<Scalars['String']>;
	logUpdated: Scalars['DateTime'];
	logUpdatedBy: Scalars['String'];
	user?: Maybe<User>;
};

/** The logged action type */
export enum LogAction {
	AuthenticationError = 'AuthenticationError',
	BackupRestore = 'BackupRestore',
	CreatedAccount = 'CreatedAccount',
	EmailActivity = 'EmailActivity',
	Error404 = 'Error404',
	LinkedAccount = 'LinkedAccount',
	Login = 'Login',
	Logout = 'Logout',
	Message = 'Message',
	Paid = 'Paid',
	Register = 'Register',
	Slack = 'Slack',
	SubmitPicks = 'SubmitPicks',
	SupportSearch = 'SupportSearch',
	SurvivorPick = 'SurvivorPick',
	Unsubscribe = 'Unsubscribe',
	ViewHtmlEmail = 'ViewHTMLEmail',
}

export type LogResult = {
	__typename?: 'LogResult';
	count: Scalars['Int'];
	page: Scalars['Int'];
	results: Array<Log>;
	totalCount: Scalars['Int'];
};

/** Survivor pick data */
export type MakeSurvivorPickInput = {
	gameID: Scalars['Int'];
	survivorPickWeek: Scalars['Int'];
	teamID: Scalars['Int'];
};

export type Mutation = {
	__typename?: 'Mutation';
	autoPick: Array<Pick>;
	editMyProfile: User;
	finishRegistration: User;
	makeSurvivorPick: SurvivorPick;
	quickPick: Scalars['Boolean'];
	registerForSurvivor: Scalars['Boolean'];
	removeUser: Scalars['Boolean'];
	resetMyPicksForWeek: Array<Pick>;
	restoreBackup: Scalars['Boolean'];
	sendAdminEmail: Scalars['Boolean'];
	setMyPick?: Maybe<Pick>;
	setPrizeAmounts: Scalars['Boolean'];
	submitPicksForWeek: Tiebreaker;
	toggleSurvivor: Scalars['Boolean'];
	trustUser: Scalars['Boolean'];
	unregisterForSurvivor: Scalars['Boolean'];
	unsubscribeEmail: Scalars['Boolean'];
	updateMyNotifications: Array<Notification>;
	updateMyTiebreakerScore: Tiebreaker;
	updateUserPaid: Scalars['Int'];
	updateUserPayout: Scalars['Int'];
	writeLog: Log;
};

export type MutationAutoPickArgs = {
	Type: AutoPickStrategy;
	Week: Scalars['Int'];
};

export type MutationEditMyProfileArgs = {
	data: EditMyProfileInput;
};

export type MutationFinishRegistrationArgs = {
	data: FinishRegistrationInput;
};

export type MutationMakeSurvivorPickArgs = {
	data: MakeSurvivorPickInput;
};

export type MutationQuickPickArgs = {
	TeamID: Scalars['Int'];
	UserID: Scalars['Int'];
};

export type MutationRemoveUserArgs = {
	UserID: Scalars['Int'];
};

export type MutationResetMyPicksForWeekArgs = {
	Week: Scalars['Int'];
};

export type MutationRestoreBackupArgs = {
	BackupName: Scalars['String'];
};

export type MutationSendAdminEmailArgs = {
	EmailType: EmailType;
	ExtraData?: Maybe<Scalars['String']>;
	SendTo: EmailSendTo;
	UserEmail?: Maybe<Scalars['String']>;
	UserFirstname?: Maybe<Scalars['String']>;
};

export type MutationSetMyPickArgs = {
	GameID?: Maybe<Scalars['Int']>;
	Points: Scalars['Int'];
	TeamID?: Maybe<Scalars['Int']>;
	Week: Scalars['Int'];
};

export type MutationSetPrizeAmountsArgs = {
	OverallPrizes: Scalars['String'];
	SurvivorPrizes: Scalars['String'];
	WeeklyPrizes: Scalars['String'];
};

export type MutationSubmitPicksForWeekArgs = {
	Week: Scalars['Int'];
};

export type MutationToggleSurvivorArgs = {
	IsPlaying: Scalars['Boolean'];
	UserID: Scalars['Int'];
};

export type MutationTrustUserArgs = {
	ReferredByUserID: Scalars['Int'];
	UserID: Scalars['Int'];
};

export type MutationUnsubscribeEmailArgs = {
	email: Scalars['String'];
};

export type MutationUpdateMyNotificationsArgs = {
	data: Array<NotificationInput>;
};

export type MutationUpdateMyTiebreakerScoreArgs = {
	Score: Scalars['Int'];
	Week: Scalars['Int'];
};

export type MutationUpdateUserPaidArgs = {
	AmountPaid: Scalars['Float'];
	UserID: Scalars['Int'];
};

export type MutationUpdateUserPayoutArgs = {
	AmountPaid: Scalars['Float'];
	UserID: Scalars['Int'];
};

export type MutationWriteLogArgs = {
	data: WriteLogInput;
};

export type Notification = {
	__typename?: 'Notification';
	notificationAdded: Scalars['DateTime'];
	notificationAddedBy: Scalars['String'];
	notificationDefinition: NotificationType;
	notificationEmail?: Maybe<Scalars['Boolean']>;
	notificationEmailHoursBefore?: Maybe<Scalars['Int']>;
	notificationID: Scalars['Int'];
	notificationPushNotification?: Maybe<Scalars['Boolean']>;
	notificationPushNotificationHoursBefore?: Maybe<Scalars['Int']>;
	notificationSMS?: Maybe<Scalars['Boolean']>;
	notificationSMSHoursBefore?: Maybe<Scalars['Int']>;
	notificationUpdated: Scalars['DateTime'];
	notificationUpdatedBy: Scalars['String'];
	user: User;
};

/** Notification data */
export type NotificationInput = {
	notificationEmail?: Maybe<Scalars['Boolean']>;
	notificationEmailHoursBefore?: Maybe<Scalars['Int']>;
	notificationPushNotification?: Maybe<Scalars['Boolean']>;
	notificationPushNotificationHoursBefore?: Maybe<Scalars['Int']>;
	notificationSMS?: Maybe<Scalars['Boolean']>;
	notificationSMSHoursBefore?: Maybe<Scalars['Int']>;
	notificationType: Scalars['String'];
};

export type NotificationType = {
	__typename?: 'NotificationType';
	notificationType: Scalars['String'];
	notificationTypeAdded: Scalars['DateTime'];
	notificationTypeAddedBy: Scalars['String'];
	notificationTypeDescription: Scalars['String'];
	notificationTypeHasEmail: Scalars['Boolean'];
	notificationTypeHasHours: Scalars['Boolean'];
	notificationTypeHasPushNotification: Scalars['Boolean'];
	notificationTypeHasSMS: Scalars['Boolean'];
	notificationTypeTooltip?: Maybe<Scalars['String']>;
	notificationTypeUpdated: Scalars['DateTime'];
	notificationTypeUpdatedBy: Scalars['String'];
};

export type OverallMv = {
	__typename?: 'OverallMV';
	gamesCorrect: Scalars['Int'];
	gamesMissed: Scalars['Int'];
	gamesPossible: Scalars['Int'];
	gamesTotal: Scalars['Int'];
	gamesWrong: Scalars['Int'];
	isEliminated: Scalars['Boolean'];
	lastUpdated: Scalars['DateTime'];
	pointsEarned: Scalars['Int'];
	pointsPossible: Scalars['Int'];
	pointsTotal: Scalars['Int'];
	pointsWrong: Scalars['Int'];
	rank: Scalars['Int'];
	teamName: Scalars['String'];
	tied: Scalars['Boolean'];
	user: User;
	userID: Scalars['Int'];
	userName: Scalars['String'];
};

export type Payment = {
	__typename?: 'Payment';
	paymentAdded: Scalars['DateTime'];
	paymentAddedBy: Scalars['String'];
	paymentAmount: Scalars['Float'];
	paymentDescription: Scalars['String'];
	paymentID: Scalars['Int'];
	paymentType: PaymentType;
	paymentUpdated: Scalars['DateTime'];
	paymentUpdatedBy: Scalars['String'];
	paymentWeek?: Maybe<Scalars['Int']>;
	user: User;
};

/** The chosen payment method for the user */
export enum PaymentMethod {
	Paypal = 'Paypal',
	Venmo = 'Venmo',
	Zelle = 'Zelle',
}

/** The payment type for the payment */
export enum PaymentType {
	Fee = 'Fee',
	Paid = 'Paid',
	Payout = 'Payout',
	Prize = 'Prize',
}

export type Pick = {
	__typename?: 'Pick';
	game: Game;
	league: League;
	pickAdded: Scalars['DateTime'];
	pickAddedBy: Scalars['String'];
	pickID: Scalars['Int'];
	pickPoints?: Maybe<Scalars['Int']>;
	pickUpdated: Scalars['DateTime'];
	pickUpdatedBy: Scalars['String'];
	team?: Maybe<Team>;
	user: User;
};

export type Query = {
	__typename?: 'Query';
	getAllPicksForWeek: Array<Pick>;
	getBackups: Array<Backup>;
	getCurrentUser: User;
	getEmail: Email;
	getFAQs: Array<Faq>;
	getGame: Game;
	getGamesForWeek: Array<Game>;
	getLogs: LogResult;
	getMyAlerts: Array<Scalars['String']>;
	getMyNotifications: Array<Notification>;
	getMyOverallDashboard?: Maybe<OverallMv>;
	getMyPayments: Array<Payment>;
	getMyPicksForWeek: Array<Pick>;
	getMySurvivorDashboard?: Maybe<SurvivorMv>;
	getMySurvivorPickForWeek?: Maybe<SurvivorPick>;
	getMySurvivorPicks: Array<SurvivorPick>;
	getMyTiebreakerForWeek?: Maybe<Tiebreaker>;
	getMyWeeklyDashboard?: Maybe<WeeklyMv>;
	getOverallRankings: Array<OverallMv>;
	getOverallRankingsTotalCount: Scalars['Int'];
	getOverallTiedWithMeCount: Scalars['Int'];
	getRegisteredCount: Scalars['Float'];
	getRules: Array<Rule>;
	getSurvivorCount: Scalars['Float'];
	getSurvivorOverallCount: Scalars['Int'];
	getSurvivorRankings: Array<SurvivorMv>;
	getSurvivorStatus: SeasonStatus;
	getSurvivorWeekCount: Scalars['Int'];
	getSystemValue: SystemValue;
	getTeamsOnBye: Array<Team>;
	getUserPaymentsForAdmin: Array<User>;
	getUsersForAdmins: Array<User>;
	getWeek: Week;
	getWeekInProgress?: Maybe<Scalars['Int']>;
	getWeeklyRankings: Array<WeeklyMv>;
	getWeeklyRankingsTotalCount: Scalars['Int'];
	getWeeklyTiedWithMeCount: Scalars['Int'];
	hasSocialLinked: Scalars['Boolean'];
	isAliveInSurvivor: Scalars['Boolean'];
	loadAPICalls: ApiCallResult;
	loadEmails: EmailResult;
	validatePicksForWeek: Scalars['Boolean'];
};

export type QueryGetAllPicksForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetEmailArgs = {
	EmailID: Scalars['String'];
};

export type QueryGetGameArgs = {
	GameID: Scalars['Int'];
};

export type QueryGetGamesForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetLogsArgs = {
	LogAction?: Maybe<LogAction>;
	Page?: Maybe<Scalars['Int']>;
	PerPage: Scalars['Int'];
	Sort: Scalars['String'];
	SortDir: Scalars['String'];
	UserID?: Maybe<Scalars['Int']>;
};

export type QueryGetMyPicksForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetMySurvivorPickForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetMyTiebreakerForWeekArgs = {
	Week: Scalars['Int'];
};

export type QueryGetMyWeeklyDashboardArgs = {
	Week: Scalars['Int'];
};

export type QueryGetSurvivorOverallCountArgs = {
	Type?: Maybe<Scalars['Boolean']>;
};

export type QueryGetSurvivorWeekCountArgs = {
	Type?: Maybe<SurvivorStatus>;
};

export type QueryGetSystemValueArgs = {
	Name: Scalars['String'];
};

export type QueryGetTeamsOnByeArgs = {
	Week: Scalars['Int'];
};

export type QueryGetUsersForAdminsArgs = {
	UserType: AdminUserType;
};

export type QueryGetWeekArgs = {
	Week?: Maybe<Scalars['Int']>;
};

export type QueryGetWeeklyRankingsArgs = {
	Week: Scalars['Int'];
};

export type QueryGetWeeklyRankingsTotalCountArgs = {
	Week: Scalars['Int'];
};

export type QueryGetWeeklyTiedWithMeCountArgs = {
	Week: Scalars['Int'];
};

export type QueryHasSocialLinkedArgs = {
	Type: Scalars['String'];
};

export type QueryLoadApiCallsArgs = {
	Count: Scalars['Int'];
	LastKey?: Maybe<Scalars['String']>;
};

export type QueryLoadEmailsArgs = {
	Count: Scalars['Int'];
	LastKey?: Maybe<Scalars['String']>;
};

export type QueryValidatePicksForWeekArgs = {
	LastScore: Scalars['Int'];
	Unused: Scalars['String'];
	Week: Scalars['Int'];
};

export type Rule = ISupportContent & {
	__typename?: 'Rule';
	supportContentAdded: Scalars['DateTime'];
	supportContentAddedBy: Scalars['String'];
	supportContentDescription: Scalars['String'];
	supportContentID: Scalars['Int'];
	supportContentKeywords?: Maybe<Scalars['String']>;
	supportContentOrder: Scalars['Int'];
	supportContentType: SupportContentType;
	supportContentUpdated: Scalars['DateTime'];
	supportContentUpdatedBy: Scalars['String'];
};

/** The status of the season */
export enum SeasonStatus {
	Complete = 'Complete',
	InProgress = 'InProgress',
	NotStarted = 'NotStarted',
}

/** The type of support content */
export enum SupportContentType {
	Faq = 'FAQ',
	Rule = 'Rule',
}

export type SurvivorMv = {
	__typename?: 'SurvivorMV';
	allPicks: Array<SurvivorPick>;
	currentStatus?: Maybe<SurvivorStatus>;
	isAliveOverall: Scalars['Boolean'];
	lastPick?: Maybe<Scalars['Int']>;
	lastPickTeam?: Maybe<Team>;
	lastUpdated: Scalars['DateTime'];
	rank: Scalars['Int'];
	teamName: Scalars['String'];
	tied: Scalars['Boolean'];
	user: User;
	userID: Scalars['Int'];
	userName: Scalars['String'];
	weeksAlive: Scalars['Int'];
};

export type SurvivorPick = {
	__typename?: 'SurvivorPick';
	game?: Maybe<Game>;
	league: League;
	survivorPickAdded: Scalars['DateTime'];
	survivorPickAddedBy: Scalars['String'];
	survivorPickID: Scalars['Int'];
	survivorPickUpdated: Scalars['DateTime'];
	survivorPickUpdatedBy: Scalars['String'];
	survivorPickWeek: Scalars['Int'];
	team?: Maybe<Team>;
	user: User;
};

/** The current status of a survivor player */
export enum SurvivorStatus {
	Alive = 'Alive',
	Dead = 'Dead',
	Waiting = 'Waiting',
}

export type SystemValue = {
	__typename?: 'SystemValue';
	systemValueAdded: Scalars['DateTime'];
	systemValueAddedBy: Scalars['String'];
	systemValueID: Scalars['Int'];
	systemValueName: Scalars['String'];
	systemValueUpdated: Scalars['DateTime'];
	systemValueUpdatedBy: Scalars['String'];
	systemValueValue?: Maybe<Scalars['String']>;
};

export type Team = {
	__typename?: 'Team';
	teamAdded: Scalars['DateTime'];
	teamAddedBy: Scalars['String'];
	teamAltShortName: Scalars['String'];
	teamByeWeek: Scalars['Int'];
	teamCity: Scalars['String'];
	teamConference: TeamConference;
	teamDivision: TeamDivision;
	teamHistory: Array<Game>;
	teamID: Scalars['Int'];
	teamLogo: Scalars['String'];
	teamName: Scalars['String'];
	teamPassDefenseRank?: Maybe<Scalars['Int']>;
	teamPassOffenseRank?: Maybe<Scalars['Int']>;
	teamPrimaryColor: Scalars['String'];
	teamRecord: Scalars['String'];
	teamRushDefenseRank?: Maybe<Scalars['Int']>;
	teamRushOffenseRank?: Maybe<Scalars['Int']>;
	teamSecondaryColor: Scalars['String'];
	teamShortName: Scalars['String'];
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

export type Tiebreaker = {
	__typename?: 'Tiebreaker';
	league?: Maybe<League>;
	tiebreakerAdded: Scalars['DateTime'];
	tiebreakerAddedBy: Scalars['String'];
	tiebreakerHasSubmitted: Scalars['Boolean'];
	tiebreakerID: Scalars['Int'];
	tiebreakerLastScore: Scalars['Int'];
	tiebreakerUpdated: Scalars['DateTime'];
	tiebreakerUpdatedBy: Scalars['String'];
	tiebreakerWeek: Scalars['Int'];
	user?: Maybe<User>;
};

export type User = {
	__typename?: 'User';
	accounts: Array<Account>;
	notifications: Array<Notification>;
	payments: Array<Payment>;
	userAdded: Scalars['DateTime'];
	userAddedBy: Scalars['String'];
	userAutoPickStrategy?: Maybe<AutoPickStrategy>;
	userAutoPicksLeft: Scalars['Int'];
	userBalance: Scalars['Float'];
	userCommunicationsOptedOut: Scalars['Boolean'];
	userDoneRegistering: Scalars['Boolean'];
	userEmail: Scalars['String'];
	userEmailVerified?: Maybe<Scalars['DateTime']>;
	userFirstName?: Maybe<Scalars['String']>;
	userID: Scalars['Int'];
	userImage?: Maybe<Scalars['String']>;
	userIsAdmin: Scalars['Boolean'];
	userLastName?: Maybe<Scalars['String']>;
	userLeagues: Array<UserLeague>;
	userName?: Maybe<Scalars['String']>;
	userOwes: Scalars['Float'];
	userPaid: Scalars['Float'];
	userPaidOut: Scalars['Float'];
	userPaymentAccount?: Maybe<Scalars['String']>;
	userPaymentType?: Maybe<PaymentMethod>;
	userPhone?: Maybe<Scalars['String']>;
	userPlaysSurvivor: Scalars['Boolean'];
	userReferredByRaw?: Maybe<Scalars['String']>;
	userReferredByUser?: Maybe<User>;
	userTeamName?: Maybe<Scalars['String']>;
	userTrusted?: Maybe<Scalars['Boolean']>;
	userUpdated: Scalars['DateTime'];
	userUpdatedBy: Scalars['String'];
	userWon: Scalars['Float'];
	yearsPlayed: Scalars['String'];
};

export type UserLeague = {
	__typename?: 'UserLeague';
	league: League;
	user: User;
	userLeagueAdded: Scalars['DateTime'];
	userLeagueAddedBy: Scalars['String'];
	userLeagueID: Scalars['Int'];
	userLeagueUpdated: Scalars['DateTime'];
	userLeagueUpdatedBy: Scalars['String'];
};

export type Week = {
	__typename?: 'Week';
	seasonStatus: SeasonStatus;
	weekFirstGame: Game;
	weekLastGame: Game;
	weekNumber: Scalars['Int'];
	weekNumberOfGames: Scalars['Int'];
	weekStarts: Scalars['DateTime'];
	weekStatus: WeekStatus;
};

/** The status of the week */
export enum WeekStatus {
	Complete = 'Complete',
	InProgress = 'InProgress',
	NotStarted = 'NotStarted',
}

export type WeeklyMv = {
	__typename?: 'WeeklyMV';
	gamesCorrect: Scalars['Int'];
	gamesMissed: Scalars['Int'];
	gamesPossible: Scalars['Int'];
	gamesTotal: Scalars['Int'];
	gamesWrong: Scalars['Int'];
	isEliminated: Scalars['Boolean'];
	lastScore?: Maybe<Scalars['Int']>;
	lastUpdated: Scalars['DateTime'];
	pointsEarned: Scalars['Int'];
	pointsPossible: Scalars['Int'];
	pointsTotal: Scalars['Int'];
	pointsWrong: Scalars['Int'];
	rank: Scalars['Int'];
	teamName: Scalars['String'];
	tiebreakerDiffAbsolute?: Maybe<Scalars['Int']>;
	tiebreakerIsUnder: Scalars['Boolean'];
	tiebreakerScore?: Maybe<Scalars['Int']>;
	tied: Scalars['Boolean'];
	user: User;
	userID: Scalars['Int'];
	userName: Scalars['String'];
	week: Scalars['Int'];
};

/** New log data */
export type WriteLogInput = {
	leagueID?: Maybe<Scalars['Int']>;
	logAction: LogAction;
	logDataString?: Maybe<Scalars['String']>;
	logMessage?: Maybe<Scalars['String']>;
	sub?: Maybe<Scalars['String']>;
};
