-- CreateTable
CREATE TABLE `APICalls` (
    `APICallID` INTEGER NOT NULL AUTO_INCREMENT,
    `APICallDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `APICallError` VARCHAR(250) NULL,
    `APICallResponse` LONGTEXT NULL,
    `APICallURL` VARCHAR(250) NOT NULL,
    `APICallWeek` INTEGER NULL,
    `APICallYear` INTEGER NOT NULL,
    `APICallAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `APICallAddedBy` VARCHAR(50) NOT NULL,
    `APICallUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `APICallUpdatedBy` VARCHAR(50) NOT NULL,
    `APICallDeleted` TIMESTAMP(0) NULL,
    `APICallDeletedBy` VARCHAR(50) NULL,

    UNIQUE INDEX `uk_APICall`(`APICallDate`),
    PRIMARY KEY (`APICallID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `AccountID` INTEGER NOT NULL AUTO_INCREMENT,
    `AccountCompoundID` VARCHAR(255) NOT NULL,
    `UserID` INTEGER NOT NULL,
    `AccountProviderType` VARCHAR(255) NOT NULL,
    `AccountProviderID` VARCHAR(255) NOT NULL,
    `AccountProviderAccountID` VARCHAR(255) NOT NULL,
    `AccountRefreshToken` TEXT NULL,
    `AccountAccessToken` TEXT NULL,
    `AccountAccessTokenExpires` TIMESTAMP(6) NULL,
    `AccountAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `AccountAddedBy` VARCHAR(50) NOT NULL,
    `AccountUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `AccountUpdatedBy` VARCHAR(50) NOT NULL,
    `AccountDeleted` TIMESTAMP(0) NULL,
    `AccountDeletedBy` VARCHAR(50) NULL,

    UNIQUE INDEX `uk_AccountCompoundID`(`AccountCompoundID`(250)),
    INDEX `fk_AccountUserID`(`UserID`),
    INDEX `idx_AccountProviderAccountID`(`AccountProviderAccountID`(250)),
    INDEX `idx_AccountProviderID`(`AccountProviderID`(250)),
    PRIMARY KEY (`AccountID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Games` (
    `GameID` INTEGER NOT NULL,
    `GameWeek` INTEGER NOT NULL,
    `GameNumber` INTEGER NOT NULL,
    `HomeTeamID` INTEGER NOT NULL,
    `GameHomeSpread` DECIMAL(4, 2) NULL,
    `GameHomeScore` INTEGER NOT NULL DEFAULT 0,
    `VisitorTeamID` INTEGER NOT NULL,
    `GameVisitorSpread` DECIMAL(4, 2) NULL,
    `GameVisitorScore` INTEGER NOT NULL DEFAULT 0,
    `WinnerTeamID` INTEGER NULL,
    `GameStatus` ENUM('Pregame', '1st Quarter', '2nd Quarter', 'Half Time', '3rd Quarter', '4th Quarter', 'Overtime', 'Final', 'Invalid') NOT NULL DEFAULT 'Pregame',
    `GameKickoff` TIMESTAMP(0) NOT NULL,
    `GameTimeLeftInSeconds` INTEGER NOT NULL DEFAULT 3600,
    `GameTimeLeftInQuarter` VARCHAR(10) NOT NULL DEFAULT '',
    `GameHasPossession` INTEGER NULL,
    `GameInRedzone` INTEGER NULL,
    `GameAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `GameAddedBy` VARCHAR(50) NOT NULL,
    `GameUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `GameUpdatedBy` VARCHAR(50) NOT NULL,
    `GameDeleted` TIMESTAMP(0) NULL,
    `GameDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_GameHasPossession`(`GameHasPossession`),
    INDEX `fk_GameInRedzone`(`GameInRedzone`),
    INDEX `fk_VisitorTeamID`(`VisitorTeamID`),
    INDEX `fk_WinnerTeamID`(`WinnerTeamID`),
    UNIQUE INDEX `uk_Game`(`HomeTeamID`, `VisitorTeamID`),
    PRIMARY KEY (`GameID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `HistoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `HistoryYear` INTEGER NOT NULL,
    `LeagueID` INTEGER NOT NULL,
    `HistoryType` ENUM('Overall', 'Survivor', 'Weekly') NOT NULL,
    `HistoryWeek` INTEGER NULL,
    `HistoryPlace` INTEGER NOT NULL,
    `HistoryAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `HistoryAddedBy` VARCHAR(50) NOT NULL,
    `HistoryUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `HistoryUpdatedBy` VARCHAR(50) NOT NULL,
    `HistoryDeleted` TIMESTAMP(0) NULL,
    `HistoryDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_HistoryLeagueID`(`LeagueID`),
    INDEX `fk_HistoryUserID`(`UserID`),
    UNIQUE INDEX `uk_History`(`HistoryYear`, `HistoryType`, `HistoryWeek`, `UserID`),
    PRIMARY KEY (`HistoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leagues` (
    `LeagueID` INTEGER NOT NULL AUTO_INCREMENT,
    `LeagueName` VARCHAR(100) NOT NULL,
    `LeagueAdmin` INTEGER NOT NULL,
    `LeagueAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LeagueAddedBy` VARCHAR(50) NOT NULL,
    `LeagueUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LeagueUpdatedBy` VARCHAR(50) NOT NULL,
    `LeagueDeleted` TIMESTAMP(0) NULL,
    `LeagueDeletedBy` VARCHAR(50) NULL,

    UNIQUE INDEX `uk_LeagueName`(`LeagueName`),
    INDEX `fk_LeagueAdmin`(`LeagueAdmin`),
    PRIMARY KEY (`LeagueID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `LogID` INTEGER NOT NULL AUTO_INCREMENT,
    `LogAction` ENUM('404', 'AUTH_ERROR', 'BACKUP_RESTORE', 'CREATE_ACCOUNT', 'EMAIL_ACTIVITY', 'LINK_ACCOUNT', 'LOGIN', 'LOGOUT', 'MESSAGE', 'PAID', 'REGISTER', 'SLACK', 'SUBMIT_PICKS', 'SUPPORT_SEARCH', 'SURVIVOR_PICK', 'UNSUBSCRIBE', 'VIEW_HTML_EMAIL') NOT NULL,
    `LogDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LogMessage` LONGTEXT NULL,
    `LogData` JSON NULL,
    `UserID` INTEGER NULL,
    `LeagueID` INTEGER NULL,
    `LogAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LogAddedBy` VARCHAR(50) NOT NULL,
    `LogUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `LogUpdatedBy` VARCHAR(50) NOT NULL,
    `LogDeleted` TIMESTAMP(0) NULL,
    `LogDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_LogLeagueID`(`LeagueID`),
    INDEX `idx_LogAction`(`LogAction`),
    INDEX `idx_LogDate`(`LogDate`),
    INDEX `idx_UserID`(`UserID`),
    UNIQUE INDEX `uk_LogMessage`(`UserID`, `LogAction`, `LogDate`),
    PRIMARY KEY (`LogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationTypes` (
    `NotificationType` VARCHAR(100) NOT NULL,
    `NotificationTypeDescription` VARCHAR(255) NOT NULL,
    `NotificationTypeHasEmail` BOOLEAN NOT NULL DEFAULT false,
    `NotificationTypeHasSMS` BOOLEAN NOT NULL DEFAULT false,
    `NotificationTypeHasPushNotification` BOOLEAN NOT NULL DEFAULT false,
    `NotificationTypeHasHours` BOOLEAN NOT NULL,
    `NotificationTypeTooltip` VARCHAR(255) NULL,
    `NotificationTypeAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `NotificationTypeAddedBy` VARCHAR(50) NOT NULL,
    `NotificationTypeUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `NotificationTypeUpdatedBy` VARCHAR(50) NOT NULL,
    `NotificationTypeDeleted` TIMESTAMP(0) NULL,
    `NotificationTypeDeletedBy` VARCHAR(50) NULL,

    PRIMARY KEY (`NotificationType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `NotificationID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `NotificationType` VARCHAR(100) NOT NULL,
    `NotificationEmail` BOOLEAN NOT NULL DEFAULT false,
    `NotificationEmailHoursBefore` INTEGER NULL,
    `NotificationSMS` BOOLEAN NOT NULL DEFAULT false,
    `NotificationSMSHoursBefore` INTEGER NULL,
    `NotificationPushNotification` BOOLEAN NOT NULL DEFAULT false,
    `NotificationPushNotificationHoursBefore` INTEGER NULL,
    `NotificationAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `NotificationAddedBy` VARCHAR(50) NOT NULL,
    `NotificationUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `NotificationUpdatedBy` VARCHAR(50) NOT NULL,
    `NotificationDeleted` TIMESTAMP(0) NULL,
    `NotificationDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_NotificationType`(`NotificationType`),
    UNIQUE INDEX `uk_UserNotification`(`UserID`, `NotificationType`),
    PRIMARY KEY (`NotificationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OverallMV` (
    `OverallMVID` INTEGER NOT NULL AUTO_INCREMENT,
    `Rank` INTEGER NOT NULL DEFAULT 0,
    `Tied` BOOLEAN NOT NULL DEFAULT false,
    `UserID` INTEGER NOT NULL,
    `TeamName` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(255) NOT NULL,
    `PointsEarned` INTEGER NOT NULL,
    `PointsWrong` INTEGER NOT NULL,
    `PointsPossible` INTEGER NOT NULL,
    `PointsTotal` INTEGER NOT NULL,
    `GamesCorrect` INTEGER NOT NULL,
    `GamesWrong` INTEGER NOT NULL,
    `GamesPossible` INTEGER NOT NULL,
    `GamesTotal` INTEGER NOT NULL,
    `GamesMissed` INTEGER NOT NULL,
    `IsEliminated` BOOLEAN NOT NULL DEFAULT false,
    `LastUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_OverallMVUserID`(`UserID`),
    PRIMARY KEY (`OverallMVID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `PaymentID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PaymentType` ENUM('Fee', 'Paid', 'Prize', 'Payout') NOT NULL,
    `PaymentDescription` VARCHAR(99) NOT NULL,
    `PaymentWeek` INTEGER NULL,
    `PaymentAmount` DECIMAL(5, 2) NOT NULL,
    `PaymentAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PaymentAddedBy` VARCHAR(50) NOT NULL,
    `PaymentUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PaymentUpdatedBy` VARCHAR(50) NOT NULL,
    `PaymentDeleted` TIMESTAMP(0) NULL,
    `PaymentDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_PaymentUserID`(`UserID`),
    PRIMARY KEY (`PaymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Picks` (
    `PickID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LeagueID` INTEGER NOT NULL,
    `GameID` INTEGER NOT NULL,
    `TeamID` INTEGER NULL,
    `PickPoints` INTEGER NULL,
    `PickAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PickAddedBy` VARCHAR(50) NOT NULL,
    `PickUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PickUpdatedBy` VARCHAR(50) NOT NULL,
    `PickDeleted` TIMESTAMP(0) NULL,
    `PickDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_PickGameID`(`GameID`),
    INDEX `fk_PickLeagueID`(`LeagueID`),
    INDEX `fk_PickTeamID`(`TeamID`),
    UNIQUE INDEX `uk_UserPick`(`UserID`, `LeagueID`, `GameID`),
    PRIMARY KEY (`PickID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessions` (
    `SessionID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `SessionExpires` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `SessionToken` VARCHAR(255) NOT NULL,
    `SessionAccessToken` VARCHAR(255) NOT NULL,
    `SessionAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SessionAddedBy` VARCHAR(50) NOT NULL,
    `SessionUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SessionUpdatedBy` VARCHAR(50) NOT NULL,
    `SessionDeleted` TIMESTAMP(0) NULL,
    `SessionDeletedBy` VARCHAR(50) NULL,

    UNIQUE INDEX `uk_SessionToken`(`SessionToken`(250)),
    UNIQUE INDEX `uk_SessionAccessToken`(`SessionAccessToken`(250)),
    INDEX `fk_SessionUserID`(`UserID`),
    PRIMARY KEY (`SessionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupportContent` (
    `SupportContentID` INTEGER NOT NULL AUTO_INCREMENT,
    `SupportContentType` ENUM('Rule', 'FAQ') NOT NULL,
    `SupportContentOrder` INTEGER NOT NULL,
    `SupportContentDescription` TEXT NOT NULL,
    `SupportContentDescription2` TEXT NULL,
    `SupportContentCategory` VARCHAR(25) NULL,
    `SupportContentKeywords` VARCHAR(255) NULL,
    `SupportContentAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SupportContentAddedBy` VARCHAR(50) NOT NULL,
    `SupportContentUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SupportContentUpdatedBy` VARCHAR(50) NOT NULL,
    `SupportContentDeleted` TIMESTAMP(0) NULL,
    `SupportContentDeletedBy` VARCHAR(50) NULL,

    PRIMARY KEY (`SupportContentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurvivorMV` (
    `SurvivorMVID` INTEGER NOT NULL AUTO_INCREMENT,
    `Rank` INTEGER NOT NULL DEFAULT 0,
    `Tied` BOOLEAN NOT NULL DEFAULT false,
    `UserID` INTEGER NOT NULL,
    `TeamName` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(255) NOT NULL,
    `WeeksAlive` INTEGER NOT NULL,
    `IsAliveOverall` BOOLEAN NOT NULL,
    `CurrentStatus` ENUM('Alive', 'Dead', 'Waiting') NULL,
    `LastPick` INTEGER NULL,
    `LastUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_SurvivorMVLastPick`(`LastPick`),
    INDEX `fk_SurvivorMVUserID`(`UserID`),
    PRIMARY KEY (`SurvivorMVID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurvivorPicks` (
    `SurvivorPickID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LeagueID` INTEGER NOT NULL,
    `SurvivorPickWeek` INTEGER NOT NULL,
    `GameID` INTEGER NOT NULL,
    `TeamID` INTEGER NULL,
    `SurvivorPickAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SurvivorPickAddedBy` VARCHAR(50) NOT NULL,
    `SurvivorPickUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SurvivorPickUpdatedBy` VARCHAR(50) NOT NULL,
    `SurvivorPickDeleted` TIMESTAMP(0) NULL,
    `SurvivorPickDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_SurvivorPickGameID`(`GameID`),
    INDEX `fk_SurvivorPickLeagueID`(`LeagueID`),
    INDEX `fk_SurvivorPickTeamID`(`TeamID`),
    UNIQUE INDEX `uk_SurvivorPick`(`UserID`, `LeagueID`, `TeamID`),
    UNIQUE INDEX `uk_SurvivorWeek`(`UserID`, `LeagueID`, `SurvivorPickWeek`),
    PRIMARY KEY (`SurvivorPickID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemValues` (
    `SystemValueID` INTEGER NOT NULL AUTO_INCREMENT,
    `SystemValueName` VARCHAR(20) NOT NULL,
    `SystemValueValue` VARCHAR(255) NULL,
    `SystemValueAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SystemValueAddedBy` VARCHAR(50) NOT NULL,
    `SystemValueUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `SystemValueUpdatedBy` VARCHAR(50) NOT NULL,
    `SystemValueDeleted` TIMESTAMP(0) NULL,
    `SystemValueDeletedBy` VARCHAR(50) NULL,

    UNIQUE INDEX `uk_SystemValue`(`SystemValueName`, `SystemValueValue`(230)),
    PRIMARY KEY (`SystemValueID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teams` (
    `TeamID` INTEGER NOT NULL,
    `TeamCity` VARCHAR(50) NOT NULL,
    `TeamName` VARCHAR(50) NOT NULL,
    `TeamShortName` CHAR(3) NOT NULL,
    `TeamAltShortName` CHAR(3) NOT NULL,
    `TeamConference` ENUM('AFC', 'NFC') NOT NULL,
    `TeamDivision` ENUM('East', 'North', 'South', 'West') NOT NULL,
    `TeamLogo` VARCHAR(100) NOT NULL,
    `TeamPrimaryColor` CHAR(7) NOT NULL,
    `TeamSecondaryColor` CHAR(7) NOT NULL,
    `TeamRushDefenseRank` INTEGER NULL,
    `TeamPassDefenseRank` INTEGER NULL,
    `TeamRushOffenseRank` INTEGER NULL,
    `TeamPassOffenseRank` INTEGER NULL,
    `TeamByeWeek` INTEGER NOT NULL,
    `TeamAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `TeamAddedBy` VARCHAR(50) NOT NULL,
    `TeamUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `TeamUpdatedBy` VARCHAR(50) NOT NULL,
    `TeamDeleted` TIMESTAMP(0) NULL,
    `TeamDeletedBy` VARCHAR(50) NULL,

    PRIMARY KEY (`TeamID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tiebreakers` (
    `TiebreakerID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LeagueID` INTEGER NOT NULL,
    `TiebreakerWeek` INTEGER NOT NULL,
    `TiebreakerLastScore` INTEGER NOT NULL DEFAULT 0,
    `TiebreakerHasSubmitted` BOOLEAN NULL DEFAULT false,
    `TiebreakerAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `TiebreakerAddedBy` VARCHAR(50) NOT NULL,
    `TiebreakerUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `TiebreakerUpdatedBy` VARCHAR(50) NOT NULL,
    `TiebreakerDeleted` TIMESTAMP(0) NULL,
    `TiebreakerDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_TiebreakerLeagueID`(`LeagueID`),
    UNIQUE INDEX `uk_Tiebreaker`(`UserID`, `LeagueID`, `TiebreakerWeek`),
    PRIMARY KEY (`TiebreakerID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserHistory` (
    `UserHistoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LeagueID` INTEGER NOT NULL,
    `UserHistoryYear` INTEGER NOT NULL,
    `UserHistoryOverallPlace` INTEGER NULL,

    INDEX `fk_UserHistoryLeagueID`(`LeagueID`),
    UNIQUE INDEX `uk_UserHistoryRecord`(`UserID`, `LeagueID`, `UserHistoryYear`),
    PRIMARY KEY (`UserHistoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLeagues` (
    `UserID` INTEGER NOT NULL,
    `LeagueID` INTEGER NOT NULL,
    `UserLeagueID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserLeagueAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UserLeagueAddedBy` VARCHAR(50) NOT NULL,
    `UserLeagueUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UserLeagueUpdatedBy` VARCHAR(50) NOT NULL,
    `UserLeagueDeleted` TIMESTAMP(0) NULL,
    `UserLeagueDeletedBy` VARCHAR(50) NULL,

    INDEX `fk_UserLeagueLeagueID`(`LeagueID`),
    UNIQUE INDEX `uk_UserLeague`(`UserID`, `LeagueID`),
    PRIMARY KEY (`UserLeagueID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserEmail` VARCHAR(255) NOT NULL,
    `UserPhone` VARCHAR(20) NULL,
    `UserName` VARCHAR(255) NULL,
    `UserFirstName` VARCHAR(50) NULL,
    `UserLastName` VARCHAR(50) NULL,
    `UserTeamName` VARCHAR(100) NULL,
    `UserImage` VARCHAR(255) NULL,
    `UserReferredByRaw` VARCHAR(100) NULL,
    `UserReferredBy` INTEGER NULL,
    `UserEmailVerified` TIMESTAMP(6) NULL,
    `UserTrusted` TINYINT NULL,
    `UserDoneRegistering` TINYINT NOT NULL DEFAULT 0,
    `UserIsAdmin` TINYINT NOT NULL DEFAULT 0,
    `UserPlaysSurvivor` TINYINT NOT NULL DEFAULT 0,
    `UserPaymentType` ENUM('Paypal', 'Venmo', 'Zelle') NULL,
    `UserPaymentAccount` VARCHAR(100) NULL,
    `UserAutoPicksLeft` INTEGER NOT NULL DEFAULT 3,
    `UserAutoPickStrategy` ENUM('Away', 'Home', 'Random') NOT NULL DEFAULT 'Random',
    `UserCommunicationsOptedOut` BOOLEAN NOT NULL DEFAULT false,
    `UserAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UserAddedBy` VARCHAR(50) NOT NULL,
    `UserUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UserUpdatedBy` VARCHAR(50) NOT NULL,
    `UserDeletedBy` VARCHAR(50) NULL,
    `UserDeleted` TIMESTAMP(0) NULL,

    UNIQUE INDEX `uk_UserEmail`(`UserEmail`(250)),
    INDEX `fk_UserReferredBy`(`UserReferredBy`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationRequests` (
    `VerificationRequestID` INTEGER NOT NULL AUTO_INCREMENT,
    `VerificationRequestIdentifier` VARCHAR(255) NOT NULL,
    `VerificationRequestToken` VARCHAR(255) NOT NULL,
    `VerificationRequestExpires` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `VerificationRequestAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `VerificationRequestAddedBy` VARCHAR(50) NOT NULL,
    `VerificationRequestUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `VerificationRequestUpdatedBy` VARCHAR(50) NOT NULL,
    `VerificationRequestDeleted` TIMESTAMP(0) NULL,
    `VerificationRequestDeletedBy` VARCHAR(50) NULL,

    UNIQUE INDEX `uk_VerificationRequestToken`(`VerificationRequestToken`(250)),
    PRIMARY KEY (`VerificationRequestID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklyMV` (
    `WeeklyMVID` INTEGER NOT NULL AUTO_INCREMENT,
    `Week` INTEGER NOT NULL,
    `Rank` INTEGER NOT NULL DEFAULT 0,
    `Tied` BOOLEAN NOT NULL DEFAULT false,
    `UserID` INTEGER NOT NULL,
    `TeamName` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(255) NOT NULL,
    `PointsEarned` INTEGER NOT NULL,
    `PointsWrong` INTEGER NOT NULL,
    `PointsPossible` INTEGER NOT NULL,
    `PointsTotal` INTEGER NOT NULL,
    `GamesCorrect` INTEGER NOT NULL,
    `GamesWrong` INTEGER NOT NULL,
    `GamesPossible` INTEGER NOT NULL,
    `GamesTotal` INTEGER NOT NULL,
    `GamesMissed` INTEGER NOT NULL,
    `TiebreakerScore` INTEGER NULL,
    `LastScore` INTEGER NULL,
    `TiebreakerIsUnder` BOOLEAN NOT NULL,
    `TiebreakerDiffAbsolute` INTEGER NULL,
    `IsEliminated` BOOLEAN NOT NULL DEFAULT false,
    `LastUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_WeeklyMVUserID`(`UserID`),
    PRIMARY KEY (`WeeklyMVID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `fk_PaymentUserID` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

