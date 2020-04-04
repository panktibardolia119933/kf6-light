import React, { Component } from 'react';
import Axios from 'axios';

class Home extends Component {

    state={
        communitites: []
    };

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
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
            });
        // .catch(
        //         erorr=>{
        //             console.log("GET Communities Failed");
        //         }
        // );
    }

    render() {
        return (
            <div>
            <div className="drop-down">
            <p>DropDown Menu</p>
              <select>{
                 this.state.communitites.map((obj) => {
                     return <option key={obj._id} value={obj.title}>{obj.title}</option>
                 })
              }</select>
            </div>
            <p>It Works!</p>  
            </div>);
    }
}

export default Home;