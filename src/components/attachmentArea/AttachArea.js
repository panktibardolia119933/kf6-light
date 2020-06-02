import React, {useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Button} from 'react-bootstrap'
import {openAttachPanel} from '../../store/dialogReducer.js'

const AttachArea = props => {
    const dispatch = useDispatch();
    const attachment = (inline) => {
        dispatch(openAttachPanel({noteId: props.note._id, inline}))
    }

    return (
        <Col>
            <Row>
                <Col>
                    <span className=''>Insert image or file: </span>
                    <Button size='sm' variant='outline-dark' className='mx-2' onClick={()=> attachment(true)}>Inline</Button>
                    <Button size='sm' variant='outline-dark' className='mx-2' onClick={()=>attachment(false)}>As an attachment</Button>
                    <Button size='sm' className='mx-2' variant='outline-dark' disabled>Insert</Button>
                </Col>
            </Row>
            <Row>
            </Row>
        </Col>
    )

};

export default AttachArea;
