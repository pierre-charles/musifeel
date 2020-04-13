import React from 'react';
import Scan from './Scan'
import Login from './Login'
import Playlists from './Playlists'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import '../stylesheets/App.scss'

const App = () => {
  return (
    <Router forceRefresh={true}>
      <div>
        <Route path='/' exact component={Login} />
        <Route path='/scan' exact component={Scan} />
        <Route path='/playlists' exact component={Playlists} />
      </div>
    </Router>
  )
}

export default App