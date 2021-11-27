
import React from 'react';
import Receiver from './Components/Receiver'
import Sender from './Components/Sender';
import Create from './Pages/Create';
import Join from './Pages/Join';
import Home from './Pages/Home';
import Error from './Pages/Error';
import store from './redux/store';
import './App.css'
import { Provider } from 'react-redux';
import { useParams } from 'react-router';
import { HashRouter, Switch, Route, Router } from 'react-router-dom';
import Chat from './Components/Chat';
import axios from 'axios';
import Navbar from './Components/Navbar';



function App() {

  return (
    <HashRouter>
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/create' component={Create} />
        <Route path='/joinroom' component={Join} />
        <Route exact path='/host' component={Sender} />
        <Route exact path='/join' component={Receiver} />
        <Route exact path='/chat' component={Chat} />
        <Route exact path="/error" component={Error} />
        <Route component={Error} />
      </Switch>
    </HashRouter>

  );

}

export default App;
