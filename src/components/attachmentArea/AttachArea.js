import React, {useState} from 'react';
import {useSelector} from 'react-redux'
import { Row, Col, Button} from 'react-bootstrap'
import './attachArea.css'

const AttachArea = props => {

    const attachments = useSelector(state => {
        return props.attachments.map((attId) => state.notes.attachments[attId])
    })
    const [selectedImgs, setSelectedImgs] = useState([])
    const getFileNameString = (name) => {
       return name
    }

    const getFileSizeString = (size) => {
        return size
    }

    const addImages = () => {
        console.log("Add images")
        const  selectedImgs = Array.from(document.getElementById(`attachbox-${props.noteId}`).getElementsByClassName("selected"))
        if (selectedImgs.length === 0) {
            return;
        }
        let html = "";
        const maxWidth = 200;
        console.log(selectedImgs)
        selectedImgs.forEach((img) => {
            const tagName = img.tagName;
            let width = img.naturalWidth;
            if(width > maxWidth){
                width = maxWidth;
            }
            if (tagName === 'IMG') {
                const data_mce_src = img.getAttribute("src");
                let className = '';
                img.classList.forEach(cls_name => {
                    if (cls_name.length === 24) { //Find 24 char long classes, one of them might be MongoDB id
                        className += cls_name + ' ';
                    }
                })
                html += '<img class="inline-attachment ' + className + '" src="' + data_mce_src + '" width="' + width + 'px" alt="" data-mce-src="' + data_mce_src + '">';
            }

        })
        props.onNewInlineAttach(html)

    }
    const selectedImg = (attId, e) => {
        if (selectedImgs.includes(attId)){
            setSelectedImgs((imgs) => imgs.filter( img => img !== attId))
        }else{
            setSelectedImgs((imgs) => [...imgs, attId])
        }
    }
    const deleteAttachment = () => {}
    return (
        <Col>
            <Row>
                <Col>
                    <span className=''>Insert image or file: </span>
                    <Button size='sm' variant='outline-dark' className='mx-2' onClick={()=> props.onNewAttachClick(true)}>Inline</Button>
                    <Button size='sm' variant='outline-dark' className='mx-2' onClick={()=>props.onNewAttachClick(false)}>As an attachment</Button>
                    <Button size='sm' className='mx-2' variant='outline-dark' onClick={addImages} disabled={selectedImgs.length === 0}>Insert</Button>
                </Col>
            </Row>
            <Row id={`attachbox-${props.noteId}`} className='attachment-box'>
                {
                    attachments.map((attachment) => (
                            <div key={attachment._id} className="attachment-inner-box col-auto">
                                <div className="attachment-thumbnail">
                                    {
                                        attachment.data.type.indexOf('image/') === 0 ?
                                        <img className={attachment._id + " " + (selectedImgs.includes(attachment._id) ? 'selected' : '')} src={'http://localhost:8000' + attachment.data.url} onClick={(e) => selectedImg(attachment._id, e)} alt='attachment'/>
                                        :
                                        <a href={'http://localhost:8000' + (attachment.data.downloadUrl || attachment.data.url)} title={attachment.title} download>
                                            <img className={attachment._id} src="http://localhost:8000/manual_assets/kf6images/03-toolbar-attachment.png"
                                                 title="{attachment.title}" alt='attachment' />
                                        </a>
                                    }
                                </div>
                                <div className="attachment-buttons">
                                    <p>
                                        <a href={'http://localhost:8000' + (attachment.data.downloadUrl || attachment.data.url)}
                                           title={attachment.title} download>
                                            <img className="download-attachment" src="http://localhost:8000/manual_assets/kf6images/cloud-download-2x.png"
                                                 alt="Download" height="15px" />
                                        </a>
                                    </p>
                                    <p>
                                        <button className="delete-attachment" onClick={deleteAttachment}>
                                            <img src="http://localhost:8000/manual_assets/kf6images/trash.png" alt='Delete attachment' width="10px" height="15px"/>
                                        </button>
                                    </p>
                                </div>
                                <div className="attachment-info">
                                    <p title="{attachment.title}">{getFileNameString(attachment.title)}</p>
                                    <p>{getFileSizeString(attachment.data.size)}</p>
                                </div>
                            </div>
                ))
                }
            </Row>
        </Col>
    )

};

export default AttachArea;
