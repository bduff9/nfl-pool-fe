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
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV;

export const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * The name of the cookie used to redirect a user back where they were trying to go prior to the auth flow
 */
export const REDIRECT_COOKIE_NAME = 'REDIRECT_COOKIE_NAME';

/**
 * Number of days in a week, used for conversions
 */
export const DAYS_IN_WEEK = 7;

/**
 * Number of hours in a day, used for conversions
 */
export const HOURS_IN_DAY = 24;

/**
 * Number of minutes in an hour, used for conversions
 */
export const MINUTES_IN_HOUR = 60;

/**
 * Number of seconds in a minute, used for conversions
 */
export const SECONDS_IN_MINUTE = 60;

/**
 * Number of milliseconds in a second, used for conversions
 */
export const MILLISECONDS_IN_SECOND = 1000;

/**
 * The total number of weeks in an NFL regular season
 */
export const WEEKS_IN_SEASON = 18;
