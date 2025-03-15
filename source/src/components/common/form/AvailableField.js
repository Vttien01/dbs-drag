import { selectSiteInfo } from '@selectors/app';
import { Col, Form, Row } from 'antd';
import { useSelector } from 'react-redux';
import CheckboxField from './CheckboxField';
import React from 'react';

function AvailableField() {
    const siteInfo = useSelector(selectSiteInfo);

    return (
        <Form.Item labelAlign="left" name="availableIn" label="Available in">
            <Row gutter={12}>
                <Col style={{ marginTop: '-4px' }}>
                    <CheckboxField
                        initialValue={true}
                        optionLabel="General Area"
                        label=""
                        name={'availableInGeneralArea'}
                    />
                </Col>
                <Col hidden={siteInfo?.type == 'campaign_site'} style={{ marginTop: '-4px' }}>
                    <CheckboxField initialValue={true} optionLabel="Training Set" name={'availableInTrainingSet'} />
                </Col>
                <Col hidden={siteInfo?.type == 'top_site'} style={{ marginTop: '-4px' }}>
                    <CheckboxField
                        initialValue={true}
                        optionLabel="Daily Challenge"
                        name={'availableInDailyChallenge'}
                    />
                </Col>
            </Row>
        </Form.Item>
    );
}

export default AvailableField;
