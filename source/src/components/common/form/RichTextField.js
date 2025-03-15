import { Col, Flex, Form, Row, Select } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useFormField from '@hooks/useFormField';
import ReactQuill, { Quill } from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import AutoLinks from 'quill-auto-links';
import ImageResize from 'quill-image-resize-module-react';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';

ReactQuill.Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
Quill.register('modules/imageResize', ImageResize);
const AlignStyle = ReactQuill.Quill.import('attributors/style/align');
ReactQuill.Quill.register(AlignStyle, true);
ReactQuill.Quill.register('modules/autoLinks', AutoLinks);
function Counter(quill, options) {
    const container = document.querySelector(options.container);
    quill.on(Quill.events.TEXT_CHANGE, () => {
        const text = quill.getText();
        if (options.maxLength) {
            container.innerText = 'Remaining characters: ' + `${options.maxLength - text.length}` + ' characters';
        }
    });
}

Quill.register('modules/counter', Counter);
const Parchment = Quill.import('parchment');

const fontSizeArr = Array.from({ length: 100 }, (_, i) => `${i + 1}px`);
var SizeClass = Quill.import('attributors/style/size');
SizeClass.whitelist = fontSizeArr;
Quill.register(SizeClass, true);

const customSizeAttributor = new Parchment.Attributor.Style('custom-size-attributor', 'font-size');
const customColorAttributor = new Parchment.Attributor.Style('custom-color-attributor', 'color');
import screenfull from 'screenfull';

Quill.register(customColorAttributor, true);
Quill.register(customSizeAttributor, true);

var Font = Quill.import('formats/font');
Font.whitelist = [
    'Helvetica',
    'Poppins',
    'Lobster',
    'Time News Roman',
    'Roboto',
    'Lato',
    'Open Sans',
    'Montserrat',
    'Quicksand',
];
Quill.register(Font, true);

function getLoader() {
    const div = document.createElement('div');
    div.className = 'loader-container';
    div.innerHTML = "<div class='loader'>Loading...</div>";
    return div;
}

const formats = [
    'header',
    'font',
    'size',
    'color',
    'background',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'span', // Added span to formats
];

