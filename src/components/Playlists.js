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
      happy: [],
      sad: [],
      party: [],
      chill: [],
      energetic: [],
      range: {
        longTerm: 'long_term',
        mediumTerm: 'medium_term',
        shortTerm: 'short_term'
      },
      activeTab: null
    }
  }

  componentDidMount() {
    this.getSpotifyTracks(this.state.range.shortTerm)
  }

  getRecentTracks = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    this.setState({ recent: response.items })
  }

  getSpotifyTracks = async (timerange) => {
    this.setState({ activeTab: timerange })
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
      ids.push(results[i].id)
      if (ids.length === 50) {
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
    const happy = []
    const sad = []
    const party = []
    const chill = []
    const energetic = []
    this.state.features.map(
      feature => {
        if (feature.valence > 0.6 && feature.energy > 0.4 && feature.danceability > 0.5) happy.push(feature.id)
        if (feature.valence < 0.3 && feature.energy < 0.6) sad.push(feature.id)
        if (feature.valence > 0.7 && feature.danceability >= 0.7 && feature.energy > 0.6) party.push(feature.id)
        if (feature.valence > 0.2 && feature.energy <= 0.5) chill.push(feature.id)
        if (feature.energy >= 0.7) energetic.push(feature.id)
      }
    )
    this.sortSongsIntoPlaylists(happy.toString(), 'happy')
    this.sortSongsIntoPlaylists(sad.toString(), 'sad')
    this.sortSongsIntoPlaylists(party.toString(), 'party')
    this.sortSongsIntoPlaylists(chill.toString(), 'chill')
    this.sortSongsIntoPlaylists(energetic.toString(), 'energetic')
  }

  sortSongsIntoPlaylists = async (ids, mood) => {
    const apiCall = await fetch(`https://api.spotify.com/v1/tracks?ids=${ids}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      }
    })
    const response = await apiCall.json()
    this.setState({ [mood]: response.tracks })
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
      <div className='container text-white text-center mb-5' >
        <div className='my-5'>
          <h1 className='title'>Music for your mood <Emoji emoji='musical-notes' /></h1>
          <h2 className='mood h4 '><span className='mr-2'>Mood: {mood}</span>
            {mood === 'happy' && <Emoji emoji={emojis.happy} />}
            {mood === 'sad' && <Emoji emoji={emojis.sad} />}
            {mood === 'neutral' && <Emoji emoji={emojis.neutral} />}
            {mood === 'angry' && <Emoji emoji={emojis.angry} />}
            {mood === 'surprised' && <Emoji emoji={emojis.surprised} />}
            {mood === 'fearful' && <Emoji emoji={emojis.fearful} />}
            {mood === 'disgusted' && <Emoji emoji={emojis.disgusted} />}
          </h2>
        </div>
        <div className='text-left text-white'>
          <p><button className='button-back' onClick={() => { this.props.history.goBack() }}><i className='pr-2 fas fa-chevron-left'></i>Re-scan my mood</button></p>
        </div>
        <div className='fluid-container bg-white py-5 px-5 color-primary shadow'>
          <div className='text-center'>
            <div className='row p-0 color-tertiary'>
              <div className='col-12'>
                <h1 className='menu-title h6 pb-3'>Create playlists from your top tracks</h1>
                <p><button className={this.state.activeTab === 'short_term' ? 'button-range-active' : 'button-range'} onClick={() => { this.getSpotifyTracks(this.state.range.shortTerm) }}>Last Month</button></p>
                <p><button className={this.state.activeTab === 'medium_term' ? 'button-range-active' : 'button-range'} onClick={() => { this.getSpotifyTracks(this.state.range.mediumTerm) }}>Last 6 Months</button></p>
                <p className='mb-0'><button className={this.state.activeTab === 'long_term' ? 'button-range-active' : 'button-range'} onClick={() => { this.getSpotifyTracks(this.state.range.longTerm) }}>All Time</button></p>
              </div>
            </div>
          </div>
          <div className='title-holder my-5'>
            <hr className='menu-divider my-2' />
            <h1 className='favourite-track h2 my-3'>Playlists for your mood</h1>
            <hr className='menu-divider my-2' />
          </div>
          <div className='mt-4 p-1 row text-center'>
            <div className='col-lg-4 col-md-4 col-sm-12 mb-5'>
              {
                this.state.activeTab && mood === 'sad' &&
                <div>
                  <h1 className='playlist h3'>Melancholic <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.sad.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                this.state.activeTab && mood === 'angry' &&
                <div>
                  <h1 className='playlist h3'>Chill <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.chill.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                this.state.activeTab && mood === 'happy' &&
                <div>
                  <h1 className='playlist h3'>Peaceful <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.chill.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                (mood === 'neutral' || mood === 'disgusted' || mood === 'fearful' || mood === 'surprised') && this.state.activeTab &&
                <div>
                  <h1 className='playlist h3'>Relaxing <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.chill.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
            </div>
            <div className='col-lg-4 col-md-4 col-sm-12 mb-5'>
              {
                this.state.activeTab && mood === 'sad' &&
                <div>
                  <h1 className='playlist h3'>Happy <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.happy.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                this.state.activeTab && mood === 'angry' &&
                <div>
                  <h1 className='playlist h3'>Energetic <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.energetic.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                this.state.activeTab && mood === 'happy' &&
                <div>
                  <h1 className='playlist h3'>Joyful <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.happy.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                (mood === 'neutral' || mood === 'disgusted' || mood === 'fearful' || mood === 'surprised') && this.state.activeTab &&
                <div>
                  <h1 className='playlist h3'>Upbeat <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.happy.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
            </div>
            <div className='col-lg-4 col-md-4 col-sm-12 mb-5'>
              {
                this.state.activeTab && mood === 'sad' &&
                <div>
                  <h1 className='playlist h3'>Cheerful <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.party.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                this.state.activeTab && mood === 'angry' &&
                <div>
                  <h1 className='playlist h3'>Upbeat <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.happy.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                this.state.activeTab && mood === 'happy' &&
                <div>
                  <h1 className='playlist h3'>Ecstatic <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.energetic.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
              {
                (mood === 'neutral' || mood === 'disgusted' || mood === 'fearful' || mood === 'surprised') && this.state.activeTab &&
                <div>
                  <h1 className='playlist h3'>Energetic <Emoji emoji='musical-note' /></h1>
                  <i className='heart pl-2 fas fa-heart'></i>
                  {
                    this.state.energetic.map(music => {
                      return (
                        <Track
                          name={music.name}
                          albumName={music.album.name}
                          artist={music.artists[0].name}
                          albumArt={music.album.images[1].url}
                          preview={music.preview_url}
                        />
                      )
                    })
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}