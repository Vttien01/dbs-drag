import { createReducer } from '@store/utils';
import { telemetryActions } from '@store/actions';

const { setTelemetries } = telemetryActions;

const initialState = {
    telemetries: {},
};

const allianceReducer = createReducer(
    {
        reducerName: 'telemetry',
        initialState,
    },
    {
        [setTelemetries.type]: (state, { payload }) => {
            state.telemetries = payload || null;
        },
    },
);

export default allianceReducer;
