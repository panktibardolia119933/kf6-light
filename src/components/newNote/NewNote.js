import React, { useCallback } from 'react';
import DialogHandler from '../dialogHandler/DialogHandler.js'
import Note from '../note/Note.js';
import { useSelector, useDispatch } from 'react-redux';
import {closeDialog, closeDrawDialog, focusDialog } from '../../store/dialogReducer.js'
import {removeNote, addDrawing} from '../../store/noteReducer.js'
import DrawDialog from '../drawDialog/DrawDialog.js'

const NewNote = props => {
    const dialogs = useSelector(state => state.dialogs);
    const dispatch = useDispatch();

    const onCloseDrawDialog = useCallback(
        () => {
            dispatch(closeDrawDialog())
        },
        [dispatch]
    );

    const onConfirmDrawDialog = useCallback(
        (drawing) => {
            dispatch(addDrawing(drawing))
            dispatch(closeDrawDialog())
        },
        [dispatch]
    );

    const onFocusDialog = useCallback(
        (dlgId) => dispatch(focusDialog(dlgId)),
        [dispatch]
    );

    // Close dialog and remove dialog AND note from state
    const onCloseDialog = useCallback(
        (dlg) => {
            dispatch(removeNote(dlg.noteId));
            dispatch(closeDialog(dlg.id));
        },
        [dispatch]
    )
    const notesComponents = dialogs.dialogs.map((dlg) => (
        <Note key={dlg.noteId} noteId={dlg.noteId}
        />
    ));

    return (
        <div>

            <DialogHandler dialogs={dialogs.dialogs}
                           onDialogClose={onCloseDialog}
                           onConfirm={onCloseDialog}
                           onFocus={onFocusDialog}
            >
                {notesComponents}
            </DialogHandler>
            {dialogs.drawTool!== null ?
             <DrawDialog onClose={onCloseDrawDialog}
                         onConfirm={onConfirmDrawDialog}
             /> : null}
        </div>
    );
}

export default NewNote;
