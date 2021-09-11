import { Mutations, MutationsInterface } from './types';

export default {
	[Mutations.SET_CURRENT_CHALLENGE_INDEX](state, index) {
		state.currentChallengeIndex = index;
	},

	[Mutations.SET_IS_LEVEL_UP_MODAL_OPEN](state, flag) {
		state.isLevelUpModelOpen = flag;
	},

	[Mutations.COMPLETE_CHALLENGE](state, xpAmount) {
		const { current, end } = state.xp;
		const currentTotalXp = xpAmount + current;
		const shouldLevelUp = currentTotalXp >= end;
		state.completedChallenges += 1;

		if (shouldLevelUp) {
			state.level += 1;
			const remaingXp = currentTotalXp - end;
			const experienceToNextLevel = Math.pow((state.level + 1) * 4, 2);

			state.xp = {
				current: remaingXp,
				start: 0,
				end: experienceToNextLevel,
			};

			state.isLevelUpModelOpen = true;
			return;
		}

		state.xp = {
			...state.xp,
			current: currentTotalXp,
		};
	},

	[Mutations.SAVE_COOKIE_DATA](state, cookie) {
		state.level = cookie.level;
		state.xp = cookie.xp;
		state.completedChallenges = cookie.completedChallenges;
	},
} as MutationsInterface;