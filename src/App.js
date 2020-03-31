import React from 'react';
import { HashRouter as Router, Route} from 'react-router-dom';
import Login from './account/login';
import SignUp from './account/signup';
import Home from './home';

import './App.css';


function App() {
  return (
    //LIST OF ROUTES
    <Router>
      <Route path="/login" component={Login}>
      </Route>
      <Route path="/signup" component={SignUp}>
      </Route>
      <Route path="/home" component={Home}>
      </Route>
    </Router>
  );
}

export default App;
