import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import { DropdownButton, Dropdown, Button, Container, Row, Col, Modal, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import Axios from 'axios';
import Toolbar from '../reusable/toolbar';
import './view.css';

class View extends Component {

    myRegistrations= [];
    myViews = []; 
    myCommunityId = '';
    show= false; 
    from = [];
    to = [];  
    
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
            addView: '',
            showRiseAbove : false,
            showModel : false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSubmitView = this.handleSubmitView.bind(this);
        this.handleChangeView = this.handleChangeView.bind(this);

        
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
                    for(var j in links){
                        if(links[j]._to.type==="Note"){
                            console.log(links[j]._to.title);
                            
                        }
                    }
                    //NOTE LINKS
                    this.setState({
                        viewLinks: links,   
                    })

                    var noteData=[];

                    for(var i in links){
                        // console.log("Link title",links[i].to, links[i]._to.title);                        
                        var noteUrl="https://kf6-stage.ikit.org/api/objects/"+ links[i].to;
                        
                        Axios.get(noteUrl, config)
                        .then(
                            result=>{
                                noteData.push(result.data);
                            }).catch(
                                error=>{
                                    // alert(error);
                            });
                    }
                    console.log("NOTEDATA",noteData);
                    
        
                }).catch(
            error=>{
                alert(error);
            });

            
            //GET SEARCH - HIRARCHICAL NOTES
            var searchUrl = "https://kf6-stage.ikit.org/api/links/" + this.state.communityId + "/search";
            let query = {"query": {"type": "buildson"}};
            var h=[];
            // var from=[], to=[];
            Axios.post(searchUrl, query, config)
            .then(
                result=>{
                    this.setState({
                        hNotes: result.data,
                    })
                    for(var i in result.data){
                        this.from.push(result.data[i].from);
                        this.to.push(result.data[i].to);
                    }
                    
                    //Add into tos list
                    for(var j in this.to){
                        for(var k in this.from){
                            if (this.from[k]=== this.to[j]){
                                var tempTo= [this.to[j],this.to[k]];
                                var temp={"from": this.from[j],"to":tempTo};
                                h.push(temp);
                            }
                        }
                    }
                    console.log("This.state hNotes",this.state.hNotes);
                    console.log("HIERARCHI",h);


                    for(var l in this.from){
                        var tempTo2=[];
                        tempTo2.push(this.to[l]);
                        console.log("YES YES");
                        
                        if(this.from.includes(this.to[l])){
                            console.log("Inside 1st IF", this.to[l]);
                            
                            var fromIndex = this.from.findIndex(this.to[l]);
                            console.log("fromIndex", fromIndex);
                            this.addTo(fromIndex, tempTo2, l);
                        }
                        else{
                            console.log("MY MEHNAT 1st Else:", this.from, this.to);
                        }
                    }

                    // for(var l in to){
                    //     if(from.includes(to[l])){
                    //         var index= from.findIndex(to[l]);
                    //         var tempTo= [to[l],to[index]];
                    //         to[l] = tempTo
                    //         delete from[index];
                    //     }
                    //     if(from.includes(to[index])){
                    //         var fromIndex = from.findIndex(to[index]);
                    //         addTO(fromIndex, tempTo);
                    //     }
                    // }

                    // for(var l in from){
                    //     var tempTo;
                    //     tempTo.push(to[l]);
                    //     if(from.includes(to[l])){
                    //         var fromIndex = from.findIndex(to[l]);
                    //         addTO(fromIndex, tempTo);
                    //     }
                    //     addTo(fromIndex, tempTo){
                    //         tempTo.push(to[fromIndex]);
                    //         to[l]= tempTo;
                    //         delete from[fromIndex];
                    //         if(from.includes(to[fromIndex])){
                    //             fromIndex = from.findIndex(to[fromIndex]);
                    //             addTo(fromIndex, tempTo)
                    //         }
                    //     }
                    // }
                    
                    
                                        
                }).catch(
                    error=>{
                        alert(error);
                })

                

                
                

            //GET AUTHOR DETAILS
            var meAuthorUrl= "https://kf6-stage.ikit.org/api/authors/"+this.state.communityId+"/me";
            // Axios.get  


    }

    addTo(fromIndex, tempTo, l){
        tempTo.push(this.to[fromIndex]);
        this.to[l]= tempTo;
        console.log("2nd IF to[l]",this.to[l]);
        
        delete this.from[fromIndex];
        if(this.from.includes(this.to[fromIndex])){
            fromIndex = this.from.findIndex(this.to[fromIndex]);
            this.addTo(fromIndex, tempTo)
        }
        else{
            console.log("MY MEHNAT 2nd Else:", this.from, this.to);
        }
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
        console.log('ADD view:',this.state.addView);
    }

    handleChangeView = (e) => {
        let target = e.target;
        let name = target.name;
        let value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmitView(e) {
        e.preventDefault();
        var config = {
            headers: { Authorization: `Bearer ${this.token}` }
        };        
        
        var addViewUrl = "https://kf6-stage.ikit.org/api/contributions/"+this.state.communityId;
        
        var query= {"authors":[sessionStorage.getItem("userId")],
            "communityId":this.state.communityId, 
            "permission":"public",
            "status":"active",
            "title": this.state.addView,
            "type": "View"}
        Axios.post(addViewUrl,query,config)
            .then(
                result=>{
                    console.log("Successful",result);
                    
                }
            ).catch(
                error=>{
                    console.log(error);
                    
                }
            );
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
            showRiseAbove: false,
        })
    }

    newNote(){
        console.log("New Note onclick works");
        this.setState({
            showNote: true,
            showView: false,
            showRiseAbove : false,
        })
    }

    newView(){
        console.log("New View onclick works"); 
        this.setState({
            showView: true,
            showRiseAbove : false,
            showNote : false, 
        })
        // https://kf6-stage.ikit.org/api/contributions/56947546535c7c0709beee5c        
    }

    newRiseAbove(){
        console.log("New RiseAbove onclick works");
        this.setState({
            showView: false,
            showNote : false,
            showRiseAbove : true,
        }) 
    }
    
    //HANDLE MODEL
    handleShow(value){
        this.setState({
            showModel: value,
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
            <>
                
                    <div className="row container min-width">
                        {/* LEFT NAVBAR */}
                        <Col md="1" sm="12" className="pd-6-top">
                            
                            <Row className="mrg-025">
                                <Col md="12"sm="2" xs="2">
                                    <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-plus-circle"></i>}>
                                        
                                        <Dropdown.Item onClick={()=>this.newNote()}>
                                            <Link onClick={()=>this.handleShow(true)}>
                                                New Note
                                            </Link>
                                        </Dropdown.Item>

                                        <Dropdown.Item onClick={()=>this.newView()}>
                                            <Link onClick={()=>this.handleShow(true)}>
                                                new View
                                            </Link>
                                        </Dropdown.Item>
                                        
                                        <Dropdown.Item onClick={()=>this.newRiseAbove()}>
                                            <Link onClick={()=>this.handleShow(true)}>
                                                New RiseAbove
                                            </Link>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </Col>
                            
                            
                            {/* <Toolbar></Toolbar>*/}
                            <Col md="12"sm="2" xs="2">
                                <DropdownButton drop="right" variant="outline-info" title={<i className="fa fa-pencil"></i>}>
                    
                                </DropdownButton>
                            </Col>
                            <Col md="12"sm="2" xs="2">
                                <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-file"></i>}>
                    
                                </DropdownButton>
                            </Col>
                            <Col md="12"sm="2" xs="2">
                                <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-hammer"></i>}>
                    
                                </DropdownButton>
                            </Col>
                            
                            <Col md="12"sm="2" xs="2">
                                <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-edit"></i>}>
                    
                                </DropdownButton>
                            </Col>

                            </Row>
                        </Col> 
                 
                        
                        {/* NOTES */}
                        <Col md="11" sm="12" className="pd-8">                     
                            {this.state.hNotes.map((obj) => {
                            return <Row key={obj._to} value={obj.to} className="mrg-05-top border rounded">
                                <Col className="mr-auto">
                                    {obj._to.title?(<Row className="indigo"> {obj._to.title}</Row>):(<Row>Empty Title</Row>)}                                    
                                    <Row> Created On {obj._to.created}</Row>
                                    {obj._from.title?(<Row className="pd-2-left blue"> {obj._from.title}</Row>):(<Row className="pd-2-left blue"> Empty Title</Row>)}                                     
                                    <Row className="pd-2-left"> Created On {obj._from.created}</Row>
                                </Col>
                            </Row>
                            })}                            
                        {this.state.viewLinks.map((obj) => {
                            return <Row key={obj._to} value={obj.to} className="mrg-05-top">
                                <Col>
                                <Row className="indigo"> {obj._to.title}</Row>
                                <Row> {obj.to}</Row>
                                <hr/>
                                
                                </Col>
                            </Row>
                            })}
                        </Col>
                        
                    </div>
                        
                
            
            
            {/* MODEL */}
            <Modal show={this.state.showModel} onHide={()=>this.handleShow(false)}>
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
                        <Modal.Title>
                            <Row>
                            <Col>Views</Col>
                            </Row>
                            <Row>
                            <Col>
                                <Row>
                                <Form onSubmit={this.handleSubmitView} className="form">
                                    <Col>
                                    <FormGroup>
                                        <Label htmlFor="addView" style={{fontSize:"1rem"}}>Add View</Label>
                                        <Input type="text" id="addView" placeholder="Enter View Name" name="addView" value={this.state.addView} onChange={this.handleChangeView} />
                                    </FormGroup>
                                    </Col>
                                    <Col>
                                        <Button varient="secondary" onClick={this.handleSubmitView}>Add</Button>
                                    </Col>
                                </Form>
                                </Row>
                            </Col>
                            </Row>
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                            {this.state.myViews.map((obj) => {
                            return <Row key={obj.id} value={obj.title} className="mrg-05-top">
                                <Col><Link onClick={()=>this.changeView({obj})}> {obj.title} </Link></Col>
                            </Row>
                            })}
                        </Modal.Body>
                    </>) : null }

                    {this.state.showRiseAbove ?(
                    <>
                        <Modal.Header closeButton>
                        <Modal.Title>
                            <Row>
                            <Col>New RiseAbove</Col>
                            </Row>
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                            <Form onSubmit={this.handleSubmit}>
                                <Label htmlFor="riseAboveTitle" style={{fontSize:"1rem"}}>RiseAbove Title</Label>
                                <Input type="text" id="riseAboveTitle" placeholder="Enter RiseAbove Title" name="riseAboveTitle" value={this.state.riseAboveTitle} onChange={this.handleChange} />
                                
                                <Button className="mrg-1-top" onClick={this.handleSubmit}>Submit</Button>
                            </Form>
                        </Modal.Body>
                    </>) : null }

                    {this.state.showNote ?(
                    <>
                        <Modal.Header closeButton>
                        <Modal.Title>
                            <Row>
                            <Col>New Note</Col>
                            </Row>
                        </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                            New Note
                        </Modal.Body>
                    </>) : null }

                    <Modal.Footer>
                    <Button variant="secondary" onClick={()=>this.handleShow(false)}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
                
        </>
        );
    }
}

export default View;