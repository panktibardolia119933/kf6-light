import React from 'react';
import {Rnd} from 'react-rnd';
import {Card, Button} from 'react-bootstrap';
import './dialog.css';
const dialog_style = {
    zIndex: 999,
    display: 'flex'
}

const Dialog = props => {
    return (
            <Rnd
                className={"contrib-dialog"}
                style={dialog_style}
                default={{
                    x: 0,
                    y: 0,
                    width: 920,
                    height: 500,
                }}
                onClick={props.onClick}
                dragHandleClassName='dlg-card-header'
                bounds='window'
            >
                <Card className='dlg-card'>
                    <Card.Header className='dlg-card-header'><span>{props.title}</span>
                        <Button onClick={props.onClose} variant='link' size='sm' style={{float:'right'}}>x</Button>
                    </Card.Header>
                    <Card.Body className='dlg-card-body' style={{overflow: 'scroll'}}>
                        {props.children}
                    </Card.Body>
                    <Card.Footer className="dlg-card-footer">
                        <Button size='sm' className="dlg-confirm-button"
                            onClick={props.onConfirm}
                        >
                            {props.confirmButton}
                        </Button>
                    </Card.Footer>
                </Card>
            </Rnd>
    )
}

export default Dialog;
