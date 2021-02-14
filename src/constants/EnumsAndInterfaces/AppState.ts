import store from "../../../redux/store";

export enum AppState {
    STATE_1 = "#ddb676",
    STATE_2 = "#077187",
    STATE_3 = "#9ECE9A"
}

export function getAppState(): AppState {
    const selectedAreaId: string = store.getState().reducer.selectedSpatialAreaId;
    const selectedContextId: string = store.getState().reducer.selectedContextId;

    if (selectedAreaId && selectedContextId) {
        return AppState.STATE_3;
    }
    if (selectedAreaId) {
        return AppState.STATE_2;
    }
    return AppState.STATE_1;
}

