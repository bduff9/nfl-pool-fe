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
import clsx from 'clsx';
import { ClientError } from 'graphql-request';
import React, {
	Dispatch,
	VFC,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';

import { setPrizeAmounts, usePayoutAmounts } from '../../graphql/manageAdminPayments';
import { WEEKS_IN_SEASON } from '../../utils/constants';
import { BackgroundLoadingContext } from '../../utils/context';
import { logger } from '../../utils/logging';
import { ErrorIcon, SuccessIcon } from '../ToastUtils/ToastIcons';

import styles from './ManageAdminPayments.module.scss';

type CalculatedRowProps = {
	count?: null | number;
	label: string;
	isBold?: boolean;
	isIndented?: boolean;
	money?: null | number;
	total?: null | number;
};

const CalculatedRow: VFC<CalculatedRowProps> = ({
	count,
	label,
	isBold = false,
	isIndented = false,
	money,
	total,
}) => {
	const hasMiddleCol = total === undefined;

	return (
		<tr className={clsx(isBold && 'fw-bold')}>
			<td
				className={clsx('position-relative', 'overflow-hidden', styles['payment-label'])}
				colSpan={hasMiddleCol ? 1 : 2}
			>
				<div
					className={clsx('position-absolute', 'ps-1', isIndented && 'ms-3', styles.dots)}
				>
					{label}
				</div>
			</td>
			{hasMiddleCol && (
				<td className="position-relative overflow-hidden">
					<div className={clsx('position-absolute', 'ps-1', styles.dots)}>
						{count !== null ? `$${money} x ${count}` : <Skeleton />}
					</div>
				</td>
			)}
			<td className={clsx('position-relative', 'text-end', styles['payment-total'])}>
				<div className="position-absolute">
					{hasMiddleCol ? (
						count != null && money != null ? (
							`$${count * money}`
						) : (
							<Skeleton />
						)
					) : total !== null ? (
						`$${total}`
					) : (
						<Skeleton />
					)}
				</div>
			</td>
		</tr>
	);
};

const ManageAdminPayments: VFC = () => {
	const { data, error, isValidating, mutate } = usePayoutAmounts();
	const [, setBackgroundLoading] = useContext(BackgroundLoadingContext);
	const [weekly1stPrize, setWeekly1stPrize] = useState<null | number>(null);
	const [weekly2ndPrize, setWeekly2ndPrize] = useState<null | number>(null);
	const [overall1stPrize, setOverall1stPrize] = useState<null | number>(null);
	const [overall2ndPrize, setOverall2ndPrize] = useState<null | number>(null);
	const [overall3rdPrize, setOverall3rdPrize] = useState<null | number>(null);
	const [survivor1stPrize, setSurvivor1stPrize] = useState<null | number>(null);
	const [survivor2ndPrize, setSurvivor2ndPrize] = useState<null | number>(null);
	const poolCost = data?.poolCost?.systemValueValue
		? +data.poolCost.systemValueValue
		: null;
	const survivorCost = data?.survivorCost?.systemValueValue
		? +data.survivorCost.systemValueValue
		: null;

	useEffect(() => {
		setBackgroundLoading(!!data && isValidating);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isValidating]);

	useEffect(() => {
		const prizes: [number, number, number] = JSON.parse(
			data?.weeklyPrizes?.systemValueValue ?? '[]',
		);

		setWeekly1stPrize(prizes[1]);
		setWeekly2ndPrize(prizes[2]);
	}, [data?.weeklyPrizes?.systemValueValue]);
	useEffect(() => {
		const prizes: [number, number, number, number] = JSON.parse(
			data?.overallPrizes?.systemValueValue ?? '[]',
		);

		setOverall1stPrize(prizes[1]);
		setOverall2ndPrize(prizes[2]);
		setOverall3rdPrize(prizes[3]);
	}, [data?.overallPrizes?.systemValueValue]);
	useEffect(() => {
		const prizes: [number, number, number] = JSON.parse(
			data?.survivorPrizes?.systemValueValue ?? '[]',
		);

		setSurvivor1stPrize(prizes[1]);
		setSurvivor2ndPrize(prizes[2]);
	}, [data?.survivorPrizes?.systemValueValue]);

	const poolRemaining =
		(poolCost ?? 0) * (data?.getRegisteredCount ?? 0) -
		(weekly1stPrize ?? 0) * WEEKS_IN_SEASON -
		(weekly2ndPrize ?? 0) * WEEKS_IN_SEASON -
		(overall1stPrize ?? 0) -
		(overall2ndPrize ?? 0) -
		(overall3rdPrize ?? 0) -
		(poolCost ?? 0);
	const survivorRemaining =
		(survivorCost ?? 0) * (data?.getSurvivorCount ?? 0) -
		(survivor1stPrize ?? 0) -
		(survivor2ndPrize ?? 0);

	if (error) {
		logger.error({
			text: 'Error when rendering payout amounts for admin payments screen',
			error,
		});
	}

	const validatePrize = (
		setter: Dispatch<SetStateAction<null | number>>,
	): ((event: FormEvent<HTMLInputElement>) => void) => (
		event: FormEvent<HTMLInputElement>,
	): void => {
		const value = +event.currentTarget.value;

		if (Number.isNaN(value) || value < 0) return;

		setter(value);
	};

	const onSubmit = async (): Promise<void> => {
		if (!weekly1stPrize || !weekly2ndPrize) {
			toast.error('Invalid weekly prize value(s)', {
				icon: ErrorIcon,
			});

			return;
		}

		const weeklyPrizeStr = JSON.stringify([0, weekly1stPrize, weekly2ndPrize]);

		if (!overall1stPrize || !overall2ndPrize || !overall3rdPrize) {
			toast.error('Invalid overall prize value(s)', {
				icon: ErrorIcon,
			});

			return;
		}

		const overallPrizeStr = JSON.stringify([
			0,
			overall1stPrize,
			overall2ndPrize,
			overall3rdPrize,
		]);

		if (!survivor1stPrize || !survivor2ndPrize) {
			toast.error('Invalid survivor prize value(s)', {
				icon: ErrorIcon,
			});

			return;
		}

		const survivorPrizeStr = JSON.stringify([0, survivor1stPrize, survivor2ndPrize]);

		try {
			mutate(data => {
				if (!data) return data;

				const overallPrizes = data.overallPrizes
					? { ...data.overallPrizes, systemValueValue: overallPrizeStr }
					: null;
				const survivorPrizes = data.survivorPrizes
					? { ...data.survivorPrizes, systemValueValue: survivorPrizeStr }
					: null;
				const weeklyPrizes = data.weeklyPrizes
					? { ...data.weeklyPrizes, systemValueValue: weeklyPrizeStr }
					: null;

				return { ...data, overallPrizes, survivorPrizes, weeklyPrizes };
			}, false);

			await toast.promise(
				setPrizeAmounts(weeklyPrizeStr, overallPrizeStr, survivorPrizeStr),
				{
					error: {
						icon: ErrorIcon,
						render ({ data }) {
							logger.debug({ text: '~~~~~~~ERROR DATA: ', data });

							if (data instanceof ClientError) {
								//TODO: toast all errors, not just first
								return data.response.errors?.[0]?.message;
							}

							return 'Something went wrong, please try again';
						},
					},
					pending: 'Setting prizes...',
					success: {
						icon: SuccessIcon,
						render () {
							return 'Successfully set prize amounts!';
						},
					},
				},
			);
		} catch (error) {
			logger.error({
				text: 'Error setting prize amounts',
				error,
				overall1stPrize,
				overall2ndPrize,
				overall3rdPrize,
				survivor1stPrize,
				survivor2ndPrize,
				weekly1stPrize,
				weekly2ndPrize,
			});
		} finally {
			await mutate();
		}
	};

	return (
		<div className="row">
			<div className="col-12 content-bg p-4 border border-secondary rounded">
				<h1 className="text-center">Prizes</h1>
				<div className="row">
					<div className="col-12 col-md-8">
						<div className="row">
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="poolCost" className="form-label">
									Pool Cost
								</label>
								<input
									className="form-control"
									disabled
									id="poolCost"
									placeholder="Entry fee for pool"
									type="text"
									value={poolCost ?? ''}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="weekly1st" className="form-label">
									Weekly 1st place
								</label>
								<input
									className="form-control"
									id="weekly1st"
									onChange={validatePrize(setWeekly1stPrize)}
									placeholder="Weekly 1st place prize"
									type="number"
									value={weekly1stPrize ?? 0}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="weekly2nd" className="form-label">
									Weekly 2nd place
								</label>
								<input
									className="form-control"
									id="weekly2nd"
									onChange={validatePrize(setWeekly2ndPrize)}
									placeholder="Weekly 2nd place prize"
									type="number"
									value={weekly2ndPrize ?? 0}
								/>
							</div>
							<div className="w-100"></div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="overall1st" className="form-label">
									Overall 1st place
								</label>
								<input
									className="form-control"
									id="overall1st"
									onChange={validatePrize(setOverall1stPrize)}
									placeholder="Overall 1st place prize"
									type="number"
									value={overall1stPrize ?? 0}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="overall2nd" className="form-label">
									Overall 2nd place
								</label>
								<input
									className="form-control"
									id="overall2nd"
									onChange={validatePrize(setOverall2ndPrize)}
									placeholder="Overall 2nd place prize"
									type="number"
									value={overall2ndPrize ?? 0}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="overall3rd" className="form-label">
									Overall 3rd place
								</label>
								<input
									className="form-control"
									id="overall3rd"
									onChange={validatePrize(setOverall3rdPrize)}
									placeholder="Overall 3rd place prize"
									type="number"
									value={overall3rdPrize ?? 0}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="overallLast" className="form-label">
									Overall last place
								</label>
								<input
									className="form-control"
									disabled
									id="overallLast"
									placeholder="Overall last place prize"
									type="number"
									value={poolCost ?? ''}
								/>
							</div>
							<div className="w-100"></div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="survivorCost" className="form-label">
									Survivor Cost
								</label>
								<input
									className="form-control"
									disabled
									id="survivorCost"
									placeholder="Entry fee for survivor"
									type="number"
									value={survivorCost ?? ''}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="survivor1st" className="form-label">
									Survivor 1st place
								</label>
								<input
									className="form-control"
									id="survivor1st"
									onChange={validatePrize(setSurvivor1stPrize)}
									placeholder="Survivor 1st place prize"
									type="number"
									value={survivor1stPrize ?? 0}
								/>
							</div>
							<div className="mb-3 col-6 col-md-3">
								<label htmlFor="survivor2nd" className="form-label">
									Survivor 2nd place
								</label>
								<input
									className="form-control"
									id="survivor2nd"
									onChange={validatePrize(setSurvivor2ndPrize)}
									placeholder="Survivor 2nd place prize"
									type="number"
									value={survivor2ndPrize ?? 0}
								/>
							</div>
							<div className="col-12 d-grid gap-2">
								<button
									className="btn btn-primary"
									disabled={data && data.weeklyPrizes?.systemValueValue !== null}
									onClick={onSubmit}
									type="button"
								>
									{data ? (
										data.weeklyPrizes?.systemValueValue !== null ? (
											'Saved'
										) : (
											'Save'
										)
									) : (
										<Skeleton />
									)}
								</button>
							</div>
						</div>
					</div>
					<div className="col-12 col-md-4 table-responsive">
						<table className="table table-hover align-middle text-nowrap">
							<tbody>
								<CalculatedRow
									count={data?.getRegisteredCount}
									label="Pool Total"
									money={poolCost}
								/>
								<CalculatedRow
									count={WEEKS_IN_SEASON}
									isIndented
									label="Weekly 1st place"
									money={weekly1stPrize ?? null}
								/>
								<CalculatedRow
									count={WEEKS_IN_SEASON}
									isIndented
									label="Weekly 2nd place"
									money={weekly2ndPrize ?? null}
								/>
								<CalculatedRow
									isIndented
									label="Overall 1st place"
									total={overall1stPrize ?? null}
								/>
								<CalculatedRow
									isIndented
									label="Overall 2nd place"
									total={overall2ndPrize ?? null}
								/>
								<CalculatedRow
									isIndented
									label="Overall 3rd place"
									total={overall3rdPrize ?? null}
								/>
								<CalculatedRow isIndented label="Overall last place" total={poolCost} />
								<CalculatedRow isBold isIndented label="Leftover" total={poolRemaining} />
								<CalculatedRow
									count={data?.getSurvivorCount}
									label="Survivor Total"
									money={survivorCost}
								/>
								<CalculatedRow
									isIndented
									label="Survivor 1st place"
									total={survivor1stPrize ?? null}
								/>
								<CalculatedRow
									isIndented
									label="Survivor 2nd place"
									total={survivor2ndPrize ?? null}
								/>
								<CalculatedRow
									isBold
									isIndented
									label="Leftover"
									total={survivorRemaining}
								/>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

ManageAdminPayments.whyDidYouRender = true;

export default ManageAdminPayments;
