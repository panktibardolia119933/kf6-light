import React, { Component } from 'react';
import { Redirect, useHistory } from "react-router-dom";
import Axios from 'axios';
import {Container, Col, Row, Form, FormGroup, Label, Input} from 'reactstrap';
import { Button } from 'react-bootstrap';   

class CommunityManager extends Component {

    token= sessionStorage.getItem('token');
    myRegistrations= [];

    //SET HEADER WITH TOKEN BEARER
    config = {
        headers: { Authorization: `Bearer ${this.token}` }
    };

    constructor(props) {
        super(props);

        this.state={
            communitites: [],
            password: '',
            communityId: '',
            welcomeId: '',
            userId: sessionStorage.getItem("userId"),
            token: sessionStorage.getItem("token"),
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }    

    handleChange = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;
        console.log(name,value);
        

        this.setState({
            [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("FORM",this.state);
        
        //REGISTER NEW COMMUNITY TO AUTHOR
        var registerUrl= "https://kf6-stage.ikit.org/api/authors";
        var data= {"communityId": this.state.communityId, "registrationKey": this.state.password, "userId":this.state.userId};
        var config = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        };

        Axios.post(registerUrl, data, config)
            .then(
                result=>{
                    console.log("AUTHOR", result.data);
                    window.location.reload();                   
                }).catch(
                    error=>{
                        // alert(error);
                })
        
    }

    componentDidMount(){
        //GET LIST OF ALL COMMUNITIES
        Axios.get('https://kf6-stage.ikit.org/api/communities')
        .then(
            result=>{
                this.communityData= result.data;
                console.log(this.communityData);
                this.setState({
                    communitites: result.data
                 })
            }).catch(
                error=>{
                    console.log("GET Communities Failed");
                    alert("GET Communities Failed");
                }
            );

            //GET USER'S REGISTERED COMMUNITIES
            Axios.get('https://kf6-stage.ikit.org/api/users/myRegistrations', this.config)
            .then(
                result=>{
                    this.myRegistrations= result.data; 
                }).catch(
                    error=>{
                        alert(error);
                    }
                );
    }

    enterCommunity(myCommunity){
        var id= myCommunity.obj.communityId;
        sessionStorage.setItem('communityId',myCommunity.obj.communityId)
        let myState={
            communityId:id,
            welcomeId:''
        } 

        //SET HEADER WITH TOKEN BEARER
        var config = {
            headers: { Authorization: `Bearer ${this.token}` }
        };

        //GET USER'S VIEWS
        var viewUrl= "https://kf6-stage.ikit.org/api/communities/"+id+"/views";
        console.log(viewUrl);
        
        Axios.get(viewUrl, config)
        .then(
            result=>{
                // viewId= result.data[0]._id;
                myState.welcomeId= result.data[0]._id;
                sessionStorage.setItem('viewId',result.data[0]._id);
            }).catch(
                error=>{
                    alert(error);
                });
        
        this.props.history.push({pathname: "/view", state: myState});
    }

    render() {
        return (
            <Container>
                <div className="mrg-4-top">
                
                <Container className="mrg-2-top">
                    <h6>My Knowledge Building Communities</h6>
                    {this.myRegistrations.map((obj) => {
                        return <Row key={obj.id} value={obj.communityId} className="mrg-05-top">
                            <Col>{obj._community.title}</Col>
                            <Col><Button variant="outline-secondary" onClick={()=>this.enterCommunity({obj})}>Enter Community</Button></Col>
                        </Row>
                    })}
                </Container>

                <Form onSubmit={this.handleSubmit} className="form">
                    <Col>
                    <FormGroup>
                    <Label>Register Community</Label>
                        <Input type="select" name="communityId" id="communityId" value={this.state.communityId}  onChange={this.handleChange}>{
                            this.state.communitites.map((obj) => {
                                return <option key={obj._id} value={obj._id}>{obj.title}</option>
                            })
                        }</Input>
                    </FormGroup>
                    <FormGroup>
                    <Label>Registration Key</Label>
                        <Input type="password" name="password" placeholder="Enter Registration Key" id="password" value={this.state.password} onChange={this.handleChange}/>
                    </FormGroup>
                    </Col>
                    <Col>
                        <Button variant="secondary" onClick={this.handleSubmit}>Submit</Button>
                    </Col>
                </Form>
               
              </div>
            </Container>);
    }
}

export default CommunityManager;