const RichTextField = (props) => {
    const {
        label,
        disabled,
        name,
        required,
        style,
        labelAlign,
        formItemProps,
        maxLength,
        help,
        uploadImageApi = apiConfig.file.image,
        count,
    } = props;
    const [ font, setFont ] = useState('Helvetica, Arial, sans-serif');
    const [ valueImplement, setValueImplement ] = useState('');
    const quillRef = useRef();

    const { execute: executeUploadImage } = useFetch(uploadImageApi);
    const [ fontSize, setFontSize ] = useState(18);
    const options = Array.from({ length: 100 }, (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}`,
    }));

    const imageHandler = useCallback(() => {
        const selectLocalImage = () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
            input.click();

            input.onchange = () => {
                const file = input.files[0];

                if (/^image\//.test(file.type)) {
                    uploadToServer(file);
                } else {
                    console.warn('You could only upload images.');
                }
            };
        };
        selectLocalImage();
    }, []);
    const uploadToServer = (file) => {
        executeUploadImage({
            data: {
                image: file,
            },
            onCompleted: ({ data }) => {
                insertToEditor(data.url);
            },
            onError: () => {
                console.warn('Upload image error');
            },
        });
    };

    const insertToEditor = (url) => {
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, 'image', url);
    };

    const modules = useMemo(() => {
        return {
            imageResize: {
                parchment: Quill.import('parchment'),
                modules: [ 'Resize', 'DisplaySize' ],
            },
            counter: {
                container: '#counter',
                unit: 'characters',
                maxLength: maxLength,
            },
            toolbar: {
                container: [
                    [
                        { size: fontSizeArr }, // Sử dụng toàn bộ danh sách font-size
                    ],
                    [ { color: [] }, { background: [] } ],
                    [ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
                    [ { align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' } ],
                    [ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' } ],
                    [ 'link', 'image' ],
                    [ 'clean' ],
                    [ 'fullscreen' ],
                ],
                handlers: {
                    image: imageHandler,
                    fullscreen: () => {
                        if (screenfull.isEnabled) {
                            const editorContainer = document.querySelector('.quill');
                            screenfull.toggle(editorContainer);
                        } else {
                            console.log('Screenfull is not enabled');
                        }
                    },
                },
            },
            imageDropAndPaste: {
                handler: imagePastHandler,
            },
            clipboard: {
                allowed: {
                    tags: [
                        'article',
                        'p',
                        'span',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'strong',
                        'em',
                        'b',
                        'i',
                        'u',
                        'del',
                        'sup',
                        'sub',
                    ],
                    attributes: [ 'class', 'style' ],
                },
                matchVisual: false,
            },
            autoLinks: true,
        };
    }, []);

    async function imagePastHandler(imageDataUrl, type, imageData) {
        const file = imageData.toFile();
        if (file) uploadToServer(file);
    }

    const { rules } = useFormField(props);

    return (
        <Row>
            <Col span={5}>{label}:</Col>
            <Col span={19}>
                <Flex vertical>
                    <Form.Item
                        required={required}
                        labelAlign={labelAlign}
                        name={name}
                        rules={rules}
                        help={help}
                        initialValue=""
                        {...formItemProps}
                    >
                        <Implement
                            style={style}
                            quillRef={quillRef}
                            maxLength={maxLength}
                            formats={formats}
                            modules={modules}
                            readOnly={disabled}
                            count={count}
                            font={font}
                            setValueImplement={setValueImplement}
                        />
                    </Form.Item>
                </Flex>
            </Col>
        </Row>
    );
};

function Implement({ value, onChange, style, maxLength, formats, modules, disabled, quillRef, setValueImplement }) {
    const processValue = (value) => {
        // Regex tìm các thẻ <strong> không có style
        const updatedValue = value.replace(
            /<(strong|u|em)(?![^>]*style=["'][^"']*["'])([^>]*)>/g,
            '<$1 style="color: #001529;"$2>',
        );
        return updatedValue;
    };
    return (
        <>
            <ReactQuill
                value={value}
                onChange={(value) => {
                    // const processedValue = processValue(value); // Xử lý giá trị trước khi lưu
                    const editor = quillRef.current?.getEditor?.();
                    onChange(value);
                    setValueImplement(value);
                    if (editor?.getText?.()?.length > maxLength) {
                        editor.deleteText(maxLength, editor.getLength());
                    }
                }}
                style={{ ...style }}
                ref={quillRef}
                modules={modules}
                readOnly={disabled}
            />
            {maxLength ? (
                <div id="counter" style={{ display: 'inline-block', float: 'right', color: 'rgba(0, 0, 0, 0.45)' }}>
                    Remaining characters: {maxLength} characters
                </div>
            ) : (
                <div id="counter"></div>
            )}
        </>
    );
}

export default RichTextField;

// const Inline = Quill.import('blots/inline');

// class GenericCustomInline extends Inline {
//     // Retain the "style" attribute
//     static create(value) {
//         let node = super.create();
//         if (value) {
//             node.setAttribute('style', value);
//             return node;
//         }
//     }

//     static formats(node) {
//         return node.getAttribute('style') || null; // Return the style attribute value
//     }

//     format(name, value) {
//         if (value) {
//             if (name === 'color') super.format('custom-color-attributor', value);
//             else if (name === 'font-family') super.format('custom-family-attributor', value);
//             else if (name === 'size') super.format('custom-size-attributor', value);
//         }
//     }
// }

// class CustomSpanBlot extends GenericCustomInline {
//     static blotName = 'customSpan'; // Internal name for the blot
//     static tagName = 'span'; // HTML tag to match
// }

// // Register the custom blot
// Quill.register(CustomSpanBlot);

// class CustomUBlot extends GenericCustomInline {
//     static blotName = 'customU'; // Internal name for the blot
//     static tagName = 'u'; // HTML tag to match
// }

// // Register the custom blot
// Quill.register(CustomUBlot);

// class CustomStrongBlot extends GenericCustomInline {
//     static blotName = 'customStrong'; // Internal name for the blot
//     static tagName = 'strong'; // HTML tag to match
// }

// // Register the custom blot
// Quill.register(CustomStrongBlot);

// class CustomEmBlot extends GenericCustomInline {
//     static blotName = 'customEm'; // Internal name for the blot
//     static tagName = 'em'; // HTML tag to match
// }

// // Register the custom blot
// Quill.register(CustomEmBlot);

const ListItemBlot = Quill.import('formats/list/item');
class CustomListItem extends ListItemBlot {
    optimize(context) {
        super.optimize(context);

        if (this.children.length >= 1) {
            const child = this.children.head;
            const attributes = child?.attributes?.attributes;

            if (attributes) {
                for (const key in attributes) {
                    const element = attributes[key];
                    let name = element.attrName;
                    var value = element.value(child.domNode);

                    if (name === 'color') super.format('custom-color-attributor', value);
                    else if (name === 'font-family') super.format('custom-family-attributor', value);
                    else if (name === 'size') super.format('custom-size-attributor', value);
                }
            }
            // else {
            //     super.format('custom-color-attributor', false);
            //     super.format('custom-family-attributor', false);
            //     super.format('custom-size-attributor', false);
            // }
        }
    }
}

Quill.register(CustomListItem, true);
