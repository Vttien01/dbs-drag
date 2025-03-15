import { appVersion, brandName } from '@constants';
import Layout, { Content, Footer } from 'antd/es/layout/layout';
import React from 'react';
import AppHeader from './AppHeader';

import styles from './SiteLayout.module.scss';

function SiteLayout({ children } = {}) {
    return (
        <Layout>
            <Layout>
                <AppHeader />
                <Content className={styles.appContent}>
                    <div className={styles.wrapper}>{children}</div>
                    <Footer className={styles.appFooter}>
                        <strong>{brandName} </strong> - © Copyright {new Date().getFullYear()}. All Rights Reserved.
                        <div className={styles.version}>version {appVersion}</div>
                    </Footer>
                </Content>
            </Layout>
        </Layout>
    );
}

export default SiteLayout;
