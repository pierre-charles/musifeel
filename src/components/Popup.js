import React from 'react'
import '../stylesheets/Popup.scss'
import '../stylesheets/Login.scss'
import Emoji from 'react-emojis'

const Popup = (props) => {
  return (
    <div className='popup'>
      <div className='bg-white rounded m-5'>
        <button className='close p-2' onClick={props.closePopup}><i className='fas fa-times' /></button>
        <div className='px-4 py-5'>
          <p className='ml-2 h4 pb-3'><Emoji emoji="partying-face" /> Yay! Your playlist has been saved!</p>
          <p>You can now find it on Spotify playlists, here's what to look for:</p>
          <p className='py-4'>Playlist name: {props.name}</p>
          <a target='_blank' rel="noopener noreferrer" className='view-playlist mt-2' href={props.href}>View on Spotify</a>
        </div>
      </div>
    </div>
  )
}

export default Popup