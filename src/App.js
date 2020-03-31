import React from 'react';
import { HashRouter as Router, Route} from 'react-router-dom';
import Login from './account/login';
import SignUp from './account/signup';
import './App.css';

function App() {
  return (
    <Router>
      <Route path="/login" component={Login}>
      </Route>
      <Route path="/signup" component={SignUp}>
      </Route>
    </Router>
  );
}

export default App;
