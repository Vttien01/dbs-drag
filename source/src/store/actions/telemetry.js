import { createAction } from '@store/utils';

export const getTelemetries = createAction('telemetry/GET_TELEMETRIES');
export const setTelemetries = createAction('telemetry/SET_TELEMETRIES');

export const actions = {
    getTelemetries,
    setTelemetries,
};
