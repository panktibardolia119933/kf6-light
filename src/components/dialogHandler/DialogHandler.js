import React from 'react';
import Dialog from '../dialog/Dialog.js';

class DialogHandler extends React.Component {

    render() {
        const dialogs = this.props.dialogs.map((elt, i) =>
            <Dialog key={elt.id}
                    onMouseDown={() => this.props.onFocus(elt.id)}
                    title={elt.title}
                    style={{zIndex: elt.zIndex}}
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
