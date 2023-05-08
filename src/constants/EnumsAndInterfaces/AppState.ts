/* CSS HEX */
// --bittersweet: #ee6352ff;
// --process-cyan: #08b2e3ff;
// --magnolia: #efe9f4ff;
// --jade: #57a773ff;
// --ultra-violet: #484d6dff;

// export enum AppState {
//   SELECTING_AREA = '#efe9f433', // magnolia
//   SELECTING_CONTEXT = '#57a77333', // jade
//   CONTEXT_SCREEN = '#484d6d33', // ultra-violet
//   BAG_SCREEN = '#08b2e333', // process-cyan
// }

export enum ScreenColors {
  SELECTING_AREA = '#efe9f433', // magnolia
  SELECTING_CONTEXT = '#57a77333', // jade
  CONTEXT_SCREEN = '#484d6d33', // ultra-violet
  BAG_SCREEN_DRYING = '#ee635233', // bittersweet
  BAG_SCREEN_FIELD = '#08b2e333', // process-cyan
}

// export function getAppState(): AppState {
//   const selectedAreaId: string = store.getState().reducer.selectedSpatialAreaId;
//   const selectedContextId: string = store.getState().reducer.selectedContextId;

//   if (selectedAreaId && selectedContextId) {
//     return AppState.CONTEXT_SCREEN;
//   }
//   if (selectedAreaId) {
//     return AppState.SELECTING_CONTEXT;
//   }
//   return AppState.SELECTING_AREA;
// }
