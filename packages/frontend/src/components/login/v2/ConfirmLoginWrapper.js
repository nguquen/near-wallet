import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Mixpanel } from '../../../mixpanel/index';
import { allowLogin } from '../../../redux/actions/account';
import { showCustomAlert } from '../../../redux/actions/status';
import {
    selectAccountLocalStorageAccountId,
    selectAccountUrlReferrer
} from '../../../redux/slices/account';
import { EXPLORER_URL } from '../../../utils/wallet';
import ConfirmLogin from './ConfirmLogin';

export default ({
    loginAccessType,
    contractId,
    onClickCancel
}) => {
    const dispatch = useDispatch();

    const accountLocalStorageAccountId = useSelector(selectAccountLocalStorageAccountId);
    const accountUrlReferrer = useSelector(selectAccountUrlReferrer);

    const handleAllowLogin = async () => {
        await Mixpanel.withTracking("LOGIN",
            async () => {
                await dispatch(allowLogin());
            },
            (e) => {
                dispatch(showCustomAlert({
                    success: false,
                    messageCodeHeader: 'error',
                    errorMessage: e.message
                }));
            }
        );
    };

    return (
        <ConfirmLogin
            signedInAccountId={accountLocalStorageAccountId}
            loginAccessType={loginAccessType}
            appReferrer={accountUrlReferrer}
            contractId={contractId}
            onClickCancel={onClickCancel}
            onClickConnect={handleAllowLogin}
            EXPLORER_URL={EXPLORER_URL}
        />
    );
};