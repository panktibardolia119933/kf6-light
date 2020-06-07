import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { DropdownButton, Dropdown, Button, Row, Col, Modal } from 'react-bootstrap';
import { Form, FormGroup, Label, Input} from 'reactstrap';
import Axios from 'axios';

import {closeDialog, closeDrawDialog } from '../store/dialogReducer.js'
import {newNote, removeNote, addDrawing} from '../store/noteReducer.js'
import { connect } from 'react-redux'
import DialogHandler from '../components/dialogHandler/DialogHandler.js'
import NoteContent from '../reusable/noteContent'

import './view.css';
class View extends Component {

    myRegistrations= [];
    myViews = []; 
    myCommunityId = '';
    show= false; 
    from = [];
    to = []; 
    myTempTo = [];
    hierarchyNote =[];
    noteData1 = [];
    noteContnetNew =[];
    
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
            sFrom : [],
            sTo : [],
            showNoteContent: false,
            noteContnetList : [],
            query:"",
            filteredData: [],
            filter:'title',

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSubmitView = this.handleSubmitView.bind(this);
        this.handleChangeView = this.handleChangeView.bind(this);
        this.onCloseDialog = this.onCloseDialog.bind(this);
        this.onConfirmDrawDialog = this.onConfirmDrawDialog.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        
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
            var links=[];
            // GET NOTES ID IN VIEW
            Axios.get(viewNotesUrl, config)
            .then(
                result=>{
                    for(var j in result.data){
                        if(result.data[j] && result.data[j]._to.type==="Note"){
                            links.push(result.data[j]);
                            
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
                    this.noteData1 = noteData;
                    
        
                }).catch(
            error=>{
                alert(error);                
            });

            
            //GET SEARCH - HIRARCHICAL NOTES
            var searchUrl = "https://kf6-stage.ikit.org/api/links/" + this.state.communityId + "/search";
            let query = {"query": {"type": "buildson"}};
            // var from=[], to=[];
            Axios.post(searchUrl, query, config)
            .then(
                result=>{
                    for(var i in result.data){
                        if(result.data[i]._from.type === "Note" && result.data[i]._to.type === "Note"){
                            this.from.push(result.data[i].from);
                            this.to.push(result.data[i].to);
                            this.hierarchyNote.push(result.data[i]);
                        }
                    
                    }
                    
                    // //Add into tos list
                    // for(var j in this.to){
                    //     for(var k in this.from){
                    //         if (this.from[k]=== this.to[j]){
                    //             var tempTo= [this.to[j],this.to[k]];
                    //             var temp={"from": this.from[j],"to":tempTo};
                    //             h.push(temp);
                    //         }
                    //     }
                    // }
                    // console.log("This.state hNotes",this.state.hNotes);
                    // console.log("HIERARCHI",h);
                    
                    try {
                        for(var l in this.to){
                            if(this.from.includes(this.to[l])){
                                var index= this.from.indexOf(this.to[l]);
                                var temporaryTo = [];
                                if(this.hierarchyNote[index]){
                                    temporaryTo.push(this.hierarchyNote[index]);
                                }
                                temporaryTo.push(this.hierarchyNote[l]);
                                this.hierarchyNote[l] = temporaryTo;
                                delete this.hierarchyNote[index];                                
                            }
                        }
                        
                    } catch (error) {
                        //Do nothing
                    }finally{
                        this.setState({
                            hNotes : this.hierarchyNote
                        })
                        console.log("HNOTES", this.state.hNotes);
                        
                    }

                    // try {
                    //     this.to.forEach(toElement => {
                    //         console.log("For");
                    //         while(this.from.includes(toElement)){
                    //             console.log("While");
                    //             var toIndex = this.to.indexOf(toElement);
                    //             var fromIndex = this.from.indexOf(toElement);
                    //             var tempArray = [];
                    //             tempArray.push(this.hierarchyNote[toIndex]);
                    //             tempArray.push(this.hierarchyNote[fromIndex])
                    //             this.hierarchyNote[toIndex] = tempArray;
                    //             delete this.hierarchyNote[fromIndex];
                    //             toElement = this.to[fromIndex];

                    //         }
                    //     }); 
                    // }
                    //  catch (error) {
                    //     //Do nothing
                    // }finally{
                    //     this.setState({
                    //         hNotes : this.hierarchyNote
                    //     })
                    //     console.log("HNOTES", this.state.hNotes);
                        
                    // }
                    

                    // if(this.arrangeFromTo()){
                    //     var fromData=[];
                    //     var toData = [];
                    //     this.setState({
                    //         sFrom: this.from,
                    //         sTo: this.to,
                    //     });

                    //     for(var m in this.from){
                    //         if(this.from[m]!=null){                       
                    //             var noteUrl="https://kf6-stage.ikit.org/api/objects/"+ this.from[m];
                                
                    //             Axios.get(noteUrl, config)
                    //             .then(
                    //                 result=>{
                    //                     fromData.push(result.data);
                    //                 }).catch(
                    //                     error=>{
                    //                         // alert(error);
                    //                 });
                    //         }
                            
                    //     }
                    //     for(var o in this.from){
                    //         if(this.from[o]!= null){
                    //             toData.push(this.to[o]);
                    //         }
                    //     }
                    //     console.log("fromData",fromData);
                    //     console.log("toData",toData);
                    // }

                    // AFTER ARRANGEFROM IS OVER
                    //CALL INDIVIDUAL INFO FOR NOTES

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

    arrangeFromTo(){
        for(var l in this.from){
            var tempTo2=[];
            tempTo2.push(this.to[l]);
            console.log("YES YES");
            
            if(this.from.includes(this.to[l])){
                var toL= this.to[l];
                console.log("Inside 1st IF", toL);
                
                var fromIndex = this.from.indexOf(toL);
                console.log("fromIndex", fromIndex);
                this.addTo(fromIndex, tempTo2, l);
            }
            else{
                console.log("MY MEHNAT 1st Else:", this.from, this.to);
            }
        }
        return 1;
    }

    addTo(fromIndex, tempTo, l){
        console.log("Inside addTo");
        
        tempTo.push(this.to[fromIndex]);
        this.to[l]= tempTo;
        console.log("2nd to[l]",this.to[l]);
        
        delete this.from[fromIndex];
        if(this.from.includes(this.to[fromIndex])){
            fromIndex = this.from.findIndex(this.to[fromIndex]);
            this.addTo(fromIndex, tempTo)
        }
        else{
            console.log("MY MEHNAT 2nd Else:", this.from, this.to);
        }
        return 0;
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

    handleShowNoteContent(value){
        this.setState({
            showView: false,
            showNote : false,
            showRiseAbove : false,
        });
        
    }

    showContent(id){
        this.setState({
            showNoteContent : true,
        })
        var myArray = this.noteData1;
        for(var i in myArray){
            if(myArray[i]._id && myArray[i]._id===id){
                this.noteContnetNew.push(myArray[i]);
                this.setState({
                    noteContnetList : this.noteContnetNew,
                })
                console.log("DATA DATA", this.noteContnetNew);
                
            }
        }        
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

    onConfirmDrawDialog(drawing){
        this.props.addDrawing(drawing);
        this.props.closeDrawDialog();
    }

    onCloseDialog(dlg){
        this.props.removeNote(dlg.noteId);
        this.props.closeDialog(dlg.id);
    }

    handleInputChange(event){
        this.setState({
            query : event.target.value,
        });

        var filteredResults=[];
        if(this.state.query){
            switch (this.state.filter) {
                case "title":
                    this.state.viewLinks.filter(obj => obj._to.title.includes(this.state.query)).map(filteredObj => {
                        filteredResults.push(filteredObj);
                    })
                    break;
                
                case "content":
                    console.log("CONTENT");
                    filteredResults = this.noteData1.filter(function (obj) {
                        if (obj.data && obj.data.English){
                            console.log("Print English", obj.data.English);  
                                                  
                            return obj.data.English.includes(event.target.value);
                        }
                    });
                    break;
            
                default:
                    break;
            }
        }
        
        

        this.setState({
            filteredData : filteredResults,
        })
        
    
        // this.setState(viewLinks => {
        //   const filteredData = viewLinks.data.filter(element => {
        //     return element.name.toLowerCase().includes(query.toLowerCase());
        //   });
    
        //   return {
        //     query,
        //     filteredData
        //   };
        // });
      };


      handleFilter = (e) => {
        let value = e.target.value;
        this.setState({
            filter: value,
        });
    }

    render() {

        return (
            <>
                <DialogHandler/>

                    <div className="row min-width">
                        {/* LEFT NAVBAR */}
                        <Col md="1" sm="12" className="pd-6-top">
                            
                            <Row className="mrg-025">
                                <Col md="12"sm="2" xs="2">
                                    <DropdownButton drop="right" variant="outline-info" title={<i className="fas fa-plus-circle"></i>}>
                                        
                                        <Dropdown.Item onClick={this.props.newNote}>
                                                New Note
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
                        <Col md="5" sm="12" className="mrg-6-top pd-2-right v-scroll">
                        <Form className="mrg-1-bot">
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                    <Input
                                        placeholder="Search Your Note"
                                        onChange={this.handleInputChange}
                                    />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Input type="select" name="filter" id="filter" onChange={this.handleFilter}>
                                            <option key="title" value="title">Search By Title</option>
                                            <option key="scaffold" value="scaffold">Search By Scaffold</option>
                                            <option key="content" value="content">Search By Content</option>
                                            <option key="author" value="author">Search By Author</option>
                                        })
                                    }</Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form> 
                        {this.state.query === ""? 
                        (<>
                            {this.state.hNotes.map((obj, i) => {
                            return <Row key={i} className="mrg-05-top">
                                <Col className="mr-auto primary-bg-200 rounded mrg-1-bot">
                                    {obj._to && obj._to.title && obj._to.created ?(<>
                                        <Row className="pd-05">
                                            <Link onClick={()=>this.showContent(obj.to)} className="primary-800 font-weight-bold">{obj._to.title}</Link>
                                        </Row>
                                        <Row className="primary-600 sz-075 pd-05"> Created On {obj._to.created}</Row>
                                        </>)
                                        :
                                        // (
                                        //     obj.map((subObj)=>{
                                        //         return <Row>
                                        //             <Col>
                                        //                 {subObj._to && subObj._to.title && subObj._to.created ?(<>
                                        //                 <Row className="indigo"> {subObj._to.title}</Row>
                                        //                 <Row> Created On {subObj._to.created}</Row></>):(<></>)}
                                        //             </Col>
                                        //         </Row>
                                                
                                        //     })
                                        // )
                                        (<>
                                            {obj[0]? 
                                            (<>
                                                <Row className="">
                                                <Col>
                                                    <Row>
                                                    {obj[0]._to && obj[0]._to.title && obj[0]._to.created ?
                                                    (<>
                                                        <Col>
                                                            <Row className="pd-05"><Link onClick={()=>this.showContent(obj[0].to)} className="primary-800 font-weight-bold"> {obj[0]._to.title}</Link></Row>
                                                            <Row className=" primary-600 sz-075 pd-05"> Created On {obj[0]._to.created}</Row>
                                                        </Col>
                                                    </>)
                                                    :
                                                    null}
                                                    </Row>
                                                
                                                {obj.map((subObj,j)=>{
                                                    return <Row key={j}>
                                                        <Col md="1">
                                                        </Col>
                                                        <Col>
                                                            {subObj._from && subObj._from.created ?(<>
                                                            <Row className="pd-05"><Link onClick={()=>this.showContent(subObj.from)} className="primary-800 font-weight-bold">{subObj._from.title}</Link></Row>
                                                            <Row className="primary-600 sz-075 pd-05"> Created On {subObj._from.created}</Row></>):(<></>)}
                                                        </Col>
                                                    </Row>
                                                            
                                                })}
                                                </Col>
                                                </Row>
                                            </>)
                                            :
                                            (<></>) }
                                        </>)}                                    
                                    
                                    {obj._from && obj._from.title && obj._to.created ? 
                                        (<>
                                            <Row>
                                            <Col md="1"></Col>
                                            <Col>
                                                <Row className="pd-05"> <Link onClick={()=>this.showContent(obj.from)} className="primary-800 font-weight-bold">{obj._from.title}</Link></Row>
                                                <Row className="primary-600 sz-075 pd-05"> Created On {obj._from.created}</Row>
                                            </Col>
                                            </Row>
                                        </>)
                                        :(<>
                                        </>)}                                     
                                    
                                </Col>
                            </Row>
                            }
                            
                            )}                            
                        {this.state.viewLinks.map((obj) => {
                            return <>
                            {obj && obj._to.title?    
                                (<>
                                <Row key={obj._to} value={obj.to} className="mrg-05-top">
                                    <Col className="primary-bg-200 rounded mrg-1-bot">
                                    <Row className="pd-05"><Link onClick={()=>this.showContent(obj.to)} className="primary-800 font-weight-bold"> {obj._to.title}</Link></Row>
                                    <Row className="primary-600 sz-075 pd-05"> Created On {obj.created}</Row>
                                    </Col>
                                </Row>
                                </>)
                                :(<></>)
                            }
                            
                            </>
                            })}
                        </>)
                        :(<>

                        {this.state.filteredData.map((obj) => {
                            return <>
                            {obj._to && obj._to.title?    
                                (<>
                                <Row key={obj._to} value={obj.to} className="mrg-05-top">
                                    <Col className="primary-bg-200 rounded mrg-1-bot">
                                    <Row className="pd-05"><Link onClick={()=>this.showContent(obj.to)} className="primary-800 font-weight-bold"> {obj._to.title}</Link></Row>
                                    <Row className="primary-600 sz-075 pd-05"> Created On {obj.created}</Row>
                                    </Col>
                                </Row>
                                </>)
                                :(<>
                                    {obj._id ? (<>
                                        <Row key={obj._id} value={obj._id} className="mrg-05-top">
                                        <Col className="primary-bg-200 rounded mrg-1-bot">
                                        <Row className="pd-05"><Link onClick={()=>this.showContent(obj._id)} className="primary-800 font-weight-bold"> {obj.title}</Link></Row>
                                        <Row className="primary-600 sz-075 pd-05"> Created On {obj.created}</Row>
                                        </Col>
                                </Row>   
                                    </>)
                                :(<></>)}
                                </>)
                            }
                            
                            </>
                            })}     

                        </>)}                    
                            
                        </Col>
                        
                        {/* NOTE CONTENT */}
                        {this.state.showNoteContent ? 
                        (<>
                            <Col md="5" sm="12" className="mrg-6-top pd-2 v-scroll">
                                <NoteContent noteContnetList ={this.noteContnetNew}/>
                            </Col>
                        </>)
                        :null
                        }
                        
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
                                <Col><Link onClick={()=>this.changeView({obj})} > {obj.title} </Link></Col>
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

const mapStateToProps = (state, ownProps) => {
    return {
        dialogs: state.dialogs
    }
}

const mapDispatchToProps = { closeDrawDialog, addDrawing, removeNote, closeDialog, newNote}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(View)
