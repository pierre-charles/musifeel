import React, { useRef } from 'react'
import '../stylesheets/Tracks.scss'

export default function Track(props) {
  const audio = useRef()

  return (
    <div className='track'>
      <hr />
      <div className='row pt-2'>
        <div className='col-12 text-center'>
          <audio ref={audio} type="audio/mp3" src={props.preview}></audio>
          <img className='album-art mb-2' src={props.albumArt} alt={props.name} onMouseEnter={() => { audio.current.volume = 0.25; audio.current.play() }} onMouseLeave={() => { audio.current.pause() }} />
        </div>
        <div className='col-12 m-0 text-center column'>
          <p className='h5 m-0 font-weight-bold'>{props.name}</p>
          <p className='h6 m-0 color-secondary'>{props.albumName}</p>
          <p className='h6 m-0 color-tertiary'>{props.artist}</p>
        </div>
      </div>
    </div >
  )
}