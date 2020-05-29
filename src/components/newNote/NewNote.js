import React from 'react';
import DialogHandler from '../dialogHandler/DialogHandler.js'
import {Button} from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import {newNote} from '../../store/noteReducer.js'
const NewNote = props => {

    const dispatch = useDispatch();
    const createNewNote = () => {
        dispatch(newNote())
    };
    return (
        <div style={{marginTop: '100px'}} >
            <Button onClick={createNewNote}>New Note</Button>
            <DialogHandler/>
        </div>
    );
}

export default NewNote;
