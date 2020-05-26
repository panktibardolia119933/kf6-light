import React from 'react';
import { HashRouter as Router, Route} from 'react-router-dom';

import Login from './account/login';
import SignUp from './account/signup';
import CommunityManager from './communityManager';
import TopNavbar from './reusable/topNavbar';
import View from './view/view';
import NewNote from './components/newNote/NewNote'
import './App.css';
import ChangePassword from './account/change-password';



function App() {
  return (
    <div>
    <TopNavbar></TopNavbar>
    <Router>
      <Route exact path="/" component={Login}>
      </Route>
      <Route path="/signup" component={SignUp}>
      </Route>
      <Route path="/community-manager" component={CommunityManager}>
      </Route>
      <Route path="/view" component={View}>      
      </Route>
      <Route path="/new-note" component={NewNote}>
      </Route>
      <Route path="/change-password" component={ChangePassword}>      
      </Route>
    </Router>
    </div>
  );
}

export default App;
