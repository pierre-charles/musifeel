import React from 'react'
import moment from 'moment'

const Track = (props) => {
  return (
    <div>
      <hr />
      <div className='row'>
        <div className='col-md-3 col-sm-12'>
          <img className='pb-2 pr-2' width='100' height='100' src={props.albumArt} alt={props.name} />
        </div>
        <div className='col-md-9 col-sm-12 m-0'>
          <p className='h5 m-0 font-weight-bold'>{props.name}</p>
          <p className='h6 m-0 color-secondary'>{props.albumName}</p>
          <p className='h6 m-0 color-tertiary'>{props.artist}</p>
          {props.lastPlayed && <p className='h6 color-tertiary'>Last played: {moment(props.lastPlayed).format("ddd, Do MMM YYYY, hh:mm a")}</p>}
        </div>
      </div>
    </div>
  )
}

export default Track