import { createAction, createReducer } from '@reduxjs/toolkit';
import { openDialog, openDrawDialog } from './dialogReducer.js'
import api from './api.js'

export const addNote = createAction('ADD_NOTE')
export const removeNote = createAction('REMOVE_NOTE')
export const editNote = createAction('EDIT_NOTE')
export const addDrawing = createAction('ADD_DRAWING')
export const removeDrawing = createAction('REMOVE_DRAWING')
export const editSvg = createAction('EDIT_SVG')
export const addAttachment = createAction('ADD_ATTACHMENT')
export const removeAttachment = createAction('REMOVE_ATTACHMENT')

let noteCounter = 0
const initState = {drawing: ''}

export const noteReducer = createReducer(initState, {
    [addNote]: (notes, action) => {
        notes[action.payload.id] = action.payload
    },
    [removeNote]: (notes, action) => {
        delete notes[action.payload]
    },
    [editNote]: (notes, action) => {
        let note = notes[action.payload.id];
        notes[action.payload.id] = Object.assign({}, note, action.payload)
    },
    [addDrawing]: (notes, action) => {
        notes.drawing = action.payload
    },
    [removeDrawing]: (notes, action) => {
        notes.drawing = '';
    },
    [editSvg]: (notes, action) => {
        notes[action.payload.noteId].editSvg = action.payload.svg
    },
    [addAttachment]: (notes, action) => {
        let note = notes[action.payload.noteId]
        note.attachments.push(action.payload.attachment)
    },
    [removeAttachment]: (notes, action) => {
        let note = notes[action.payload.noteId]
        note.attachments = note.attachments.filter((att) => att.id !== action.payload.attId)
    }
});

//const note = {id: noteCounter++, title: '', content: '', attachments: []}
export const newNote = () => dispatch => {
    const note = {id: noteCounter++, title: '', content: '', attachments: []}
    dispatch(addNote(note))

    dispatch(openDialog({title: 'New Note',
                         confirmButton: 'create',
                         content: 'This is a test Note',
                         noteId: note.id,
                        }))
}

export const editSvgDialog = (noteId, svg) => dispatch => {
    dispatch(editSvg({noteId, svg}))
    dispatch(openDrawDialog(noteId))
}

export const attachmentUploaded = (noteId, attachment, inline) => dispatch => {
    return api.postAttachmentLink(attachment._id, noteId).then((res) => {
        // TODO dispatch(getLinksFrom(noteId))
        dispatch(addAttachment({noteId, attachment}))
    });
}
