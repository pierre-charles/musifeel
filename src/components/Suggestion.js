import React, { Component } from 'react';
import '../stylesheets/App.scss';

export default class Suggestion extends Component {
  constructor(props) {
    super(props)
    this.video = React.createRef();
    this.canvas = React.createRef();
    const hash = window.location.hash.substr(1).split('&')
    const hashDecompose = hash[0].split('=')
    const access_token = hashDecompose[1]
    this.state = { access_token: access_token }
  }

  componentDidMount() {
    this.getSpotifyTracks()
  }

  getSpotifyTracks = async () => {
    const apiCall = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=100`, {
      headers: {
        'Authorization': 'Bearer ' + this.state.access_token
      }
    })

    const response = await apiCall.json()
    response.items.map(results => { console.log(results.name) })
  }

  render() {
    return (
      <div className='col-11 col-lg-6 col-md-8 container bg-light mt-5 mb-5 p-3 shadow'>
        <h1>Suggestions!</h1>
      </div>
    )
  }
}