import React, { Component } from 'react';
import './App.css';
import * as faceapi from 'face-api.js';

class App extends Component {
  constructor(props) {
    super(props)
    this.video = React.createRef();
    this.canvas = React.createRef();
    this.state = {}
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
    navigator.getUserMedia(
      { video: {} },
      stream => this.video.current.srcObject = stream,
      err => console.error(err)
    )
  }

  simulate = () => {
    const displaySize = { width: this.video.current.width, height: this.video.current.height }
    faceapi.matchDimensions(this.canvas.current, displaySize)
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(this.video.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize, true)
    this.canvas.current.getContext('2d').clearRect(0, 0, this.canvas.current.width, this.canvas.current.height)

    faceapi.draw.drawFaceLandmarks(this.canvas.current, resizedDetections)
    if (resizedDetections && resizedDetections.length > 0) {
      const detection = resizedDetections[0].expressions
      const maxValue = Math.max(...Object.values(detection));
      const emotion = Object.keys(detection).filter(
          item => detection[item] === maxValue
      )
      this.setState({
        emotion: emotion.toString()
      })
    }}, 100)
  }

  render() {
    return (
      <div className='col-11 col-lg-6 col-md-8 container bg-light mt-5 mb-5 p-3 shadow'>
        <h1 className='h3 py-3 text-secondary text-center'><i className='fas fa-music pr-2'/>Welcome to rhythmicFeel</h1>
        <div className='video-container'>
          <video onLoadedMetadata={ () => { this.simulate() }} width='700' height='500' autoPlay muted playsInline ref={this.video}></video>
          <canvas ref={this.canvas} className="overlay" />
        </div>
        <div className='py-3 text-center'>
          <p>Your mood is: {this.state.emotion}</p>
        </div>
      </div>
    )
  }
}

export default App;