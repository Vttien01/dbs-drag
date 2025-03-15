import { Layout } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import { appVersion, brandName, navigateTypeEnum } from '@constants';
import { useNavigationType } from 'react-router-dom';
import styles from './MainLayout.module.scss';

const { Content, Footer } = Layout;

const SIDEBAR_WIDTH_EXPAND = 320;

const MainLayout = ({ children }) => {
    const [ collapsed, setCollapsed ] = useState(false);
    const navigateType = useNavigationType();
    const appContentRef = useRef(null);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);

    useEffect(() => {
        if (navigateType !== navigateTypeEnum.POP && appContentRef.current) {
            appContentRef.current?.scrollTo(0, 0);
        }
    }, [ location.pathname ]);

    return (
        <Layout>
            <Content ref={appContentRef} className={styles.appContent}>
                <div className={styles.wrapper}>{children}</div>
            </Content>
        </Layout>
    );
};

export default MainLayout;
