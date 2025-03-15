import React, { useEffect } from 'react';

import { accessRouteTypeEnum } from '@constants';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import MainLayout from '@modules/main/MainLayout';
import PublicLayout from '@modules/main/PublicLayout';
import { useDispatch } from 'react-redux';
import routes from '.';

const ValidateAccess = ({ authRequire, component: Component, componentProps, isAuthenticated, profile, layout }) => {
    const location = useLocation();
    const { site } = useParams();
    const dispatch = useDispatch();

    const getRedirect = (authRequire) => {
        if (authRequire === accessRouteTypeEnum.NOT_LOGIN && isAuthenticated) {
            return routes.homePage.path;
        }

        // check permistion

        return false;
    };

    useEffect(() => {
        if (!site) {
            return;
        }
    }, [ site ]);

    const redirect = getRedirect(authRequire);

    if (redirect) {
        return <Navigate state={{ from: location }} key={redirect} to={redirect} replace />;
    }

    // currently, only support custom layout for authRequire route
    const Layout = authRequire ? layout || MainLayout : PublicLayout;

    return (
        <Layout>
            <Component {...(componentProps || {})}>
                <Outlet />
            </Component>
        </Layout>
    );
};

export default ValidateAccess;
