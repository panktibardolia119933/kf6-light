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

// let noteCounter = 0
const initState = {drawing: '', attachments: {}}

export const noteReducer = createReducer(initState, {
    [addNote]: (notes, action) => {
        notes[action.payload._id] = action.payload
    },
    [removeNote]: (notes, action) => {
        delete notes[action.payload]
    },
    [editNote]: (notes, action) => {
        let note = notes[action.payload._id];
        notes[action.payload._id] = Object.assign({}, note, action.payload)
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
    [addAttachment]: (state, action) => {
        let note = state[action.payload.noteId]
        note.attachments.push(action.payload.attachment._id)
        state.attachments[action.payload.attachment._id] = action.payload.attachment
    },
    [removeAttachment]: (notes, action) => {
        let note = notes[action.payload.noteId]
        note.attachments = note.attachments.filter((att) => att.id !== action.payload.attId)
    }
});

const createNote = (communityId, authorId, contextMode, fromId, content) => {
    if (!content){ content = ''}
    if (contextMode && !contextMode.permission){
        window.alert('invalid mode object')
        return
    }
    let mode = {}
    if (contextMode && contextMode.permission === 'private'){
        mode.permission = contextMode.permission;
        mode.group = contextMode.group;
        mode._groupMembers = contextMode._groupMembers;
    } else {
        mode.permission = 'protected';
        mode.group = undefined;
        mode._groupMembers = [];
    }
    let title = contextMode && contextMode.title ? contextMode.title : '';
    let status = contextMode && contextMode.status ? contextMode.status : 'unsaved';

    const newobj = {
        communityId: communityId,
        type: 'Note',
        title: title,
        /* 6.6 the default title was changed to blank by Christian */
        authors: [authorId],
        status: status,
        permission: mode.permission,
        group: mode.group,
        _groupMembers: mode._groupMembers,
        data: {
            body: contextMode && contextMode.body ? contextMode.body : ''
        },
        buildson: fromId,
        langInNote: []

    }

    //save google document id, createdBy and coauthors, current doc permission granted
    if (contextMode && contextMode.docId) {
        newobj.docId = contextMode.docId;
        var myself = newobj.authors[0];
        if (contextMode.coauthors) {
            var ca = contextMode.coauthors.split(',');
            for (var i = 0; i < ca.length; i++) {
                if (ca[i] !== myself) {
                    newobj.authors.push(ca[i]);
                }
            }
        }
        if (contextMode.createdBy) {
            newobj.createdBy = contextMode.createdBy;
        }
        newobj.docShared = [myself];
        newobj.text4search = contextMode.text4search;
    }

    return newobj
}

export const newNote = (view, communityId, authorId) => dispatch => {
    const mode = {permission: view.permission, group: view.group, _groupMembers: view._groupMembers }
    const newN = createNote(communityId, authorId, mode);

    return api.postContribution(communityId, newN).then((res) => {
        const note = {attachments: [], ...res.data}
        dispatch(addNote(note))

        dispatch(openDialog({title: 'New Note',
                             confirmButton: 'create',
                             content: 'This is a test Note',
                             noteId: note._id,
                            }))
    })

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
