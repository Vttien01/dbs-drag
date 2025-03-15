import { useSelector } from 'react-redux';

import accountSelectors from '@selectors/account';
import useFetchAction from './useFetchAction';
import { accountActions } from '@store/actions';
import useActionLoading from './useActionLoading';
import { getCacheAccessToken } from '@services/userService';

const useAuth = () => {
    const profile = useSelector(accountSelectors.selectProfile);
    const token = getCacheAccessToken();

    const immediate = !!token && !profile;

    useFetchAction(accountActions.getProfile, { immediate });

    const { loading } = useActionLoading(accountActions.getProfile.type);

    return { isAuthenticated: !!profile, profile, token, loading: immediate || loading };
};

export default useAuth;
