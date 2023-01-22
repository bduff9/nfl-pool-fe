/*
 Warnings:
 
 - The primary key for the `Accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `AccountCompoundID` on the `Accounts` table. All the data in the column will be lost.
 - You are about to alter the column `AccountProviderType` on the `Accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - You are about to alter the column `AccountProviderID` on the `Accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - You are about to alter the column `AccountProviderAccountID` on the `Accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - The `AccountAccessTokenExpires` column on the `Accounts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
 - The primary key for the `Sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to drop the column `SessionAccessToken` on the `Sessions` table. All the data in the column will be lost.
 - You are about to alter the column `SessionToken` on the `Sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
 - You are about to alter the column `UserEmail` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - You are about to alter the column `UserName` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - You are about to alter the column `UserImage` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
 - You are about to drop the `migrations` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[AccountProviderID,AccountProviderAccountID]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[SessionToken]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.
 - A unique constraint covering the columns `[UserEmail]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
 
 */
-- DropForeignKey
ALTER TABLE `Payments` DROP FOREIGN KEY `fk_PaymentUserID`;
-- DropIndex
DROP INDEX `fk_AccountUserID` ON `Accounts`;
-- DropIndex
DROP INDEX `idx_AccountProviderAccountID` ON `Accounts`;
-- DropIndex
DROP INDEX `idx_AccountProviderID` ON `Accounts`;
-- DropIndex
DROP INDEX `uk_AccountCompoundID` ON `Accounts`;
-- DropIndex
DROP INDEX `fk_SessionUserID` ON `Sessions`;
-- DropIndex
DROP INDEX `uk_SessionAccessToken` ON `Sessions`;
-- DropIndex
DROP INDEX `uk_SessionToken` ON `Sessions`;
-- DropIndex
DROP INDEX `fk_UserReferredBy` ON `Users`;
-- DropIndex
DROP INDEX `uk_UserEmail` ON `Users`;
-- AlterTable
ALTER TABLE `Accounts` DROP PRIMARY KEY,
    DROP COLUMN `AccountCompoundID`,
    ADD COLUMN `AccountIDToken` TEXT NULL,
    ADD COLUMN `AccountScope` VARCHAR(191) NULL,
    ADD COLUMN `AccountSessionState` VARCHAR(191) NULL,
    ADD COLUMN `AccountTokenType` VARCHAR(191) NULL,
    MODIFY `AccountID` VARCHAR(191) NOT NULL,
    MODIFY `UserID` VARCHAR(191) NOT NULL,
    MODIFY `AccountProviderType` VARCHAR(191) NOT NULL,
    MODIFY `AccountProviderID` VARCHAR(191) NOT NULL,
    MODIFY `AccountProviderAccountID` VARCHAR(191) NOT NULL,
    DROP COLUMN `AccountAccessTokenExpires`,
    ADD COLUMN `AccountAccessTokenExpires` INTEGER NULL,
    ADD PRIMARY KEY (`AccountID`);
-- AlterTable
ALTER TABLE `Logs`
MODIFY `LogAction` ENUM(
        'AUTH_ERROR',
        'BACKUP_RESTORE',
        'CREATE_ACCOUNT',
        'EMAIL_ACTIVITY',
        '404',
        'LINK_ACCOUNT',
        'LOGIN',
        'LOGOUT',
        'MESSAGE',
        'PAID',
        'REGISTER',
        'SLACK',
        'SUBMIT_PICKS',
        'SUPPORT_SEARCH',
        'SURVIVOR_PICK',
        'UNSUBSCRIBE',
        'VIEW_HTML_EMAIL'
    ) NOT NULL;
-- AlterTable
ALTER TABLE `Payments`
MODIFY `UserID` VARCHAR(191) NOT NULL;
-- AlterTable
ALTER TABLE `Sessions` DROP PRIMARY KEY,
    DROP COLUMN `SessionAccessToken`,
    MODIFY `SessionID` VARCHAR(191) NOT NULL,
    MODIFY `UserID` VARCHAR(191) NOT NULL,
    MODIFY `SessionExpires` DATETIME(3) NOT NULL,
    MODIFY `SessionToken` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`SessionID`);
-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    MODIFY `UserID` VARCHAR(191) NOT NULL,
    MODIFY `UserEmail` VARCHAR(191) NULL,
    MODIFY `UserName` VARCHAR(191) NULL,
    MODIFY `UserImage` VARCHAR(191) NULL,
    MODIFY `UserReferredBy` VARCHAR(191) NULL,
    MODIFY `UserEmailVerified` DATETIME(3) NULL,
    ADD PRIMARY KEY (`UserID`);
-- DropTable
DROP TABLE `migrations`;
-- CreateTable
CREATE TABLE `VerificationTokens` (
    `VerificationTokenIdentifier` VARCHAR(191) NOT NULL,
    `VerificationTokenToken` VARCHAR(191) NOT NULL,
    `VerificationTokenExpires` DATETIME(3) NOT NULL,
    `VerificationRequestAdded` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `VerificationRequestAddedBy` VARCHAR(50) NOT NULL,
    `VerificationRequestUpdated` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `VerificationRequestUpdatedBy` VARCHAR(50) NOT NULL,
    `VerificationRequestDeleted` TIMESTAMP(0) NULL,
    `VerificationRequestDeletedBy` VARCHAR(50) NULL,
    UNIQUE INDEX `VerificationTokens_VerificationTokenToken_key`(`VerificationTokenToken`),
    UNIQUE INDEX `VerificationTokens_VerificationTokenIdentifier_VerificationT_key`(
        `VerificationTokenIdentifier`,
        `VerificationTokenToken`
    )
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- CreateIndex
CREATE UNIQUE INDEX `Accounts_AccountProviderID_AccountProviderAccountID_key` ON `Accounts`(`AccountProviderID`, `AccountProviderAccountID`);
-- CreateIndex
CREATE UNIQUE INDEX `Sessions_SessionToken_key` ON `Sessions`(`SessionToken`);
-- CreateIndex
CREATE UNIQUE INDEX `Users_UserEmail_key` ON `Users`(`UserEmail`);
-- AddForeignKey
DELETE FROM `Accounts` `A`
WHERE NOT EXISTS (
        SELECT `UserID`
        FROM `Users` `U`
        WHERE `A`.`UserID` = `U`.`UserID`
    );
ALTER TABLE `Accounts`
ADD CONSTRAINT `Accounts_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE `Payments`
ADD CONSTRAINT `fk_PaymentUserID` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
DELETE FROM `Sessions` `S`
WHERE NOT EXISTS (
        SELECT `UserID`
        from `Users` `U`
        WHERE `S`.`UserID` = `U`.`UserID`
    );
ALTER TABLE `Sessions`
ADD CONSTRAINT `Sessions_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE `Users`
ADD CONSTRAINT `Users_UserReferredBy_fkey` FOREIGN KEY (`UserReferredBy`) REFERENCES `Users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;
