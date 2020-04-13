import React, { Component } from 'react'
import '../stylesheets/Tracks.scss'
export default class Track extends Component {
  constructor(props) {
    super(props)
    this.audio = React.createRef();
  }

  render() {
    return (
      <div className='track'>
        <hr />
        <div className='row pt-2'>
          <div className='col-12 text-center'>
            <audio ref={this.audio} type="audio/mp3" src={this.props.preview}></audio>
            <img className='album-art mb-2' src={this.props.albumArt} alt={this.props.name} onMouseEnter={() => { this.audio.current.volume = 0.25; this.audio.current.play() }} onMouseLeave={() => { this.audio.current.pause() }} />
          </div>
          <div className='col-12 m-0 text-center column'>
            <p className='h5 m-0 font-weight-bold'>{this.props.name}</p>
            <p className='h6 m-0 color-secondary'>{this.props.albumName}</p>
            <p className='h6 m-0 color-tertiary'>{this.props.artist}</p>
          </div>
        </div>
      </div >
    )
  }
}