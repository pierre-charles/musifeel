import React, { Component } from 'react';
import Emoji from 'react-emojis'
import '../stylesheets/Playlists.scss'

export default class Playlists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      features: []
    }
  }

  componentDidMount() {
    const shortTerm = 'short_term'
    this.getSpotifyTracks(shortTerm)
  }

  getSpotifyTracks = async (timerange) => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timerange}&limit=50`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    const ids = []
    this.setState({ results: response.items })
    const results = this.state.results
    for (let i = 0; i < Object.keys(results).length; i++) {
      console.log('Track name: ', results[i].name)
      console.log('Artist: ', results[i].album.artists[0].name)
      console.log('640 image: ', results[i].album.images[0].url)
      console.log('Track ID: ', results[i].id)
      console.log('Preview', results[i].preview_url)
      console.log('External link: ', results[i].external_urls.spotify)
      ids.push(results[i].id)
      if (ids.length === 50) {
        const collectedIds = ids.toString()
        this.getAudioFeature(collectedIds)
        this.state.results.map(data => { console.log(data.name) })
      }
    }
  }

  getAudioFeature = async (ids) => {
    const apiCall = await fetch(`https://api.spotify.com/v1/audio-features?ids=${ids}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    this.setState({ features: response.audio_features })
    console.log('FEATURES', this.state.features)
  }

  render() {
    const range = {
      longTerm: 'long_term',
      mediumTerm: 'medium_term',
      shortTerm: 'short_term'
    }
    console.log('TRACKS', this.state.results)
    const data = Object.keys(this.state.results).length === 50 ? this.state.results : null
    console.log('DATA', data)

    const mood = localStorage.getItem('mood')
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
      <div className='container text-white' >
        <div className='my-5'>
          <h1>Music based on your mood <Emoji emoji='musical-note' /></h1>
          <h2 className='h4'><span className='mr-2'>Mood: {mood}</span>
            {mood === 'happy' && <Emoji emoji={emojis.happy} />}
            {mood === 'sad' && <Emoji emoji={emojis.sad} />}
            {mood === 'neutral' && <Emoji emoji={emojis.neutral} />}
            {mood === 'angry' && <Emoji emoji={emojis.angry} />}
            {mood === 'surprised' && <Emoji emoji={emojis.surprised} />}
            {mood === 'fearful' && <Emoji emoji={emojis.fearful} />}
            {mood === 'disgusted' && <Emoji emoji={emojis.disgusted} />}
          </h2>
        </div>
        <div className='p-1 fluid-container bg-white py-5 px-5 color-secondary shadow'>
          <h1 className='h3'>Your top tracks</h1>
          <div className='col-md-12 col-sm-12 p-0 text-secondary'>
            <span><button className='button-range' onClick={() => { this.getSpotifyTracks(range.shortTerm) }}>Last Month</button></span>
            <span className='pl-4'><button className='button-range' onClick={() => { this.getSpotifyTracks(range.mediumTerm) }}>Last 6 Months</button></span>
            <span className='pl-4'><button className='button-range' onClick={() => { this.getSpotifyTracks(range.longTerm) }}>All Time</button></span>
          </div>
          <hr />
          <div className='mt-4 p-1 row container'>
            <div className='col-md-4 col-sm-12'>
              <h1 className='h4'>Playlist 1 <Emoji emoji='musical-note' /></h1>
            </div>
            <div className='col-md-4 col-sm-12'>
              <h1 className='h4'>Playlist 2 <Emoji emoji='musical-notes' /></h1>
            </div>
            <div className='col-md-4 col-sm-12'>
              <h1 className='h4'>Playlist 3 <Emoji emoji='musical-score' /></h1>
            </div>
          </div>
        </div>
        <div className='text-right'>
          <button className='mt-5 mb-3 button-back'><i className='pr-2 fas fa-chevron-left'></i>Go Back</button>
        </div>
      </div >
    )
  }
}