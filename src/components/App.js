import React, { Component } from 'react';
import Home from './Home'
// import Login from './Login'
import '../stylesheets/App.scss'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>
        <Home />
        {/* <Login /> */}
      </div>
    )
  }
}