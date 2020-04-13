import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import '../stylesheets/Home.scss'
import Popup from './Popup'
import MoodButton from './MoodButton'

export default class Scan extends Component {
  constructor(props) {
    super(props)
    this.video = React.createRef();
    this.canvas = React.createRef();
    const hash = window.location.hash.substr(1).split('&')
    const hashDecompose = hash[0].split('=')
    const access_token = hashDecompose[1]
    localStorage.setItem('accessToken', access_token)
    this.state = {
      loaded: false,
      emotion: 'unknown'
    }
  }

  componentDidMount() {
    this.getSpotifyUserDetails()
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(this.startVideo)
  }

  togglePopup = () => {
    this.setState({ showPopup: !this.state.showPopup })
  }

  showPopup = (name, href) => {
    return (
      <Popup name={name} href={href} closePopup={this.togglePopup} />
    )
  }

  startVideo = () => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    }).then(stream => this.video.current.srcObject = stream)
    this.setState({ loaded: !this.state.loaded })
  }

  simulate = () => {
    const displaySize = { width: this.video.current.width, height: this.video.current.height }
    faceapi.matchDimensions(this.canvas.current, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(this.video.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize, true)
      this.canvas.current.getContext('2d').clearRect(0, 0, this.canvas.current.width, this.canvas.current.height)
      faceapi.draw.drawDetections(this.canvas.current, resizedDetections)
      if (resizedDetections && resizedDetections.length > 0) {
        const detection = resizedDetections[0].expressions
        const maxValue = Math.max(...Object.values(detection));
        const emotion = Object.keys(detection).filter(
          item => detection[item] === maxValue
        )
        localStorage.setItem('mood', emotion.toString())
        this.setState({ emotion: emotion.toString() })
      }
    }, 100)
  }

  getSpotifyUserDetails = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    localStorage.setItem('spotifyID', response.id)
  }

  render() {
    return (
      <div className='row'>
        <div className='container col-lg-7 col-md-7 col-10 bg-light mt-5 mb-5 p-3 shadow'>
          {!this.state.loaded &&
            <div className='text-center my-3'>
              <p>Loading your camera <i className='ml-2 fas fa-notch fa-spin'></i></p>
            </div>
          }
          <div className='pt-3 video-container'>
            <video className='video-container container-fluid pt-3' onLoadedMetadata={() => { this.simulate() }} width='700' height='500' autoPlay muted playsInline ref={this.video}></video>
            <canvas className='overlay container-fluid pt-3' ref={this.canvas} />
          </div>
          {this.state.loaded && <MoodButton emotion={this.state.emotion} />}
        </div>
      </div>
    )
  }
}