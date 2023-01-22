/*******************************************************************************
 * NFL Confidence Pool FE - the frontend implementation of an NFL confidence pool.
 * Copyright (C) 2015-present Brian Duffey
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
import type {
	EditMyProfileInput,
	Notification,
	NotificationInput,
	User,
} from '../generated/graphql';

type EditMyProfileResponse = Pick<User, 'userID'>;

type UpdateMyNotificationsResponse = Array<Pick<Notification, 'notificationID'>>;

type TEditProfileResult = {
	editMyProfile: EditMyProfileResponse;
	updateMyNotifications: UpdateMyNotificationsResponse;
};

// const editProfileMutation = `
// 	mutation EditProfile(
// 		$data: EditMyProfileInput!
// 		$notifications: [NotificationInput!]!
// 	) {
// 		editMyProfile(data: $data) {
// 			userID
// 		}
// 		updateMyNotifications(data: $notifications) {
// 			notificationID
// 		}
// 	}
// `;

export const editProfile = async (
	_data: EditMyProfileInput,
	_notifications: Array<NotificationInput>,
): Promise<TEditProfileResult> => ({
	editMyProfile: {} as Pick<User, 'userID'>,
	updateMyNotifications: [],
});
