import React from 'react';
import Dialog from '../dialog/Dialog.js';

class DialogHandler extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            maxZIndex: "1000",
            prevDraggedNode: null,
            prevDraggedNodeZIndex: null
        }
        this.onDragStart = this.onDragStart.bind(this);
        this.focus = this.focus.bind(this);
    }

    onDragStart(e, node) {
        if (this.state.prevDraggedNode) {
            const prevNode = this.state.prevDraggedNode;
            prevNode.style.zIndex = "999";
        }
        const zIndex = node.node.style.zIndex;
        this.setState(prevState => ({
            prevDraggedNode: node.node,
            prevDraggedNodeZIndex: zIndex
        }));
        node.node.style.zIndex = this.state.maxZIndex;
    }

    focus(e) {
        const node = e.currentTarget;
        if (this.state.prevDraggedNode) {
            const prevNode = this.state.prevDraggedNode;
            prevNode.style.zIndex = "999";
        }
        const zIndex = node.style.zIndex;
        this.setState(prevState => ({
            prevDraggedNode: node,
            prevDraggedNodeZIndex: zIndex
        }));
        node.style.zIndex = this.state.maxZIndex;
    }

    render() {
        const dialogs = this.props.dialogs.map((elt, i) =>
            <Dialog key={elt.id}
                    onClick={this.focus}
                    title={elt.title}
                    onClose={()=>this.props.onDialogClose(elt)}
                    onConfirm={()=> this.props.onConfirm(elt)}
                    confirmButton={elt.confirmButton}>
                {this.props.children[i]}
                {/* <Note noteId={elt.noteId}/> */}
            </Dialog>
        );
        return <div>{dialogs}</div>
    }

}
export default DialogHandler;
