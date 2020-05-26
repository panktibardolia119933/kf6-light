import { configureStore } from '@reduxjs/toolkit';
import { dialogReducer } from './dialog_reducer.js'
import { noteReducer } from './noteReducer.js'
import { scaffoldReducer } from './scaffoldReducer.js'

export default configureStore({
  reducer: {
      dialogs: dialogReducer,
      notes: noteReducer,
      scaffolds: scaffoldReducer
  },
    devTools: true
});
