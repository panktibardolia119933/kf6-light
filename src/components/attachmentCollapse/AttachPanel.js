import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Form, ProgressBar} from 'react-bootstrap'
import { fetchAttachments } from '../../store/noteReducer.js'
import { FileDrop } from 'react-file-drop';
import './AttachPanel.css'

import api from '../../store/api.js'

//TODO if dropping files is not supported
const AttachPanel = props => {
    const author = useSelector(state => state.globals.author);
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);

    const  handleClose= (e) => {
        props.onClose();
    }
    const onFileChange = (e) => {
        onFileSelect(e.target.files);
        // TODO After upload, clear input
        /* e.target.value = null; */

    }
    const onFileSelect = (fileList) => {
        const files = Array.from(fileList)
        setProgress(0)
        /* const hasVideo = files.some((file) => file.type.indexOf('video') === 0); */
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
                    createAttachment(file, true);
                };
                img.src = _URL.createObjectURL(file);
            }else{
                createAttachment(file, false)
            }
        });
    }

    const createAttachment = async (file, isImage) => {
        try {
            const attachRes = await api.createAttachment(author.communityId, author._id)
            const uploadRes = await api.uploadFile(file, onUploadProgress)
            const attachment = attachRes.data
            const data = uploadRes.data
            attachment.title = data.filename;
            attachment.status = 'active';
            data.version = attachment.data.version + 1;
            attachment.data = data;
            attachment.tmpFilename = data.tmpFilename;
            const newObjRes = await api.modifyObject(attachment, author.communityId, attachment._id)
            const newAttachment = newObjRes.data

            newAttachment.data.width = file.width;
            newAttachment.data.height = file.height;


            await api.postLink(props.noteId, attachment._id, 'attach')
            //TODO updateFromConnections
            if (props.inlineAttach){
                const data_mce_src = 'http://localhost:8000'+newAttachment.data.url;
                const title = newAttachment.title;
                let html = '';
                if (isImage) {
                    html = '<img class="inline-attachment ' + attachment._id + '" src="' + data_mce_src +'" width="100px" alt="' + title + '" data-mce-src="' + data_mce_src + '">';
                } else {
                    html ='<a class="inline-attachment ' + attachment._id + '" href="' + data_mce_src + '" target="_blank" download>';
                    html += '<img src="http://localhost:8000/manual_assets/kf6images/03-toolbar-attachment.png" alt="' + title + '">' + title + '</a>';
                }
                props.onNewInlineAttach(html)
            } else {
                dispatch(fetchAttachments(props.noteId))
            }

            //TODO googledrive
            /* if(newAttachment.data.type.indexOf('video') === 0 && $community.isPluginEnabled('googledrive')){
             *     $scope.save2GoogleDrive(userName, newAttachment);
             * } */
        } catch (err) {
            console.log(err)
        } finally {

        }

    }

    const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percentCompleted)
    }

    const styles = { width: '100%', color: 'black' };
    return (
        <Modal show={props.attachPanel} onHide={handleClose}>
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
                <ProgressBar now={progress} />
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
