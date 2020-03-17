import React, { Component } from 'react';
import Home from './Home'
import Login from './Login'
import Suggestion from './Suggestion'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import '../stylesheets/App.scss'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <Router>
        <div>
          <Route path='/' exact component={Login}/>
          <Route path='/home' component={Home}/>
          <Route path='/suggest' component={Suggestion}/>
        </div>
      </Router>
    )
  }
}