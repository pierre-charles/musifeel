import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import Emoji from 'react-emojis'
import '../stylesheets/Home.scss'
import { Link } from 'react-router-dom'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.video = React.createRef();
    this.canvas = React.createRef();
    const hash = window.location.hash.substr(1).split('&')
    const hashDecompose = hash[0].split('=')
    const access_token = hashDecompose[1]
    localStorage.setItem('accessToken', access_token)
    this.state = {
      emotion: null,
    }
  }

  componentDidMount() {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(this.startVideo)
  }

  startVideo = () => {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }
    }).then(stream => this.video.current.srcObject = stream)
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

  render() {
    const emojis = {
      happy: 'grinning-face-with-big-eyes',
      sad: 'disappointed-face',
      angry: 'angry-face',
      fearful: 'face-screaming-in-fear',
      neutral: 'neutral-face',
      disgusted: 'confounded-face',
      surprised: 'face-with-open-mouth'
    }
    return (
      <div className='row'>
        <div className='container col-lg-7 col-md-7 col-10 bg-light mt-5 mb-5 p-3 shadow'>
          <div className='pt-3 video-container'>
            <video className='video-container container-fluid pt-3' onLoadedMetadata={() => { this.simulate() }} width='700' height='500' autoPlay muted playsInline ref={this.video}></video>
            <canvas className='overlay container-fluid pt-3' ref={this.canvas} />
          </div>
          <div className='text-center my-3'>
            <p>Your mood is: {this.state.emotion}</p>
            <div className='h2'>
              {this.state.emotion === 'happy' && <Emoji emoji={emojis.happy} />}
              {this.state.emotion === 'sad' && <Emoji emoji={emojis.sad} />}
              {this.state.emotion === 'neutral' && <Emoji emoji={emojis.neutral} />}
              {this.state.emotion === 'angry' && <Emoji emoji={emojis.angry} />}
              {this.state.emotion === 'surprised' && <Emoji emoji={emojis.surprised} />}
              {this.state.emotion === 'fearful' && <Emoji emoji={emojis.fearful} />}
              {this.state.emotion === 'disgusted' && <Emoji emoji={emojis.disgusted} />}
            </div>
            <Link to={{ pathname: `/playlists` }}>
              {this.state.emotion && <button type='button' className='button-next mt-5 mb-3'>Make my playlists!<i className='pl-2 fas fa-headphones'></i></button>}
            </Link>
          </div>
        </div>
      </div>
    )
  }
}