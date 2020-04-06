import React, { Component } from 'react';
import Emoji from 'react-emojis'
import Track from './Track'
import '../stylesheets/Playlists.scss'

export default class Playlists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      features: [],
      recent: [],
      range: {
        longTerm: 'long_term',
        mediumTerm: 'medium_term',
        shortTerm: 'short_term'
      },
      activeTab: null
    }
  }

  componentDidMount() {
    this.getRecentTracks()
    this.currentlyPlaying()
    setInterval(this.currentlyPlaying, 1000)
    setInterval(this.getRecentTracks, 5000)

  }

  getRecentTracks = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=25`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    this.setState({ recent: response.items })
  }

  getSpotifyTracks = async (timerange) => {
    this.setState({ activeTab: timerange })
    const apiCall = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timerange}&limit=25`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    const ids = []
    this.setState({ results: response.items })
    const results = this.state.results
    for (let i = 0; i < Object.keys(results).length; i++) {
      ids.push(results[i].id)
      if (ids.length === 25) {
        const collectedIds = ids.toString()
        this.getAudioFeature(collectedIds)
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
    { this.state.features.map(feature => { console.log('Danceability: ', feature.danceability, '\n', 'Energy: ', feature.energy, '\n', 'Valence: ', feature.valence, '\n') }) }
  }

  currentlyPlaying = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    this.setState({
      currentlyPlaying: {
        status: response.is_playing,
        name: response.item.name,
        album: response.item.album.name,
        href: response.context.external_urls.spotify
      }
    })
  }


  render() {
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
          <h1 className='title'>Music for your mood <Emoji emoji='musical-note' /></h1>
          <h2 className='mood h4 '><span className='mr-2'>Mood: {mood}</span>
            {mood === 'happy' && <Emoji emoji={emojis.happy} />}
            {mood === 'sad' && <Emoji emoji={emojis.sad} />}
            {mood === 'neutral' && <Emoji emoji={emojis.neutral} />}
            {mood === 'angry' && <Emoji emoji={emojis.angry} />}
            {mood === 'surprised' && <Emoji emoji={emojis.surprised} />}
            {mood === 'fearful' && <Emoji emoji={emojis.fearful} />}
            {mood === 'disgusted' && <Emoji emoji={emojis.disgusted} />}
          </h2>
          {this.state.currentlyPlaying && <h3 className='h6 pt-2 current-playing'>Currently playing: <a href={this.state.currentlyPlaying.href} target='_blank' rel="noopener noreferrer">{this.state.currentlyPlaying.name} - {this.state.currentlyPlaying.album}</a></h3>}
        </div>
        <div className='p-1 fluid-container bg-white py-5 px-5 color-primary shadow'>
          <div className='text-center'>
            <h1 className='favourite-track h2 pb-3'>Your favourite tracks</h1>
            <div className='row p-0 color-tertiary'>
              <div className='col-12'>
                <p><button className={this.state.activeTab === 'short_term' ? 'button-range-active' : 'button-range'} onClick={() => { this.getSpotifyTracks(this.state.range.shortTerm) }}>Last Month</button></p>
                <p><button className={this.state.activeTab === 'medium_term' ? 'button-range-active' : 'button-range'} onClick={() => { this.getSpotifyTracks(this.state.range.mediumTerm) }}>Last 6 Months</button></p>
                <p><button className={this.state.activeTab === 'long_term' ? 'button-range-active' : 'button-range'} onClick={() => { this.getSpotifyTracks(this.state.range.longTerm) }}>All Time</button></p>
              </div>
            </div>
          </div>
          <div className='mt-4 p-1 row container'>
            <div className={!this.state.activeTab ? 'col-12 mb-5' : 'col-lg-6 col-md-6 col-sm-12 mb-5'}>
              <h1 className={this.state.activeTab ? 'playlist h3' : 'recently-played h3'}>{this.state.activeTab ? 'Playlist 1' : 'Recently played'} <Emoji emoji='musical-note' /></h1>
              {
                !this.state.activeTab && this.state.recent.map(music => {
                  return (
                    <Track
                      name={music.track.name}
                      albumName={music.track.album.name}
                      artist={music.track.album.artists[0].name}
                      albumArt={music.track.album.images[1].url}
                      preview={music.track.preview_url}
                      lastPlayed={music.played_at}
                    />
                  )
                }
                )
              }
              {
                this.state.activeTab && this.state.results.map(music => {
                  return (
                    <Track
                      name={music.name}
                      albumName={music.album.name}
                      artist={music.artists[0].name}
                      albumArt={music.album.images[1].url}
                      preview={music.preview_url}
                    />
                  )
                }
                )
              }
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 mb-5'>
              {this.state.activeTab && <h1 className={this.state.activeTab ? 'playlist h3' : 'recently-played h3'}>{this.state.activeTab ? 'Playlist 1' : 'Recently played'} <Emoji emoji='musical-note' /></h1>}
              {this.state.activeTab && this.state.results.map(music => {
                return (
                  <Track
                    name={music.name}
                    albumName={music.album.name}
                    artist={music.artists[0].name}
                    albumArt={music.album.images[1].url}
                    preview={music.preview_url}
                  />
                )
              }
              )
              }
            </div>
          </div>
        </div>
        <div className='text-right mb-5'>
          <button className='mt-5 mb-3 button-back' onClick={() => { this.props.history.goBack() }}><i className='pr-2 fas fa-chevron-left'></i>Go Back</button>
        </div>
      </div >
    )
  }
}