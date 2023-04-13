import { configureStore } from "@reduxjs/toolkit";
import columnTasksSlice from "./columnTasksSlice";

const store = configureStore({
  reducer: {
    columnTasks: columnTasksSlice,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
