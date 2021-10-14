
import React from 'react';
import Receiver from './Receiver'
import Sender from './Sender';
import store from './redux/store';
import './App.css'
import { Provider } from 'react-redux';

import { HashRouter, Switch, Route, Router } from 'react-router-dom';



function App() {

  return (
    <HashRouter>
      <Switch>
        <Route exact path='/host' component={Sender} />
        <Route exact path='/join' component={Receiver} />
        <Route component={() => <h1> Hello </h1>} />
      </Switch>
    </HashRouter>

  );

}

export default App;
