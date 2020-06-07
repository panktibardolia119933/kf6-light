import React, { Component } from 'react';
import { Button, Row, Col,} from 'react-bootstrap';
import ReactDOM from "react-dom";
import Axios from 'axios';

class NoteContent extends Component{
    noteList = [];
    constructor(props) {
        super(props);
        this.state={
            noteContent : [],
        };

        // this.setState({
        //     noteContent : this.props.noteContnetList,
        // })
        // console.log("STATE NOTECONTENT", this.state.noteContent);
        this.noteList = this.props.noteContnetList;
        
    }

    componentDidMount(){
        this.setState({
            noteContent : this.props.noteContnetList,
        })
        
    }

    removeNote(id){
        console.log("Remove id", id);
        this.noteList.filter(obj => obj._id.includes(id),).map(removeObj => {
            var index = this.noteList.indexOf(removeObj);
            delete this.noteList[index];
        })
        this.setState({
            noteContent : this.noteList,
        })
        
        
    }

    render(){
        // var noteList = this.props.noteContnetList;
        console.log("this.props.noteContnetList", this.noteList);
        
        return(
            <>
            {this.state.noteContent.map(
                (obj,i)=>{
                    return<>
                        <Row className="min-height-2 mrg-05 border rounded mrg-1-bot pd-1" key={i}>
                            <Col>
                                <Row>
                                    <Col md="11" className="pd-1 primary-800 font-weight-bold">{obj.title }</Col>
                                    <Col md="1"><Button variant="secondary" onClick={()=>this.removeNote(obj._id)}>X</Button></Col>
                                </Row>
                                <Row><span className="pd-1" dangerouslySetInnerHTML={{ __html: obj.data.English }} /></Row>
                            </Col>
                        </Row>

                    </>
                }
            )}
            </>
        )
    }

}
export default NoteContent;