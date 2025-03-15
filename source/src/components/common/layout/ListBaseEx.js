import { Card } from 'antd';
import React from 'react';

import styles from './ListBaseEx.module.scss';

function ListBaseEx({ searchForm, actionBar, baseTable }) {
    return (
        <div className={styles.baseListPage}>
            {searchForm && <Card className={styles.baseListPageSearch}>{searchForm}</Card>}
            <Card className={styles.baseListPageList}>
                {actionBar}
                {baseTable}
            </Card>
        </div>
    );
}

export default ListBaseEx;