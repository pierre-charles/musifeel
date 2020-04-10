import React from 'react'
import '../stylesheets/Popup.scss'
import '../stylesheets/Login.scss'
import Emoji from 'react-emojis'

const Popup = (props) => {
  return (
    <div className='popup'>
      <div className='bg-white rounded m-5 p-5'>
        <button className='close' onClick={props.closePopup}><i className='fas fa-times' /></button>
        <p className='ml-2 h4 pb-3'><Emoji emoji="partying-face" /> Yay! Your playlist has been saved!</p>
        <p>You can now find it on Spotify playlists, here's what to look for:</p>
        <p className='pt-3'>Playlist name: {props.name}</p>
        <a className='pt-3' href={props.href}>View my playlist</a>
      </div>
    </div>
  )
}

export default Popup