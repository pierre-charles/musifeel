import React from 'react'
import '../stylesheets/ScanPopup.scss'
import '../stylesheets/Login.scss'

const ScanPopup = (props) => {
  return (
    <div className='popup text-center'>
      <div className='bg-white m-5'>
        <div className='px-4 py-5'>
          <h1 className='color-primary pb-3'>Welcome to musifeel!</h1>
          <p>This app scans your face to detect your mood and uses Spotify to generate mood based playlists using your recent and top tracks.</p>
          <div className='row m-5'>
            <div className='col-md-4 col-sm-12'>
              <i className='color-primary fas fa-mouse-pointer fa-2x'></i>
              <p className='pt-2'>Hover over a song to listen to a preview</p>
            </div>
            <div className='col-md-4 col-sm-12'>
              <i className='color-primary fas fa-hand-pointer fa-2x'></i>
              <p className='pt-2'>Click on a song to find it on Spotify</p>
            </div>
            <div className='col-md-4 col-sm-12'>
              <i className='color-primary fas fa-heart fa-2x'></i>
              <p className='pt-2'>Click to save your playlists</p>
            </div>
          </div>
          <a target='_blank' rel="noopener noreferrer" onClick={props.closePopup} className='button-dive mt-2' href={props.href}>Let's dive in!</a>
        </div>
      </div>
    </div >
  )
}

export default ScanPopup