import React from 'react'
import Emoji from 'react-emojis'
import '../stylesheets/Login.scss'

const encodeURI = encodeURIComponent('https://musifeel.netlify.com/home')

const Login = () => {
  return (
    <div className='bd-container'>
      <div className='text-center text-white'>
        <h1 className='pb-3 header'>musifeel <Emoji emoji="musical-note" /></h1>
        <p className='text-center mx-5 mb-5'>Creates a Spotify playlist by identifying your mood.</p>
        <a className='spotify-login' href={`https://accounts.spotify.com/authorize?client_id=5d549dda46474e9e8422bc9803497cb6&redirect_uri=${encodeURI}&scope=user-top-read,user-library-read,user-read-recently-played
%20playlist-modify-public&response_type=token&state=123`}><i className='fab fa-spotify fa-lg pr-1' /> Login with Spotify</a>
      </div>
    </div>
  )
}

export default Login