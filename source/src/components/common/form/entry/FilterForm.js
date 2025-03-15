import { Button, Col, Dropdown, Form, Input, Row, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useEffect, useMemo, useState } from 'react';
import qs from 'query-string';

import { SearchOutlined, CaretDownOutlined } from '@ant-design/icons';
import FilterItem from './FilterItem';

import styles from './FilterForm.module.scss';
import InputTextField from '../InputTextField';

function FilterForm({
    onApplyFilter,
    searchFilterName,
    onResetFilter,
    onAddFilter,
    placeholder,
    filters = [],
    hiddenFilter,
    initialValue,
    ...props
}) {
    const [ form ] = useForm();
    const [ activeFilters, setActiveFilters ] = useState({});

    const hasFilter = !!Object.keys(activeFilters).length;

    function onClearFilterItem(name) {
        if (!activeFilters[name]) return;

        const newFilters = { ...activeFilters };
        delete newFilters[name];
        setActiveFilters(newFilters);
        form.setFieldValue(name, undefined);
    }

    const selectFilterDropdownItem = useMemo(() => {
        return filters.map((filter) => ({
            key: filter.name,
            label: (
                <div
                    onClick={() => {
                        if (!activeFilters[filter.name]) {
                            setActiveFilters({
                                ...activeFilters,
                                [filter.name]: filter,
                            });

                            onAddFilter?.(filter);
                        }
                    }}
                >
                    {filter.label}
                </div>
            ),
        }));
    }, [ filters, activeFilters ]);

    const renderFilters = useMemo(() => {
        return Object.values(activeFilters).map((filter) => (
            <Row key={filter.name}>
                <FilterItem {...filter} onClearFilter={() => onClearFilterItem(filter.name)} />
            </Row>
        ));
    }, [ activeFilters ]);

    function renderApplyFilter() {
        if (!hasFilter) return null;

        return (
            <>
                <Col style={{ marginRight: 10, marginLeft: 10 }}>
                    <Button
                        onClick={() => {
                            setActiveFilters({});
                            onResetFilter?.();
                        }}
                    >
                        Remove all filters
                    </Button>
                </Col>
                <Col>
                    <Button htmlType="submit">Apply filters</Button>
                </Col>
            </>
        );
    }

    useEffect(() => {
        if (!hasFilter) {
            onResetFilter?.();
            form.resetFields();
        }
    }, [ activeFilters ]);

    function onFinish(values) {
        const urlSearchParams = new URLSearchParams();
        Object.entries(values).forEach(([ key, value ]) => {
            if (value?.value != undefined) {
                if (value.compareType != undefined) {
                    urlSearchParams.append(`[${key}][o]`, value.compareType);
                }

                urlSearchParams.append(`[${key}][v]`, value.value);
            }
        });
    }

    const createQueryStringKey = (keys) => keys.map((key) => `[${key}]`).join('');

    function formatQs(queryString, filterNames = []) {
        const queryObj = qs.parse(decodeURI(queryString));

        const filterData = {};

        filterNames.forEach((filterName) => {
            const keyCompareType = createQueryStringKey([ filterName, 'o' ]);
            const keyValue = createQueryStringKey([ filterName, 'v' ]);

            filterData[filterName] = {};

            if (queryObj[keyCompareType]) {
                filterData[filterName].compareType = queryObj[keyCompareType];
            }
            if (queryObj[keyValue]) {
                filterData[filterName].value = queryObj[keyValue];
            }
        });

        return filterData;
    }

    const formatQueryStringToObject = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const pattern = /\[(.*?)\]\[(.*?)\]/; // [createdAt][o]=9 => [1] = createdAt, [2] = o
        const filterObject = {};

        for (const [ key, value ] of searchParams.entries()) {
            try {
                const [ , filterName, filterType ] = key.match(pattern);

                // Initialize the filter object if it doesn't exist yet
                filterObject[filterName] = filterObject[filterName] || {};

                if (filterType == 'o') {
                    filterObject[filterName].compareType = value;
                } else if (filterType == 'v') {
                    filterObject[filterName].value = value;
                }
            } catch {
                // the key does not match the pattern. this case is normal query string (e.g., page=1)
                filterObject[key] = value;
            }
        }

        return filterObject;
    };

    return (
        <div data-has-filter={hasFilter} className={styles.filterForm}>
            <Form
                {...props}
                form={form}
                onFinish={(value) => {
                    const normalizedValue = { ...value };
                    // remove all empty value
                    Object.keys(value).forEach((key) => {
                        if (value[key] == undefined || value[key] == '') {
                            delete normalizedValue[key];
                        }
                    });

                    onApplyFilter(normalizedValue);
                    // console.log(formatQs(window.location.search, [ 'createdAt', 'status', 'title' ]));
                }}
            >
                {renderFilters}
                <Row className={styles.actionBar}>
                    <Col>
                        <InputTextField
                            name={searchFilterName}
                            prefix={<SearchOutlined />}
                            placeholder={placeholder || 'Search..'}
                            initialValue={initialValue}
                        />
                    </Col>
                    {!hiddenFilter && (
                        <Col>
                            <Dropdown menu={{ items: selectFilterDropdownItem }} trigger={[ 'click' ]}>
                                <Button className={styles.addFilterBtn}>
                                    <Space>
                                        Add Filter
                                        <CaretDownOutlined className={styles.dropdownIcon} />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Col>
                    )}
                    {renderApplyFilter()}
                </Row>
            </Form>
        </div>
    );
}

export default FilterForm;
