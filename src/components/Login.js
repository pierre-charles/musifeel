import React, { Component } from 'react'
import Emoji from 'react-emojis'
import '../stylesheets/Login.scss'
export default class Login extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }
  
    render () {
      return (
        <div>
          <div className='container text-center text-white'>
            <h1 className='pb-3 header'>musifeel <Emoji emoji="musical-note"/></h1>
            <p className='text-center mx-5 mb-5'>Creates a Spotify playlist by identifying your mood.</p>
            <a className='spotify-login' href={`https://accounts.spotify.com/authorize?client_id=5d549dda46474e9e8422bc9803497cb6&redirect_uri=https%3A%2F%2Fmusifeel.netlify.com%2Fsuggest&scope=user-top-read%20playlist-modify-public&response_type=token&state=123`}><i className='fab fa-spotify fa-lg pr-1'/> Login with Spotify</a>
          </div>
        </div>
      )
    }
  }
