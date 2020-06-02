import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form, ProgressBar} from 'react-bootstrap'
import {closeAttachPanel} from '../../store/dialogReducer.js'
import { FileDrop } from 'react-file-drop';
import './AttachPanel.css'

import api from '../../store/api.js'

//TODO if dropping files is not supported
const AttachPanel = props => {
    const attachment = useSelector(state => state.dialogs.attachPanel);
    const viewId = useSelector(state => state.globals.viewId);
    const author = useSelector(state => state.globals.author);
    const dispatch = useDispatch();

    const  handleClose= (e) => {
        dispatch(closeAttachPanel())
    }
    const onFileChange = (e) => {
        onFileSelect(e.target.files);
        //After upload, clear input
        /* e.target.value = null; */

    }
    const onFileSelect = (fileList) => {
        console.log(fileList)
        const files = Array.from(fileList)
        const hasVideo = files.some((file) => file.type.indexOf('video') === 0);
        console.log('has video:' + hasVideo)
        console.log(viewId)
        // TODO googleOauth, googledrive

        files.forEach((file) => {
            if (file.type.indexOf("image/") >= 0){
                const _URL = window.URL || window.webkitURL;
                const img = document.createElement("img");
                img.onload = function() {
                    var width  = img.naturalWidth  || img.width;
                    var height = img.naturalHeight || img.height;
                    file.width = width;
                    file.height = height;
                    createAttachment(file);
                };
                img.src = _URL.createObjectURL(file);
            }else{
                createAttachment(file)
            }
        });
    }

    const createAttachment = async (file) => {
        const attachRes = await api.createAttachment(author.communityId, author._id)
        const uploadRes = await api.uploadFile(file, onUploadProgress)
        console.log(uploadRes.data)
        const attachment = attachRes.data
        const data = uploadRes.data
        attachment.title = data.filename;
        attachment.status = 'active';
        data.version = attachment.data.version + 1;
        attachment.data = data;
        attachment.tmpFilename = data.tmpFilename;
        const newObjRes = await api.modifyObject(attachment, author.communityId)
        const newAttachment = newObjRes.data

        newAttachment.data.width = file.width;
        newAttachment.data.height = file.height;


    }

    const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(percentCompleted)
    }

    const styles = { width: '100%', color: 'black' };
    return (
        <Modal show={attachment.noteId !== undefined} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Insert Attachment File</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.File id="custom-file">
                    <Form.File.Input onChange={onFileChange}/>
                </Form.File>
                <div style={styles}>
                    <FileDrop
                        onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
                        onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
                        onFrameDrop={(event) => console.log('onFrameDrop', event)}
                        onDragOver={(event) => console.log('onDragOver', event)}
                        onDragLeave={(event) => console.log('onDragLeave', event)}
                        onDrop={(files, event) => onFileSelect(files)}
                    >
                        or drop some files here!
                    </FileDrop>
                </div>
                <ProgressBar now={60} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )

};

export default AttachPanel;
