import React, { Component } from 'react';
import { DropdownButton, Dropdown, Button, Container, Row, Col } from 'react-bootstrap';
import Axios from 'axios';

class View extends Component {

    myRegistrations= [];
    showView= false;

    constructor() {
        super();

        this.state={
            communitites: [],
            views: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

         //GET LIST OF ALL VIEWS
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

    logout(){
        sessionStorage.removeItem('token');
    }

    newContribution(){
        console.log("New Contribution onclick works");
    }

    newCommunity(){
        console.log("New Contribution onclick works");
        var token= sessionStorage.getItem('token');
        //SET HEADER WITH TOKEN BEARER
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        //GET USER'S REGISTERED COMMUNITIES
        Axios.get('https://kf6-stage.rit.albany.edu/api/users/myRegistrations', config)
        .then(
            result=>{
                this.myRegistrations= result.data; 
            }).catch(
                error=>{
                    alert(error);
                }
            );
    }

    newView(){
        console.log("New View onclick works");
        var token= sessionStorage.getItem('token');
        var myCommunityId= window.location.href.split('/').pop();

        //SET HEADER WITH TOKEN BEARER
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        //GET USER'S VIEWS
        var viewUrl= "https://kf6-stage.rit.albany.edu/api/communities/"+myCommunityId+"/views";
        Axios.get(viewUrl, config)
        .then(
            result=>{
                this.myRegistrations= result.data; 
            }).catch(
                error=>{
                    alert(error);
                }
            );
        
    }

    handleCloseView(){
        this.showView= false;
    }

    render() {
        return (
            <div> Helllo {this.myCommunityId}
                <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-plus-circle"></i>}>
                    <Dropdown.Item onClick={this.newContribution}>New Note</Dropdown.Item>
                    <Dropdown.Item onClick={this.newView}>New View</Dropdown.Item>
                    <Dropdown.Item onClick={this.newCommunity}>New Community</Dropdown.Item>
                </DropdownButton>

                {/* <Modal show={this.showView} onHide={this.handleCloseView}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseView}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleCloseView}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal> */}
                
                {/* <Container className="mrg-2-top">
                    <h6>My Knowledge Building Communities</h6>
                    {this.myRegistrations.map((obj) => {
                        return <Row key={obj.id} value={obj.communityId} className="mrg-05-top">
                            <Col>Title {obj._community.title}</Col>
                            <Col><Button variant="outline-secondary" onClick={()=>this.enterCommunity({obj})}>Enter Community</Button></Col>
                        </Row>
                    })}
                </Container> */}

            </div>
        );
    }
}

export default View;