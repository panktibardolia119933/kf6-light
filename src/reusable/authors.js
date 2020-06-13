import React, { Component } from 'react';
import { Button, Row, Col,} from 'react-bootstrap';
import ReactDOM from "react-dom";
import Axios from 'axios';

class Authors extends Component{
    token = sessionStorage.getItem('token');
    constructor(props) {
        super(props);
        this.state={
            communityId: sessionStorage.getItem('communityId'),
            authors: [],
            authorName:"",
        }
        
    }

    componentDidMount(){
        var config = {
            headers: { Authorization: `Bearer ${this.token}` }
        }; 

        //GET AUTHORS
        var authorUrl = "https://kf6-stage.ikit.org/api/communities/"+this.state.communityId+"/authors";
        Axios.get(authorUrl, config)
        .then(
            result=>{
                this.setState({
                    authors : result.data,
                });

                this.state.authors.filter(obj => obj._id.includes(this.props.authorId)).map(filteredObj => {
                    this.setState({
                        authorName: filteredObj.firstName + " "+ filteredObj.lastName,
                    });
                });

            }).catch(
                error=>{
                    alert(error);
                });

    }

    render(){
        return(
            <>
            <span> {this.state.authorName}</span>
            </>
        )
    }

}
export default Authors;