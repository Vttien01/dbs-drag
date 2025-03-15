import { createSelector } from "reselect";

export const selectTelemetries = createSelector([ state => state.telemetry ], ({ telemetries }) => telemetries);

const telemetrySelectors = {
    selectTelemetries,
};

export default telemetrySelectors;