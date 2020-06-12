import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import WriteTab from '../writeTab/WriteTab'
import History from '../historyTab/History'
import { connect } from 'react-redux'
import {editNote, removeDrawing, editSvgDialog,
        fetchAttachments, setWordCount, fetchRecords } from '../../store/noteReducer.js'
import {openDrawDialog} from '../../store/dialogReducer.js'
import { scaffoldWordCount } from '../../store/kftag.service.js'
import { dateFormatOptions } from '../../store/globalsReducer.js'
import './Note.css'

class Note extends React.Component {
    constructor(props) {
        super(props);
        this.onEditorSetup = this.onEditorSetup.bind(this);
        this.onDrawingToolOpen = this.onDrawingToolOpen.bind(this);
        this.addDrawing = this.addDrawing.bind(this);
        this.onNoteChange = this.onNoteChange.bind(this);
        this.wordCount = this.wordCount.bind(this);
        this.onTabSelected = this.onTabSelected.bind(this)
        this.scaffoldWords = 0;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.drawing && prevProps.drawing !== this.props.drawing && this.props.drawTool === this.props.noteId) {
            this.editor.insertContent(this.props.drawing)
            this.props.removeDrawing()
        }
    }

    onNoteChange(note) {
        if (note.scaffold){
            const {tagCreator, initialText, scaffoldText} = note.scaffold;
            this.addSupport(true, initialText, tagCreator, scaffoldText)
        }else if (note.attach){
            this.editor.insertContent(note.attach)
        }
        else{
            this.props.editNote({_id: this.props.noteId, ...note})
            if (note.data) {
                this.wordCount(note.data.body);
            }
        }
    }

    wordCount(text) {
        const wordCount = this.editor.plugins.wordcount.getCount() - scaffoldWordCount(text);
        this.props.setWordCount({contribId: this.props.noteId, wc: wordCount})
    }

    onEditorSetup(editor){
        editor.onDrawButton = this.onDrawingToolOpen;
        this.editor = editor;
    }

    onDrawingToolOpen(svg){
        //Create dialog
        if (svg) {
            this.props.editSvgDialog(this.props.noteId, svg);
        } else {
            this.props.openDrawDialog(this.props.noteId);
        }
    }

    addDrawing(drawing) {
        // Add draw to editor
        this.editor.insertContent(drawing);
    }

    addSupport(selection, initialText, tagCreator, scaffoldText) {
        const selected = this.editor.selection.getContent();
        let text = selected.length ? selected : initialText;
        const {tag, supportContentId} = tagCreator(text);
        this.scaffoldWords += scaffoldText.split(' ').length
        this.editor.insertContent(tag)
        //select text after insert
        if (selection) {
            const contentTag = this.editor.dom.get(supportContentId);
            if (contentTag)
                this.editor.selection.setCursorLocation(contentTag)
        }
    }

    onTabSelected(tab) {
        if (tab === 'history'){ //Refresh records
            this.props.fetchRecords(this.props.note._id)
        }
    }

    render() {
        const formatter = new Intl.DateTimeFormat('default', dateFormatOptions)
        return (
            <div>
                <div className='contrib-info'>
                    Created By: {this.props.author.firstName} {this.props.author.lastName} <br/>
                    Last modified: {formatter.format(new Date(this.props.note.modified))}
                </div>
                <Tabs defaultActiveKey="write" transition={false} onSelect={this.onTabSelected}>
                    <Tab eventKey="home" title="read">
                        <div  dangerouslySetInnerHTML={{__html: this.props.note.data.body}} />
                    </Tab>
                    <Tab eventKey="write" title="write">
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
                    <Tab eventKey='history' title='history'><History records={this.props.note.records}/></Tab>
                    <Tab eventKey='properties' title='properties'></Tab>
                </Tabs>

            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const note = state.notes[ownProps.noteId]
    return {
        note: note,
        drawing: state.notes.drawing,
        drawTool: state.dialogs.drawTool,
        author: state.users[note.authors[0]] || 'NA'
    }
}

const mapDispatchToProps = { editNote, openDrawDialog, setWordCount,
                             removeDrawing, editSvgDialog, fetchAttachments, fetchRecords}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Note)

