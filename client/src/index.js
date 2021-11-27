import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
  <Provider store={ store }>
      <App />
  </Provider >
  ,
  document.getElementById('root')
);


