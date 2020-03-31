import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

class SignUp extends Component {
    constructor() {
        super();

        this.state = {
            firstName:'',
            lastName:'',
            email: '',
            userName: '',
            password: '',
            registrationKey: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //HANDLES THE REALTIME CHANGING VALUE
    handleChange(e) {
        let target = e.target;
        let name = target.name;
        let value = target.value;

        //NAME IS ATTRIBUTE NAME AND VALUE IS ATTRIBUTE VALUE
        this.setState({
          [name]: value
        });
    }

    //HANDLE SUBMIT
    handleSubmit(e) {
        e.preventDefault();

        console.log('The form was submitted with:');
        console.log(this.state);

        Axios.post(
            'https://kf6-stage.rit.albany.edu/api/users',
            this.state)
            .then((response)=>{
                console.log(response.data.token);
                this.token= response.data.token;
                
                //SET TOKEN
                sessionStorage.setItem('token',this.token);
                //NAVIGATE TO HOME TEMP
                this.props.history.push('/home')
            })
            .catch((error)=>{
                if(error.message){
                    console.log(error.message);
                }
            });
    }

    render() {
        return (
        <div className="mrg-1">
            <form onSubmit={this.handleSubmit}>
              <div>
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" placeholder="Enter First Name" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" placeholder="Enter Last Name" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter Email" name="email" value={this.state.email} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="userName">Username</label>
                <input type="text" id="userName" placeholder="Enter Username" name="userName" value={this.state.userName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>

              <div>
                  <button className="">New Account</button>
                  <Link to="/login" className="FormField__Link">If you already have an account, please Signin</Link>
              </div>
            </form>
          </div>
        );
    }
}

export default SignUp;