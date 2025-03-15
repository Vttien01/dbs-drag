import { DatePicker, Form } from 'antd';
import React from 'react';
import styles from './PublishDateField.module.scss';
import dayjs from 'dayjs';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

function PublishDateField({ label = '', startFieldName, endFieldName, ...props }) {
    const form = useFormInstance();

    const disabledStartDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const disabledEndDate = (current) => {
        const startDateFieldValue = form.getFieldValue(startFieldName);
        // if (!startDateFieldValue) return true;

        // end date must be greater than today and start date
        return (
            current &&
            (current < dayjs().endOf('day') ||
                (startDateFieldValue && current < dayjs(startDateFieldValue).endOf('day')))
        );
    };

    // const disabledTime = () => {
    //     const startDateFieldValue = !!form.getFieldValue(startFieldName);

    //     return {
    //         disabledHours: () => !startDateFieldValue ? range(0,24) : range(0,0),
    //         disabledMinutes: () => !startDateFieldValue ? range(0,60) : range(0,0),
    //         disabledSeconds: () => !startDateFieldValue ? range(0,60) : range(0,0),
    //     };
    // };

    return (
        <Form.Item {...props} label={label} labelAlign="left">
            <Form.Item name={startFieldName} className={styles.customDateField}>
                <DatePicker
                    showTime
                    placeholder="Immediate"
                    disabledDate={disabledStartDate}
                    onChange={(value) => {
                        const endFieldValue = form.getFieldValue(endFieldName);
                        if (value && endFieldValue && dayjs(value).isAfter(endFieldValue)) {
                            form.setFieldValue(endFieldName, null);
                        }
                    }}
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <span className={styles.customLabelDatepicker}>End</span>
            <Form.Item name={endFieldName} className={styles.customDateField}>
                <DatePicker
                    showTime
                    showNow={false}
                    placeholder="Ongoing"
                    disabledDate={disabledEndDate}
                    style={{ width: '100%' }}
                />
            </Form.Item>
        </Form.Item>
    );
}

export default PublishDateField;
