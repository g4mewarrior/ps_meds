import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import './styles/main.scss'
import * as firebase from "firebase/app";
import injectTapEventPlugin from 'react-tap-event-plugin';

var firebaseConfig = {
    apiKey: "AIzaSyABD3Gp7IMgy__nqT23mPZI95fJTaRP2IQ",
    authDomain: "medicine-shop-ca2d5.firebaseapp.com",
    databaseURL: "https://medicine-shop-ca2d5.firebaseio.com",
    projectId: "medicine-shop-ca2d5",
    storageBucket: "medicine-shop-ca2d5.appspot.com",
    messagingSenderId: "288858605082",
    appId: "1:288858605082:web:85f79663fb2e3c3af473a3",
    measurementId: "G-ELNGEX45X0"
  };
firebase.initializeApp(firebaseConfig);

// Store Initialization
// ------------------------------------
const store = createStore(window.__INITIAL_STATE__)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')
try {
    injectTapEventPlugin()
}
catch(e) {
    //Don't do anything
}
let render = () => {
  const App = require('./components/App').default
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <App store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// Development Tools
// ------------------------------------
if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e)
        renderError(e)
      }
    }

    // Setup hot module replacement
    module.hot.accept([
      './components/App',
      './routes/index',
    ], () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// Let's Go!
// ------------------------------------
if (!__TEST__) render()
