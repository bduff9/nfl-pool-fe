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
import { faAt } from '@bduff9/pro-duotone-svg-icons';
import { faInfoCircle } from '@bduff9/pro-duotone-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Image from 'next/image';
import React, { FC } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Skeleton from 'react-loading-skeleton';

import { Game, Pick as PoolPick, Team } from '../../generated/graphql';
import { LoadingType } from '../../pages/picks/set';
import { getEmptyArray } from '../../utils/arrays';
import { getBackgroundColor } from '../../utils/strings';

import styles from './PickGame.module.scss';

export const PointBankLoader: FC = () => {
	return (
		<>
			{getEmptyArray(16).map((_, i) => (
				<Skeleton circle height={60} key={`point-loader-${i}`} width={60} />
			))}
		</>
	);
};

type DraggablePointProps = {
	index?: number;
	isDragDisabled?: boolean;
	maxValue: number;
	value: number;
};

type PointProps = {
	droppableId?: string;
	isDropDisabled?: boolean;
} & DraggablePointProps;

const DraggablePoint: FC<DraggablePointProps> = ({
	index,
	isDragDisabled = false,
	maxValue,
	value,
}) => {
	return (
		<Draggable
			draggableId={`point-${value}`}
			index={index ?? value}
			isDragDisabled={isDragDisabled}
		>
			{(provided, snapshot) => (
				<div
					className={clsx(
						'd-inline-block',
						'rounded-circle',
						'text-center',
						'pt-1',
						isDragDisabled ? 'cursor-not-allowed' : 'cursor-move',
						styles.point,
						snapshot.isDragging && styles['is-dragging'],
					)}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					style={{
						backgroundColor: getBackgroundColor(value, maxValue),
						border: `1px solid ${getBackgroundColor(value, maxValue, '#000')}`,
						...provided.draggableProps.style,
					}}
				>
					{value || ''}
				</div>
			)}
		</Draggable>
	);
};

export const Point: FC<PointProps> = ({
	droppableId,
	index,
	isDragDisabled = false,
	isDropDisabled = false,
	maxValue,
	value,
}) => {
	if (!droppableId) {
		return (
			<DraggablePoint
				index={index}
				isDragDisabled={isDragDisabled}
				maxValue={maxValue}
				value={value}
			/>
		);
	}

	return (
		<Droppable droppableId={droppableId} isDropDisabled={isDropDisabled || !!value}>
			{(provided, snapshot) => (
				<div
					className={clsx(
						'd-inline-block',
						'rounded-circle',
						'text-center',
						'cursor-move',
						styles.point,
						!value && styles.placeholder,
						snapshot.isDraggingOver && styles['dragging-over'],
					)}
					ref={provided.innerRef}
				>
					{!value ? (
						''
					) : (
						<DraggablePoint
							index={index}
							isDragDisabled={isDragDisabled}
							maxValue={maxValue}
							value={value}
						/>
					)}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

type PickGameProps = {
	dragGameID: null | string;
	gameCount: number;
	loading: LoadingType | null;
	onClick: () => void;
	pick: Pick<PoolPick, 'pickID' | 'pickPoints'> & {
		game: Pick<Game, 'gameID' | 'gameKickoff'> & {
			homeTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
			visitorTeam: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'>;
			winnerTeam: Pick<Team, 'teamID'> | null;
		};
		team: Pick<Team, 'teamID' | 'teamCity' | 'teamName' | 'teamLogo'> | null;
	};
};

const PickGame: FC<PickGameProps> = ({ dragGameID, gameCount, loading, onClick, pick }) => {
	const hasStarted = new Date(pick.game.gameKickoff) < new Date();
	const hasMadePick = !!pick.team;

	return (
		<div
			className={clsx(
				'row',
				hasMadePick && hasStarted && styles['made-pick-final'],
				hasMadePick && !hasStarted && styles['made-pick'],
				!hasMadePick && hasStarted && styles['missed-pick'],
			)}
		>
			<div className="col-3 col-md-2 d-flex align-items-center justify-content-end">
				<Point
					droppableId={`visitor-pick-for-game-${pick.game.gameID}`}
					isDragDisabled={loading !== null || hasStarted}
					isDropDisabled={hasMadePick && dragGameID !== `pick-for-game-${pick.game.gameID}`}
					maxValue={gameCount}
					value={
						pick.team?.teamID === pick.game.visitorTeam.teamID ? pick.pickPoints ?? 0 : 0
					}
				/>
			</div>
			<div className="col-6 col-md-8 d-flex align-items-center text-center">
				<div className={clsx('cursor-pointer', styles['game-info'])} onClick={onClick}>
					<Image
						alt={`${pick.game.visitorTeam.teamCity} ${pick.game.visitorTeam.teamName}`}
						height={60}
						layout="fixed"
						src={`/NFLLogos/${pick.game.visitorTeam.teamLogo}`}
						title={`${pick.game.visitorTeam.teamCity} ${pick.game.visitorTeam.teamName}`}
						width={60}
					/>
					<div className={clsx('d-block', 'd-md-none', styles['team-link'])}>
						{pick.game.visitorTeam.teamName}
					</div>
				</div>
				<div
					className={clsx(
						'd-none',
						'd-md-block',
						'position-relative',
						'cursor-pointer',
						styles['game-info'],
					)}
					onClick={onClick}
				>
					{pick.game.visitorTeam.teamCity}
					<br />
					{pick.game.visitorTeam.teamName}
					<FontAwesomeIcon
						className="position-absolute top-50 start-0 translate-middle"
						icon={faInfoCircle}
					/>
				</div>
				<div className={clsx(styles['at-symbol'])}>
					<FontAwesomeIcon icon={faAt} />
				</div>
				<div
					className={clsx(
						'd-none',
						'd-md-block',
						'position-relative',
						'cursor-pointer',
						styles['game-info'],
					)}
					onClick={onClick}
				>
					{pick.game.homeTeam.teamCity}
					<br />
					{pick.game.homeTeam.teamName}
					<FontAwesomeIcon
						className="position-absolute top-50 start-100 translate-middle"
						icon={faInfoCircle}
					/>
				</div>
				<div className={clsx('cursor-pointer', styles['game-info'])} onClick={onClick}>
					<Image
						alt={`${pick.game.homeTeam.teamCity} ${pick.game.homeTeam.teamName}`}
						height={60}
						layout="fixed"
						src={`/NFLLogos/${pick.game.homeTeam.teamLogo}`}
						title={`${pick.game.homeTeam.teamCity} ${pick.game.homeTeam.teamName}`}
						width={60}
					/>
					<div className={clsx('d-block', 'd-md-none', styles['team-link'])}>
						{pick.game.homeTeam.teamName}
					</div>
				</div>
			</div>
			<div className="col-3 col-md-2 d-flex align-items-center justify-content-start">
				<Point
					droppableId={`home-pick-for-game-${pick.game.gameID}`}
					isDragDisabled={loading !== null || hasStarted}
					isDropDisabled={hasMadePick && dragGameID !== `pick-for-game-${pick.game.gameID}`}
					maxValue={gameCount}
					value={pick.team?.teamID === pick.game.homeTeam.teamID ? pick.pickPoints ?? 0 : 0}
				/>
			</div>
		</div>
	);
};

PickGame.whyDidYouRender = true;

export default PickGame;
