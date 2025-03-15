import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import Image from '@assets/images/f8-certificate.png';
import styles from './index.module.scss';
import EditableText from '@components/common/elements/EditableText';
function BasicRnD({
    detail,
    backgroundImage,
    data,
    setData,
    itemActive,
    setItemActive,
    setBackGroundSize,
    backgroundSize,
    isVertical,
    setMousePosition,
    mousePosition,
}) {
    const handleDragStop = (id, position) => {
        setItemActive(id);
        const updatedData = data?.map((item) => (item.id === id ? { ...item, x: position.x, y: position.y } : item));
        setData(updatedData);
    };

    const handleResizeStop = (id, size) => {
        const updatedData = data?.map((item) =>
            item.id === id ? { ...item, width: size.width, height: size.height } : item,
        );
        setData(updatedData);
    };

    const handleSave = (id, newText) => {
        const updatedData = data?.map((item) => (item.id === id ? { ...item, content: newText } : item));
        setData(updatedData);
    };

    return (
        <div
            className={styles.wrapper}
            style={{ width: isVertical ? '798px' : '1127px', height: isVertical ? '1127px' : '798px' }}
        >
            {backgroundImage && (
                <div style={{ width: 'calc(100% + 4px)', height: 'calc(100% + 4px)' }}>
                    <Rnd
                        default={{
                            x: 0,
                            y: 0,
                            width: '100%',
                            height: '100%',
                        }}
                        disableDragging
                        enableResizing={false}
                        bounds="parent"
                    >
                        <img
                            style={{ width: '100%', height: '100%' }}
                            src={backgroundImage}
                            alt={`backgroundImage`}
                            draggable="false"
                        />
                    </Rnd>
                </div>
            )}

            {data?.map((item) => (
                <Rnd
                    key={item.id}
                    default={{
                        x: item.x,
                        y: item.y,
                        width: `${item.width}px`,
                        height: `${item.height}px`,
                    }}
                    onDragStop={(e, d) => handleDragStop(item.id, d)}
                    // disableDragging={true}
                    onResizeStop={(e, direction, ref, delta, position) =>
                        handleResizeStop(item.id, {
                            width: ref.style.width,
                            height: ref.style.height,
                        })
                    }
                    cancel=".no-drag"
                    bounds="parent"
                    style={{
                        border: itemActive === item.id ? 'solid 2px #F69600' : 'dashed 2px #F69600',
                        color: item.color,
                        fontSize: `${item.fontSize}px`,
                        fontWeight: item.fontWeight,
                        fontFamily: item.fontFamily,
                        textAlign: 'center',
                    }}
                    className={styles.itemRnd}
                >
                    <div className={styles.itemRndContent}>
                        {item.type === 'text' && (
                            <EditableText
                                className="no-drag"
                                id={item.id}
                                text={item.content}
                                onSave={(newText) => handleSave(item.id, newText)}
                                setMousePosition={setMousePosition}
                                itemActive={itemActive}
                                mousePosition={mousePosition}
                                fontSize={item.fontSize}
                                fontFamily={item.fontFamily}
                                color={item.color}
                            />
                        )}
                        {item.type === 'image' && (
                            <img
                                style={{ width: '100%', height: '100%' }}
                                src={item.img}
                                alt={`Image ${item.id}`}
                                draggable="false"
                            />
                        )}
                        {item?.type === 'link' && (
                            <EditableText
                                className="no-drag"
                                id={item.id}
                                text={item.content}
                                url={item.url}
                                onSave={(newText) => handleSave(item.id, newText)}
                                setMousePosition={setMousePosition}
                                itemActive={itemActive}
                                mousePosition={mousePosition}
                                fontSize={item.fontSize}
                                fontFamily={item.fontFamily}
                                color={item.color}
                            />
                        )}
                    </div>
                </Rnd>
            ))}
        </div>
    );
}

export default BasicRnD;
