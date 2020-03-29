import React, { Component } from 'react';
import Emoji from 'react-emojis'
import '../stylesheets/Playlists.scss'

export default class Playlists extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: null
    }
  }

  componentDidMount() {
    this.getSpotifyTracks()
  }

  getSpotifyTracks = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50`, {
      headers: {
        'Authorization': 'Bearer ' + this.props.match.params.token
      }
    })
  
    const response = await apiCall.json()
    this.setState({ results: response.items })
    const results = this.state.results
    console.log('RESULTS', results)
    for(let i =0; i<Object.keys(results).length; i++) {
      console.log(results[i].name)
      console.log(results[i].external_urls.spotify)
      console.log(results[i].id)
    }
  }

  render() {
    return (
      <div className='container text-white'>
        <div className='my-5 row'>
          <div className='col-sm-12 col-md-6'>
            <h1 className='h2'>Music based on your mood <Emoji emoji='musical-note' /></h1>
          </div>
          <div className='col-sm-12 col-md-6 text-right'>
            <h2 className='h6'>Current mood: happy <Emoji emoji='grinning-face-with-big-eyes' /></h2>
          </div>
        </div>
        <div className='p-1 fluid-container'>
          <h1 className='h3'>Your top tracks</h1>
          <hr />
          <div className='mt-1 row text-center'>
            <div className='col-sm-12 col-md-4'>Last month</div>
            <div className='col-sm-12 col-md-4'>Last 6 months</div>
            <div className='col-sm-12 col-md-4'>All time</div>
          </div>
        </div>
        <div className='mt-5 p-1 row text-center fluid-container'>
          <div className='col-4'>
            <h1 className='h4'>Upbeat <Emoji emoji='beaming-face-with-smiling-eyes' /></h1>
          </div>
          <div className='col-4'>
            <h1 className='h4'>Energetic <Emoji emoji='exploding-head' /></h1>
          </div>
          <div className='col-4'>
            <h1 className='h4'>Party <Emoji emoji='woman-dancing' /></h1>
          </div>
        </div>
      </div>
    )
  }
}