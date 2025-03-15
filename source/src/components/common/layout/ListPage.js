import { ConfigProvider, Spin } from 'antd';
import classNames from 'classnames';
import React from 'react';

import styles from './ListPage.module.scss';

function ListPage({
    title,
    type,
    className,
    titleMarginBottom = 5,
    descriptionMarginBottom = 35,
    actionBarMarginBottom = 24,
    filterFormMarginBottom = 38,
    description,
    actionBar,
    filterForm,
    table,
    loading = false,
    colorPrimary = '#2974a5',
    children,
}) {
    // disable filter form for now
    if (type != 'show') {
        filterForm = null;
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary,
                },
            }}
        >
            <Spin spinning={loading}>
                <div className={classNames(styles.listBase, className)}>
                    <div style={{ '--titleMb': `${titleMarginBottom}px` }} className={styles.title}>{title}</div>
                    {description && (
                        <div style={{ '--desMb': `${descriptionMarginBottom}px` }} className={styles.description}>
                            {description}
                        </div>
                    )}
                    {actionBar && (
                        <div style={{ '--actionMb': `${actionBarMarginBottom}px` }} className={styles.actionBar}>
                            {actionBar}
                        </div>
                    )}
                    {filterForm && (
                        <div style={{ '--filterMb': `${filterFormMarginBottom}px` }} className={styles.filterForm}>
                            {filterForm}
                        </div>
                    )}
                    {table}
                    {children}
                </div>
            </Spin>
        </ConfigProvider>
    );
}

export default ListPage;
