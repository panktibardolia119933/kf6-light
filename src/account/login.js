import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            userName: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let name = target.name;
        let value = target.value;

        this.setState({
          [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        console.log('The form was submitted with:');
        console.log(this.state);

        //LOGIN RETURNS TOKEN
        Axios.post(
            'https://kf6-stage.rit.albany.edu/auth/local',
            this.state)
            .then((response)=>{
                console.log(response.data.token);
                this.token= response.data.token;
                
                //SET TOKEN
                sessionStorage.setItem('token',this.token);
                //NAVIGATE TO HOME TEMP
                this.props.history.push("/home");
            })
            .catch((error)=>{
                if(error.message){
                    console.log(error.message);
                }
            }

            );
    }

    render() {
        return (
        <div className="mrg-1">
            <form onSubmit={this.handleSubmit}>
            <div>
                <label htmlFor="userName">Username</label>
                <input type="text" id="userName" placeholder="Enter Username" name="userName" value={this.state.userName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>
              <div>
                  <button>Login</button>
                  <Link to="/signup">If you don't have an account, please SignUp</Link>
              </div>
            </form>
          </div>
        );
    }
}

export default Login;