import React, { Component } from 'react';
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

    constructor() {
        super();

        this.state={
            communitites: [],
            password: '',
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

        console.log('The form was submitted with:');
        console.log(this.state.communitySelect);
    }

    componentDidMount(){
        //GET LIST OF ALL COMMUNITIES
        Axios.get('https://kf6-stage.rit.albany.edu/api/communities')
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
            Axios.get('https://kf6-stage.rit.albany.edu/api/users/myRegistrations', this.config)
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
        var viewUrl= "/view/"+ id;
        this.props.history.push(viewUrl,{id: id});

        // history.push({
        //     pathname: '/secondpage',
        //     search: '?query=abc',
        //     state: { detail: 'some_value' }
        // });

    }

    render() {
        return (
            <Container>
                <div className="mrg-4-top">
                <Form onSubmit={this.handleSubmit}>
                    <Col>
                    <FormGroup>
                    <Label>Select Community</Label>
                        <Input type="select" name="communitySelect" id="communitySelect"  onChange={this.handleChange}>{
                            this.state.communitites.map((obj) => {
                                return <option key={obj._id} value={obj.title}>{obj.title}</option>
                            })
                        }</Input>
                    </FormGroup>
                    </Col>
                    <Col>
                        <Button variant="secondary">Submit</Button>
                    </Col>
                </Form>
                <Container className="mrg-2-top">
                    <h6>My Knowledge Building Communities</h6>
                    {this.myRegistrations.map((obj) => {
                        return <Row key={obj.id} value={obj.communityId} className="mrg-05-top">
                            <Col>{obj._community.title}</Col>
                            <Col><Button variant="outline-secondary" onClick={()=>this.enterCommunity({obj})}>Enter Community</Button></Col>
                        </Row>
                    })}
                </Container>
               
              </div>
            </Container>);
    }
}

export default CommunityManager;