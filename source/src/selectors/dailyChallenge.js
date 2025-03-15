import { createSelector } from "reselect";

export const selectChallenges = createSelector([ state => state.dailyChallenge ], ({ challenges }) => challenges);
export const selectPublishedDate = createSelector([ state => state.dailyChallenge ], ({ publishedDate }) => publishedDate);

const dailyChallengeSelectors = {
    selectChallenges,
    selectPublishedDate,
};

export default dailyChallengeSelectors;