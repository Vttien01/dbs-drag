import { Flex, Popover } from 'antd';
import React from 'react';
import styles from './index.module.scss';
export default function BasePopover({ children, trigger, title, content }) {
    return (
        <Popover
            trigger={trigger}
            title={
                <Flex vertical gap={'small'} style={{ margin: 0 }}>
                    <div
                        style={{
                            fontWeight: 600,
                            fontFamily: 'Poppins',
                            borderBottom: 'solid 1px #bfbfbf',
                        }}
                    >
                        <span style={{ marginLeft: 10 }}>{title}</span>
                    </div>
                    <div
                        style={{
                            whiteSpace: 'pre',
                            paddingLeft: 10,
                            minHeight: 300,
                            overflowX: 'auto',
                            overflowY: 'auto',
                            maxHeight: '300px',
                            fontWeight: 'normal',
                        }}
                    >
                        {content}
                    </div>
                </Flex>
            }
            placement={'left'}
            overlayInnerStyle={{
                width: 400,
                background: 'white',
                color: 'black',
                position: 'absolute',
                right: -9,
                top: -100,
                padding: 0,
                zIndex: 1000,
                marginRight: 0,
            }}
            className={styles.popover}
        >
            {children}
        </Popover>
    );
}
