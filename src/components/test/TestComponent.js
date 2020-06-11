import React, {useEffect} from 'react';
import AttachArea from '../attachmentArea/AttachArea.js'
import AttachPanel from '../attachmentCollapse/AttachPanel.js'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAuthor } from '../../store/globalsReducer.js'

const TestComponent= props => {
    const note = {id: 1, title:'hola', content: 'asdf', attachments: []}
    const author = useSelector((state) => state.globals.author);
    const communityId = useSelector((state) => state.globals.communityId)
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAuthor(communityId));
        console.log("useeffect");
    }, [dispatch, communityId]);

    return (
        <div style={{marginTop: '100px'}}>
            <AttachArea note={note}></AttachArea>
            <AttachPanel></AttachPanel>
        </div>
    )

};

export default TestComponent;
