import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import { DropdownButton, Dropdown, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import Axios from 'axios';

class View extends Component {

    myRegistrations= [];
    myViews = []; 
    myCommunityId = '';
    show= false;   
    
    //TOKEN
    token = sessionStorage.getItem('token');


    constructor(props) {
        super(props);
        // GET communityId AND welcomeId IN myState
        // this.myState= this.props.location.state;
        
        //COMMUNITY-ID
        // this.myCommunityId = this.myState.communityId;

        this.state={
            communitites: [],
            myCommunities: [],
            views: [],
            communityId: sessionStorage.getItem('communityId'),
            viewId: sessionStorage.getItem('viewId'),
            viewLinks : [],
            showView: false,
            showCommunity: false,
            showContribution: false,
            showNote: false,
            hNotes: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    
    componentDidMount(){

        this.setState(this.props.location.state);
        // console.log("state",this.state);
        

        //GET LIST OF ALL COMMUNITIES
        Axios.get('https://kf6-stage.ikit.org/api/communities')
        .then(
            result=>{
                this.setState({
                    communitites: result.data
                 })
            }).catch(
                error=>{
                    console.log("GET Communities Failed");
                    alert("GET Communities Failed");
                }
            );
            
            //SET HEADER WITH TOKEN BEARER
            var config = {
                headers: { Authorization: `Bearer ${this.token}` }
            };

            //GET USER'S VIEWS
            var viewUrl= "https://kf6-stage.ikit.org/api/communities/"+this.state.communityId+"/views";
            Axios.get(viewUrl, config)
            .then(
                result=>{
                    this.setState({
                        myViews: result.data
                     })
                    
                }).catch(
                    error=>{
                        alert(error);
                    });  
                    

            //GET USER'S REGISTERED COMMUNITIES
            Axios.get('https://kf6-stage.ikit.org/api/users/myRegistrations', config)
            .then(
                result=>{
                    this.setState({
                        myCommunities: result.data
                     })
                }).catch(
                    error=>{
                        alert(error);
                    }
                );


            var viewNotesUrl= "https://kf6-stage.ikit.org/api/links/from/" + sessionStorage.getItem('viewId');
            var links;
            // GET NOTES ID IN VIEW
            Axios.get(viewNotesUrl, config)
            .then(
                result=>{
                    links = result.data;
                    // console.log("NOTES",links);

                    this.setState({
                        viewLinks: links,
                    })

                    for(var i in links){
                        console.log("Link title",links[i].to, links[i]._to.title);                        
                        var noteUrl="https://kf6-stage.ikit.org/api/objects/"+ links[i].to;

                        Axios.get("https://kf6-stage.ikit.org/api/objects/5d694a0db26356e3f2dbf6f2", config)
                        .then(
                            result=>{
                                // console.log("SingleNote",result.data);                                
                            }).catch(
                                error=>{
                                    // alert(error);
                            });
                    }
        
                }).catch(
            error=>{
                alert(error);
            });

            
            //GET SEARCH - HIRARCHICAL NOTES
            var searchUrl = "https://kf6-stage.ikit.org/api/links/" + this.state.communityId + "/search";
            let query = {"query": {"type": "supports"}};
            Axios.post(searchUrl, query, config)
            .then(
                result=>{
                    console.log("SEARCH", result.data);
                    this.setState({
                        hNotes: result.data,
                    })                    
                }).catch(
                    error=>{
                        alert(error);
                })


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
        this.setState({
            showContribution: true,
            showCommunity: false,
            showView: false,
        })
    }

    newNote(){
        console.log("New Note onclick works");
        this.setState({
            showCommunity: true,
            showView: false,
            showContribution : false,
        })
    }

    newView(){
        console.log("New View onclick works"); 
        this.setState({
            showView: true,
            showCommunity: false,
            showContribution : false,
        })        
    }
    
    //HANDLE MODEL
    handleShow(value){
        this.setState({
            showNote: value,
        });
        
    }

    changeView(viewObj){
        console.log("viewId",viewObj.obj._id);
        this.setState({
            viewId: viewObj.obj._id,
        })
        sessionStorage.setItem("viewId", viewObj.obj._id);
        sessionStorage.setItem("viewTitle", viewObj.obj.title);
        this.handleShow(false);
        window.location.reload();
        
    }

    render() {
        return (
            <div> 
                <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-plus-circle"></i>}>
                    <Dropdown.Item onClick={()=>this.newContribution()}>
                        <Link onClick={()=>this.handleShow(true)}>
                            Contributions
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.newView()}>
                        <Link onClick={()=>this.handleShow(true)}>
                            Views
                        </Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={()=>this.newNote()}>
                        <Link onClick={()=>this.handleShow(true)}>
                            New Note
                        </Link>
                    </Dropdown.Item>
                </DropdownButton>
                
                {/* {this.state.showCommunity ?(
                    <Container className="mrg-2-top">
                        <h6>MY Registered Communities</h6>
                        {this.state.myCommunities.map((obj) => {
                        return <Row key={obj.id} value={obj.title} className="mrg-05-top">
                            <Col>Title {obj._community.title}</Col>
                        </Row>
                        })}
                        <h6>communitites</h6>
                        {this.state.communitites.map((obj) => {
                            return <Row key={obj.id} value={obj.title} className="mrg-05-top">
                                <Col>Title {obj.title}</Col>
                            </Row>
                        })}
                    </Container>
                    )
                    :null

                } */}

                {/* {this.state.showView ?(
                    <Container className="mrg-2-top">
                        <h6>MY Views</h6>
                        {this.state.myViews.map((obj) => {
                        return <Row key={obj.id} value={obj.title} className="mrg-05-top">
                            <Col> {obj.title} </Col>
                        </Row>
                        })}
                    </Container>
                    )
                    :null
                } */}

                {/* <Container className="mrg-2-top">
                    <h6>My Knowledge Building Communities</h6>
                    {this.communityData.map((obj) => {
                        return <Row key={obj.id} value={obj.communityId} className="mrg-05-top">
                            <Col>Title {obj}</Col>
                        </Row>
                    })}
                </Container> */}


                {/* MODEL */}
                <Modal show={this.state.showNote} onHide={()=>this.handleShow(false)}>
                    {this.state.showContribution ?(
                    <>
                        <Modal.Header closeButton>
                        <Modal.Title>Contributions</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{'max-height': 'calc(100vh - 300px)', 'overflow-y': 'auto'}}>
                            {this.state.hNotes.map((obj) => {
                                return <Row key={obj._to.title} value={obj.to} className="mrg-05-top">
                                    <Col className="mr-auto">
                                        <Row className="indigo"> {obj._to.title}</Row>
                                        <Row> {obj.to}</Row>
                                        <Row className="pd-2-left blue"> {obj._from.title}</Row>
                                        <Row className="pd-2-left"> {obj.from}</Row>
                                        <hr/>
                                    </Col>
                                </Row>
                            })}                            
                            {this.state.viewLinks.map((obj) => {
                            return <Row key={obj._to.title} value={obj.to} className="mrg-05-top">
                                <Col>
                                    <Row className="indigo"> {obj._to.title}</Row>
                                    <Row> {obj.to}</Row>
                                    <hr/>
                                </Col>
                            </Row>
                            })}
                        </Modal.Body>
                    </>) : null }

                    {this.state.showView ?(
                    <>
                        <Modal.Header closeButton>
                        <Modal.Title>Views</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                            {this.state.myViews.map((obj) => {
                            return <Row key={obj.id} value={obj.title} className="mrg-05-top">
                                <Col><Link onClick={()=>this.changeView({obj})}> {obj.title} </Link></Col>
                            </Row>
                            })}
                        </Modal.Body>
                    </>) : null }

                    <Modal.Footer>
                    <Button variant="secondary" onClick={()=>this.handleShow(false)}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
                
            </div>
        );
    }
}

export default View;