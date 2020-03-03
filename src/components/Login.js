import React, { Component } from 'react'
import Emoji from 'react-emojis'
import '../stylesheets/Login.scss'
export default class Login extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    trigger = () => {
        console.log('clicked')
    }
  
    render () {
      return (
        <div>
          <div className='container text-center text-white'>
            <h1 className='pb-3 header'>musifeel <Emoji emoji="musical-note"/></h1>
            <p className='text-center mx-5 mb-5'>Creates a Spotify playlist by identifying your mood.</p>
            <button className='spotify-login' onClick={this.trigger}><i className='fab fa-spotify fa-lg pr-1'/> Login with Spotify</button>
          </div>
        </div>
      )
    }
  }