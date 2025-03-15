import React, { useEffect, useRef, useState } from 'react';
import styles from './EditableText.module.scss';
const EditableText = ({
    id,
    text,
    onSave,
    setItemActive,
    setMousePosition,
    itemActive,
    mousePosition,
    fontSize,
    fontFamily,
    color,
    url,
    className,
}) => {
    const [ isEditing, setIsEditing ] = useState(false);
    const [ editedText, setEditedText ] = useState(text);
    const handleTextChange = (e) => {
        setEditedText(e.target.value);
    };

    useEffect(() => {
        setEditedText(text);
    }, [ text ]);

    const handleBlur = () => {
        onSave(editedText);
        setIsEditing(false);
    };
    const inputRef = useRef(null);
    const handleCursorPosition = (e) => {
        const selectionStart = e.target.selectionStart;
        setMousePosition({
            idActive: itemActive,
            position: selectionStart,
        });
    };
    if (isEditing) {
        return (
            <input
                className={className}
                style={{
                    height: '100%',
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily,
                    width: '100%',
                    color: color,
                    textAlign: 'center',
                    display:'block',
                    lineHeight:'100%',
                }}
                onClick={handleCursorPosition}
                onKeyUp={handleCursorPosition}
                type="text"
                value={editedText}
                onChange={handleTextChange}
                onBlur={handleBlur}
                autoFocus
                ref={inputRef}
            />
        );
    }

    return (
        <div
            onClick={() => {
                setIsEditing(true);
            }}
            style={{ height:'100%', width:'100%', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
            {text}
        </div>
    );
};

export default EditableText;
