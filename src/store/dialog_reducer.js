import { createAction, createReducer } from '@reduxjs/toolkit';

export const openDialog = createAction('OPEN_DIALOG');
export const closeDialog = createAction('CLOSE_DIALOG');
export const openDrawDialog = createAction('OPEN_DRAW_DIALOG')
export const closeDrawDialog = createAction('CLOSE_DRAW_DIALOG')

let dialogCounter= 0
const initState = { dialogs: [], drawTool: null };
export const dialogReducer = createReducer(initState, {
    // actionCreator.toString() will automatically be called here
    [openDialog] : (state, action) => {
        state.dialogs.push({id: dialogCounter++, ...action.payload});
    },

    // Or, you can reference the .type field:
    [closeDialog] : (state, action) => {
        // console.log(state.dialogs)
        state.dialogs = state.dialogs.filter((dlg) => dlg.id !== action.payload)
    },

    [openDrawDialog]: (state, action) => {
        state.drawTool = action.payload;
    },

    [closeDrawDialog]: (state, action) => {
        state.drawTool = null;
    }
});

