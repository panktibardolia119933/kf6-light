import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Axios from 'axios';

class NoteContent extends Component{

    constructor(props) {
        super(props);
        this.state={
            noteContent : [],
        };

        this.setState({
            noteContent : this.props.noteContnetList,
        })
        console.log("STATE NOTECONTENT", this.state.noteContent);
    }

    componentDidMount(){
        
        
    }

    render(){
        var noteList = this.props.noteContnetList;
        return(
            <>
            {noteList.map(
                (obj,i)=>{
                    return<>
                        <div className="primary-bg-200 min-height-2 mrg-05">
                        <span className="pd-1" dangerouslySetInnerHTML={{ __html: obj.title }} />    
                        <span className="pd-1" dangerouslySetInnerHTML={{ __html: obj.data.body }} />
                        </div>

                    </>
                }
            )}
            </>
        )
    }

}
export default NoteContent;