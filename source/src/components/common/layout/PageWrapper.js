import React from 'react';
import { Breadcrumb, Spin, Tabs, Typography } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

const { Title } = Typography;

import styles from './PageWrapper.module.scss';

const PageWrapper = ({ title, loading, children, routes = [], tabs, onChangeTab, activeTab }) => {
    const hasTab = !!tabs?.length;
    return (
        <Spin spinning={!!loading} wrapperClassName={styles.pageWrapper}>
            <div className={classNames(styles.pageHeader, hasTab && styles.hasTab)}>
                {!!routes?.length && (
                    <Breadcrumb
                        routes={routes}
                        itemRender={(route) => {
                            const last = routes.indexOf(route) === routes.length - 1;

                            if (last) {
                                return (
                                    <span className={styles.breadcrumbLast}>{route.breadcrumbName || route.title}</span>
                                );
                            } else if (route.path) {
                                return (
                                    <Link to={route.path} style={{ color: '#1890ff' }}>
                                        {route.breadcrumbName || route.title}
                                    </Link>
                                );
                            } else {
                                return <span>{route.breadcrumbName || route.title}</span>;
                            }
                        }}
                    />
                )}
                {title && (
                    <Title level={5} className={styles.pageTitle}>
                        {title}
                    </Title>
                )}
                {!!tabs?.length && (
                    <Tabs activeKey={activeTab} onChange={onChangeTab} items={tabs} className={styles.tab} />
                )}
            </div>
            <div className={styles.pageContent}>{children}</div>
        </Spin>
    );
};
export default PageWrapper;
