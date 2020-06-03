import React, {useEffect} from 'react';
import DialogHandler from '../dialogHandler/DialogHandler.js'
import {Button} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import {newNote} from '../../store/noteReducer.js'
import { fetchAuthor, fetchView, fetchCommunity} from '../../store/globalsReducer.js'
const NewNote = props => {

    const communityId = useSelector((state) => state.globals.communityId)
    const viewId = useSelector((state) => state.globals.viewId)
    const view = useSelector((state) => state.globals.view)
    const author = useSelector(state => state.globals.author);
    const dispatch = useDispatch();
    const createNewNote = () => {
        dispatch(newNote(view, communityId, author._id))
    };

    useEffect(() => {
        dispatch(fetchAuthor(communityId));
        dispatch(fetchView(viewId))
        dispatch(fetchCommunity(communityId));
    }, [dispatch, communityId, viewId]);

    return (
        <div style={{marginTop: '100px'}} >
            <Button onClick={createNewNote}>New Note</Button>
            <DialogHandler/>
        </div>
    );
}

export default NewNote;
