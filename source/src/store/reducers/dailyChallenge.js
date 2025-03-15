import { createReducer } from '@store/utils';
import { dailyChallengeActions } from '@store/actions';

const { setChallenges, setPublishedDate } = dailyChallengeActions;

const initialState = {
    challenges: [],
    publishedDate: null,
};

const dailyChallengeReducer = createReducer(
    {
        reducerName: 'dailyChallenge',
        initialState,
    },
    {
        [setChallenges.type]: (state, { payload }) => {
            state.challenges = payload || [];
        },
        [setPublishedDate.type]: (state, { payload }) => {
            state.publishedDate = payload || null;
        },
    },
);

export default dailyChallengeReducer;
