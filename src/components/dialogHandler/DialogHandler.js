import React, {useCallback} from 'react';
import Dialog from '../dialog/Dialog.js';
import Note from '../note/Note.js';
import { useSelector, useDispatch } from 'react-redux';
import {closeDialog, closeDrawDialog, focusDialog } from '../../store/dialogReducer.js'
import {removeNote, addDrawing} from '../../store/noteReducer.js'
import DrawDialog from '../drawDialog/DrawDialog.js'

const DialogHandler = props => {
    const dialogs = useSelector(state => state.dialogs);
    const dispatch = useDispatch();
    // Close dialog and remove dialog AND note from state

    const onDialogClose = useCallback(
        (dlg) => {
            dispatch(removeNote(dlg.noteId));
            dispatch(closeDialog(dlg.id));
        },
        [dispatch]
    )

    const onFocusDialog = useCallback(
        (dlgId) => dispatch(focusDialog(dlgId)),
        [dispatch]
    );

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

    return (
        <div>{
            dialogs.dialogs.map((elt, i) =>
                <Dialog key={elt.id}
                        onMouseDown={() => onFocusDialog(elt.id)}
                        title={elt.title}
                        style={{zIndex: elt.zIndex}}
                        onClose={()=>onDialogClose(elt)}
                        onConfirm={()=> onDialogClose(elt)}
                        confirmButton={elt.confirmButton}>

                    <Note key={elt.noteId} noteId={elt.noteId} />
                </Dialog>
            )
        }

            {dialogs.drawTool!== null ?
             <DrawDialog onClose={onCloseDrawDialog}
                         onConfirm={onConfirmDrawDialog}
                         noteId={dialogs.drawTool}
             /> : null}
        </div>
    )

}
export default DialogHandler;
