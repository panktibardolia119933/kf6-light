import React from 'react';
import MCEditor from '../editor/MCEditor'
import {Container, Row, Col, Form} from 'react-bootstrap'
import ScaffoldSelect from '../scaffold/ScaffoldSelect'
import AttachArea from '../attachmentArea/AttachArea.js'

import './WriteTab.css';
class WriteTab extends React.Component {

    constructor(props){
        super(props)
        this.onScaffoldSelected = this.onScaffoldSelected.bind(this);
    }

    onScaffoldSelected(tagCreator, initialText){
        console.log(tagCreator, initialText)
        this.props.onChange({scaffold: {tagCreator, initialText}})
    }

    render() {
        const {note, onChange, onEditorSetup} = this.props;
        return (
            <Container className='write-container p-0'>
                    <Row>
                        <Col>
                            <Form.Group controlId="note-title">
                                <Form.Control type="text"
                                              size="sm"
                                              placeholder="Enter title"
                                              value={note.title}
                                              onChange={(val) => {onChange({title: val.target.value})}}/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} className='pr-0'>
                            <ScaffoldSelect initVal={0} onScaffoldSelected={this.onScaffoldSelected}/>
                        </Col>
                        <Col md={9}>
                            <MCEditor value={note.content}
                                      onEditorSetup={onEditorSetup}
                                      onEditorChange={(content, editor) => onChange({ data: {body: content}})}/>

                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <AttachArea note={note}></AttachArea>
                    </Row>
            </Container>
        )
    }
}

export default WriteTab;
