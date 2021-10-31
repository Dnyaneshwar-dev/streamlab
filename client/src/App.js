
import React from 'react';
import Receiver from './Receiver'
import Sender from './Sender';
import Lobby from './Pages/Lobby';
import Auditorium from './Pages/Auditorium';
import Join from './Pages/Join';
import Messages from './Pages/Messages';

import store from './redux/store';
import './App.css'
import { Provider } from 'react-redux';
import { useParams } from 'react-router';
import { HashRouter, Switch, Route, Router } from 'react-router-dom';
import Chat from './Chat';
import axios from 'axios';
import Navbar from './Components/Navbar';



function App() {

  return (
    <HashRouter>
      <Switch>
        <Route path='/' exact component={Join} />
        <Route path='/auditorium' component={Auditorium} />
        <Route path='/join' component={Join} />
        <Route path='/messages' component={Messages} />
        <Route exact path='/host' component={Sender} />
        <Route exact path='/join' component={Receiver} />
        <Route exact path='/chat' component={Chat} />
        <Route component={() => <h1> Hello </h1>} />
      </Switch>
    </HashRouter>

  );

}

export default App;
