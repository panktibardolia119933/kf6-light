import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import WriteTab from '../writeTab/WriteTab'
import { connect } from 'react-redux'
import {editNote, removeDrawing} from '../../store/noteReducer.js'
import {openDrawDialog} from '../../store/dialogReducer.js'
import './Note.css'

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.onEditorSetup = this.onEditorSetup.bind(this);
        this.onDrawingToolOpen = this.onDrawingToolOpen.bind(this);
        this.addDrawing = this.addDrawing.bind(this);
        this.onNoteChange = this.onNoteChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawing && prevProps.drawing !== this.props.drawing && this.props.drawTool === this.props.noteId) {
            console.log("Drawing added")
            this.editor.insertContent(this.props.drawing)
            this.props.removeDrawing()
        }
    }

    onNoteChange(note) {
        if (note.scaffold){
            const {tagCreator, initialText} = note.scaffold;
            this.addSupport(true, initialText, tagCreator)
        }else{
            this.props.editNote({id: this.props.noteId, ...note})
        }
    }

    onEditorSetup(editor){
        editor.onDrawButton = this.onDrawingToolOpen;
        this.editor = editor;
    }

    onDrawingToolOpen(){
        //Create dialog
        this.props.openDrawDialog(this.props.noteId);
    }

    addDrawing(drawing) {
        // Add draw to editor
        console.log(drawing)
        this.editor.insertContent(drawing);
    }

    addSupport(selection, initialText, tagCreator) {
        const selected = this.editor.selection.getContent();
        let text = selected.length ? selected : initialText;
        const {tag, supportContentId} = tagCreator(text);

        this.editor.insertContent(tag)
        //select text after insert
        if (selection) {
            const contentTag = this.editor.dom.get(supportContentId);
            if (contentTag)
                this.editor.selection.setCursorLocation(contentTag)
        }
    }

    render() {
        return (
            <div>

                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" transition={false}>
                    <Tab eventKey="home" title="read">
                        <div  dangerouslySetInnerHTML={{__html: this.props.note.content}} />
                    </Tab>
                    <Tab eventKey="profile" title="write">
                        <WriteTab
                            note={this.props.note}
                            onScaffoldSelected={this.scaffoldSelected}
                            onChange={this.onNoteChange}
                            onEditorSetup={this.onEditorSetup}
                        ></WriteTab>
                    </Tab>
                    <Tab eventKey="contact" title="authors">
                        Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius duis at consectetur lorem donec? Et molestie ac, feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt?
                    </Tab>
                </Tabs>

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        note: state.notes[ownProps.noteId],
        drawing: state.notes.drawing,
        drawTool: state.dialogs.drawTool
    }
}

const mapDispatchToProps = { editNote, openDrawDialog, removeDrawing}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Note)

