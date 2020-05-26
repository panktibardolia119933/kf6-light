import React from 'react';
import Dialog from '../dialog/Dialog.js'
import Iframe from '../iframe/IFrame.js'
import { connect } from 'react-redux'

class DrawDialog extends React.Component {

    constructor(props) {
        super(props);
        this.onConfirm = this.onConfirm.bind(this);
    }

    onConfirm(){
        var wnds = document.getElementsByTagName("iframe");
        var wnd1 = null;
        for(var i = 0; i < wnds.length; i++){
            if(wnds[i].src.endsWith("drawing-tool/svg/index.html")) {
                //Found the element
                if(wnd1 !== null) {
                    // 2 iframes with same src found
                    console.log("error, found second window with matching src");
                    console.log(wnd1);
                }
                else{
                    wnd1 = wnds[i].contentWindow;
                }
            }
        }
        var bg = wnd1.svgCanvas.current_drawing_.all_layers[0];
        var wnd2 = wnd1.svgCanvas.current_drawing_.all_layers[1];

        var widd = wnd2[1].getBBox().width;
        var heig = wnd2[1].getBBox().height;

        wnd1.svgCanvas.current_drawing_.svgElem_.setAttribute("width", widd);
        wnd1.svgCanvas.current_drawing_.svgElem_.setAttribute("height", heig);
        bg[1].childNodes[1].setAttribute("width", widd);
        bg[1].childNodes[1].setAttribute("height", heig);

        wnd1.svgCanvas.selectAllInCurrentLayer();
        wnd1.svgCanvas.groupSelectedElements();
        wnd1.svgCanvas.alignSelectedElements('l', 'page');
        wnd1.svgCanvas.alignSelectedElements('t', 'page');
        wnd1.svgCanvas.ungroupSelectedElement();
        wnd1.svgCanvas.clearSelection();

        wnd1.svgCanvas.current_drawing_.svgElem_.setAttribute("padding", '2em');
        wnd1.svgCanvas.setResolution('fit', 100);
        var svg = wnd1.svgCanvas.getSvgString();

        var canvas = document.createElement("canvas");

        canvas.width = widd + 4;
        canvas.height = heig + 4;

        var ctx = canvas.getContext("2d");

        var img = document.createElement("img");

        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svg));

        img.onload = function () {
            ctx.drawImage(img, 0, 0);
            var p = canvas.toDataURL("image/png");
            const drawing = "<img alt='" + svg + "' src='" + p + "'/>";

            this.props.onConfirm(drawing);
        }.bind(this);
    }

    render() {
        return (
            <Dialog
                title='DrawTool'
                style={{zIndex: 3000}}
                onClose={this.props.onClose}
                onConfirm={this.onConfirm}
                confirmButton='Add'>
                <Iframe source='/drawing-tool/svg/index.html' svg={this.props.note.editSvg} />
            </Dialog>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        note: state.notes[ownProps.noteId],
    }
}

/* const mapDispatchToProps = { editNote, openDrawDialog, removeDrawing, editSvgDialog} */

export default connect(
    mapStateToProps,
)(DrawDialog)
