import React, {useEffect} from 'react';
import DialogHandler from '../dialogHandler/DialogHandler.js'
import {Button} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import {newNote} from '../../store/noteReducer.js'
import { fetchAuthor, fetchView } from '../../store/globalsReducer.js'
const NewNote = props => {

    const communityId = useSelector((state) => state.globals.communityId)
    const viewId = useSelector((state) => state.globals.viewId)
    const view = useSelector((state) => state.globals.view)
    const dispatch = useDispatch();
    const createNewNote = () => {
        dispatch(newNote())
    };

    useEffect(() => {
        dispatch(fetchAuthor(communityId));
        dispatch(fetchView(viewId))
    }, [dispatch, communityId, viewId]);

    return (
        <div style={{marginTop: '100px'}} >
            <Button onClick={createNewNote}>New Note</Button>
            <DialogHandler/>
        </div>
    );
}

export default NewNote;
