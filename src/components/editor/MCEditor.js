import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
/* import './editor.css' */

class MCEditor extends React.Component {

    render() {
        return (
            <div>
                <Editor
                    value={this.props.content}
                    apiKey="arg05azt52qbujpnf831szuswhmyhoqute0q48btk5bqigoj"
                    init={{
                        setup: (editor) => {this.props.onEditorSetup(editor)},
                        content_css: './editor.css',
                        height: 300,
                        menubar: false,
                        statusbar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code wordcount help'
                        ],
                        external_plugins: {
                            'drawingTool': '/drawing-tool/plugin.min.js'
                        },
                        toolbar: 'styleselect | bold italic underline strikethrough | forecolor backcolor bullist numlist | link code | ltr rtl | charmap | drawingTool'
                    }}
                    onEditorChange={this.props.onEditorChange}
                />
            </div>
        );
    }
}

export default MCEditor;
