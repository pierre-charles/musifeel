import React, { useState, useEffect } from 'react'
import '../stylesheets/Login.scss'
import { Link } from 'react-router-dom'
import Emoji from 'react-emojis'
import '../stylesheets/Welcome.scss'

export default function Welcome(props) {
  const hash = window.location.hash.substr(1).split('&')
  const hashDecompose = hash[0].split('=')
  const access_token = hashDecompose[1]
  localStorage.setItem('accessToken', access_token)
  const [name, setName] = useState(null)

  useEffect(() => {
    getSpotifyUserDetails()
  }, [])

  const getSpotifyUserDetails = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    localStorage.setItem('spotifyID', response.id)
    setName(response.display_name.split(" "))
  }

  return (
    <div className='container py-5'>
      {name && <div className='text-center text-white'>
        <div className='m-5'>
          <h1 className='pb-3 welcome-title'><Emoji emoji="waving-hand" /> Hello {name[0]}, welcome to musifeel</h1>
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
              <p className='pt-2'>Click on the hearts to save your playlists</p>
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