import React, { Component } from 'react';
import '../stylesheets/Login.scss'
import { Link } from 'react-router-dom'
import Emoji from 'react-emojis'
import '../stylesheets/Welcome.scss'

export default class Welcome extends Component {
  constructor(props) {
    super(props)
    const hash = window.location.hash.substr(1).split('&')
    const hashDecompose = hash[0].split('=')
    const access_token = hashDecompose[1]
    localStorage.setItem('accessToken', access_token)
    this.state = {
      name: null
    }
  }

  componentDidMount() {
    this.getSpotifyUserDetails()
  }

  getSpotifyUserDetails = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    localStorage.setItem('spotifyID', response.id)
    this.setState({ name: response.display_name.split(" ") })
  }

  render() {
    return (
      <div className='container py-5'>
        {this.state.name && <div className='text-center text-white'>
          <div className='m-5'>
            <h1 className='pb-3 welcome-title'><Emoji emoji="waving-hand" /> Hello {this.state.name[0]}, welcome to musifeel</h1>
            <p className='mx-5 mb-5'>Just a reminder... This app uses your webcam to scan your face to detect your mood.</p>
            <div className='row m-5'>
              <div className='col-md-4 col-sm-12 pb-3'>
                <h1><Emoji emoji="computer-mouse" /></h1>
                <p className='pt-2'>Hover over a song to hear a preview</p>
              </div>
              <div className='col-md-4 col-sm-12 pb-3'>
                <h1><Emoji emoji="backhand-index-pointing-up" /></h1>
                <p className='pt-2'>Click on a song to find it on Spotify</p>
              </div>
              <div className='col-md-4 col-sm-12 pb-3'>
                <h1><Emoji emoji="red-heart" /></h1>
                <p className='pt-2'>Click to save your playlists</p>
              </div>
            </div>
            <Link to={{ pathname: `/scan` }}>
              <button type='button' className='button-scan'>Scan my mood!</button>
            </Link>
          </div>
        </div>
        }
      </div>
    )
  }
}