import React, { Component } from 'react';

export default class Suggestion extends Component {
  constructor(props) {
    super(props)
    this.video = React.createRef();
    this.canvas = React.createRef();
    const hash = window.location.hash.substr(1).split('&')
    const hashDecompose = hash[0].split('=')
    const access_token = hashDecompose[1]
    this.state = { 
      access_token: access_token,
      results: []
    }
  }

  componentDidMount() {
    this.getSpotifyTracks()
  }

  getSpotifyTracks = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=20`, {
      headers: {
        'Authorization': 'Bearer ' + this.state.access_token
      }
    })

    const response = await apiCall.json()
    this.setState({
      results: response.items
    })
    console.log('RESULTS =>', this.state.results)
    // response.items.map(results => { console.log(results.name) })
  }

  render() {
    return (
      <div className='container-fluid bg-light mt-5 mb-5 p-3 shadow'>
        <h1 className='text-center py-3 shadow'>Spotify Top Tracks</h1>
        {this.state.results.map(results => { return (<ol key={results.name}>{results.name}</ol>)})}
      </div>
    )
  }
}