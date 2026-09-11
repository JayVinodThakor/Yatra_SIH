import {
  combineReducers,
  configureStore,
  createAction,
} from "@reduxjs/toolkit";
import themeConfigSlice from "./themeConfigSlice";
// import userConfigSlice from "./userConfigSlice";
import settingConfigSlice from "./settingConfigSlice";

export const resetAction = createAction("RESET");

const internalReduces = combineReducers({
  themeConfig: themeConfigSlice,
  // userConfig: userConfigSlice,
  setingConfig: settingConfigSlice,
});
type RootState = ReturnType<typeof internalReduces>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: RootState | undefined, action: any) => {
  if (action.type === resetAction.type) {
    state = undefined;
  }
  return internalReduces(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});
export function mutateAllFields<T>(old: T, newObj: T) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  for (const key of Object.keys(old) as (keyof T)[]) {
    old[key] = newObj[key];
  }
}
export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch; 
export default store;