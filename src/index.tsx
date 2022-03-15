import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from "mobx-react";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import 'normalize.css';

ReactDOM.render((
  <Provider>
    <App /> 
  </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();