import React, { Component } from 'react';
import Emoji from 'react-emojis'
import Track from './Track'
import '../stylesheets/Playlists.scss'
import moment from 'moment'
import Popup from './Popup'
import { Link } from 'react-router-dom'

export default class Playlists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      recent: [],
      features: [],
      happy: [],
      sad: [],
      party: [],
      chill: [],
      energetic: [],
      range: {
        recent: 'recent',
        longTerm: 'long_term',
        mediumTerm: 'medium_term',
        shortTerm: 'short_term'
      },
      activeTab: null,
      showPopup: false
    }
  }

  componentDidMount() {
    this.getRecentTracks()
  }

  togglePopup = () => {
    this.setState({ showPopup: !this.state.showPopup })
  }

  showPopup = (name, href) => {
    return (
      <Popup name={name} href={href} closePopup={this.togglePopup} />
    )
  }

  getRecentTracks = async () => {
    this.setState({ activeTab: 'recent' })
    try {
      const apiCall = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
      const response = await apiCall.json()
      this.setState({ recent: response.items })
      const recentTracks = this.state.recent
      const ids = new Set()
      for (let j = 0; j < Object.keys(recentTracks).length; j++) {
        ids.add(recentTracks[j].track.id)
      }
      this.getAudioFeature([...ids])
    } catch (err) {
      alert('Ooops, something has happened...', err.message)
    }
  }

  getSpotifyTracks = async (timerange) => {
    this.setState({ activeTab: timerange })
    try {
      const apiCall = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timerange}&limit=50`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
      const response = await apiCall.json()
      const ids = []
      this.setState({ results: response.items })
      const topTracks = this.state.results
      for (let i = 0; i < Object.keys(topTracks).length; i++) {
        ids.push(topTracks[i].id)
      }
      this.getAudioFeature(ids)
    } catch (err) {
      alert('Ooops, something has happened...', err.message)
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
    this.state.features.forEach(
      feature => {
        if (feature.valence > 0.3 && feature.energy > 0.4) happy.push(feature.id)
        if (feature.valence < 0.4 && feature.energy < 0.5) sad.push(feature.id)
        if (feature.valence >= 0.4 && feature.danceability >= 0.6 && feature.energy >= 0.5) party.push(feature.id)
        if (feature.valence > 0.2 && feature.energy <= 0.5) chill.push(feature.id)
        if (feature.energy >= 0.65) energetic.push(feature.id)
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

  createMoodPlaylist = async (id, name, mood, period, date, playlist) => {
    const songs = []
    playlist.forEach(song => { songs.push(song.uri) })
    const apiCall = await fetch(`https://api.spotify.com/v1/users/${id}/playlists`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      body: JSON.stringify({
        name: `Top ${name} tracks when feeling ${mood} ${period} - ${date}`,
        description: `Playlist to listen to when you are feeling ${mood} and fancy listening to ${name} songs! Created with love by musifeel!`
      })
    })
    const response = await apiCall.json()
    this.addSongsToPlaylist(response.id, songs.toString())
    this.setState({
      playlistName: response.name,
      playlistHref: response.external_urls.spotify,
      showPopup: !this.state.showPopup
    })
  }

  addSongsToPlaylist = async (id, tracks) => {
    await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${tracks}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        'Content-Type': 'application/json'
      }
    })
  }

  render() {
    const mood = localStorage.getItem('mood')
    const spotifyID = localStorage.getItem('spotifyID')
    const date = moment().format('Do MMMM YYYY')
    const emojis = {
      happy: 'grinning-face-with-big-eyes',
      sad: 'disappointed-face',
      angry: 'angry-face',
      fearful: 'face-screaming-in-fear',
      neutral: 'neutral-face',
      disgusted: 'confounded-face',
      surprised: 'face-with-open-mouth'
    }
    const range = (this.state.activeTab === 'recent') ? 'from last week' : (this.state.activeTab === 'short_term') ? 'from last month' : (this.state.activeTab === 'medium_term') ? 'from last 6 months' : 'of all time'
    const playlistName = {
      happy: {
        playlist_1: 'Chill',
        playlist_2: 'Joyful',
        playlist_3: 'Energetic'
      },
      sad: {
        playlist_1: 'Melancholic',
        playlist_2: 'Cheerful',
        playlist_3: 'Exciting'
      },
      angry: {
        playlist_1: 'Chill',
        playlist_2: 'Energetic',
        playlist_3: 'Upbeat'
      },
      neutral: {
        playlist_1: 'Mellow',
        playlist_2: 'Upbeat',
        playlist_3: 'Euphoric'
      }
    }
    const happy = this.state.happy
    const sad = this.state.sad
    const chill = this.state.chill
    const party = this.state.party
    const energetic = this.state.energetic

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
          <Link to={{ pathname: `/scan` }}>
            <p><button className='button-back' onClick={() => { this.props.history.goBack() }}><i className='pr-2 fas fa-chevron-left'></i>Re-scan my mood</button></p>
          </Link>
        </div>
        <div className='fluid-container bg-white py-5 px-5 color-primary shadow'>
          <div className='text-center'>
            <div className='row p-0 color-tertiary'>
              <div className='col-12'>
                <h1 className='menu-title h6 pb-3'>Create playlists from your top tracks</h1>
                <p><button className={this.state.activeTab === 'recent' ? 'button-range-active' : 'button-range'} onClick={() => { this.getRecentTracks() }}>This Week</button></p>
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
                  <h1 className='playlist h3'>{playlistName.sad.playlist_1} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.sad.playlist_1, mood, range, date, sad) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    sad.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.angry.playlist_1} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.angry.playlist_1, mood, range, date, chill) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    chill.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.happy.playlist_1} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.happy.playlist_1, mood, range, date, chill) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    chill.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.neutral.playlist_1} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.neutral.playlist_1, mood, range, date, sad) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    sad.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.sad.playlist_2} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.sad.playlist_2, mood, range, date, happy) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    happy.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.angry.playlist_2} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.angry.playlist_2, mood, range, date, energetic) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    energetic.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.happy.playlist_2} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.happy.playlist_2, mood, range, date, happy) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    happy.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.neutral.playlist_2} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.neutral.playlist_2, mood, range, date, happy) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    happy.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.sad.playlist_3} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.sad.playlist_3, mood, range, date, party) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    party.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.angry.playlist_3} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.angry.playlist_3, mood, range, date, happy) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    happy.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.happy.playlist_3} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.happy.playlist_3, mood, range, date, energetic) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    energetic.map(music => {
                      return (
                        <Track
                          key={music.id}
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
                  <h1 className='playlist h3'>{playlistName.neutral.playlist_3} <Emoji emoji='musical-note' /></h1>
                  <i onClick={() => { this.createMoodPlaylist(spotifyID, playlistName.neutral.playlist_3, mood, range, date, party) }} className='heart pl-2 fas fa-heart'></i>
                  {
                    party.map(music => {
                      return (
                        <Track
                          key={music.id}
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
        {this.state.showPopup ? this.showPopup(this.state.playlistName, this.state.playlistHref) : null}
      </div >
    )
  }
}
