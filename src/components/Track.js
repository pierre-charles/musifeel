import React from 'react'
import moment from 'moment'

const Track = (props) => {
  return (
    <div className='row mb-3'>
      <div className='col-md-3 col-sm-12'>
        <img className='pb-2 pr-2' width='100' height='100' src={props.albumArt} alt={props.name} />
      </div>
      <div className='col-md-9 col-sm-12 m-0'>
        <p className='h5 m-0 font-weight-bold'>{props.name}</p>
        {props.albumName && <p className='h6 m-0 color-tertiary'>{props.albumName}</p>}
        <p className={props.albumName ? 'h6 m-0 color-secondary' : 'h6 m-0 color-tertiary'}>{props.artist}</p>
        {props.lastPlayed && <p className='h6 color-secondary'>Last played: {moment(props.lastPlayed).format("ddd, Do MMM YYYY, hh:mm a")}</p>}
      </div>
    </div>
  )
}

export default Track