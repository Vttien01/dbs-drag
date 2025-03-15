import { createAction } from '@store/utils';

export const getChallenges = createAction('challenges/GET_CHALLENGES');
export const setChallenges = createAction('challenges/SET_CHALLENGES');
export const getPublishedDate = createAction('challenges/GET_PUBLISHED_DATE');
export const setPublishedDate = createAction('challenges/SET_PUBLISHED_DATE');

export const actions = {
    getChallenges,
    setChallenges,
    getPublishedDate,
    setPublishedDate,
};
