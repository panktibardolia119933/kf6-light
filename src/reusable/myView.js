import React, { Component } from 'react';
import Axios from 'axios';

class MyView extends Component{
    token = sessionStorage.getItem('token');;
    communityId = sessionStorage.getItem('communityId');

    componentDidMount(){
        //SET HEADER WITH TOKEN BEARER
        var config = {
            headers: { Authorization: `Bearer ${this.token}` }
        };
        
        //GET USER'S VIEWS
        var viewUrl= "https://kf6-stage.ikit.org/api/communities/"+this.communityId+"/views";
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
    }

}
export default MyView;