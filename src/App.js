import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './calendar';
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'font-awesome/css/font-awesome.min.css'

import 'react-big-calendar/lib/less/styles.less'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">10by10 Calendar</h1>
        </header>
        <div>
          <Calendar />
        </div>
      </div>
    );
  }
}

export default App;
