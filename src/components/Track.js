import React from 'react'

const Track = (props) => {
  return (
    <div className='row mb-3'>
      <div className='col-4'>
        <img width='70' height='70' src={props.albumArt} alt={props.name} />
      </div>
			<div className='col-8 px-0 m-0'>
				<p className='h5 m-0 font-weight-bold'>{props.name}</p>
				<p className='h6 m-0 text-secondary'>{props.artist}</p>
			</div>
    </div>
    )
}

export default Track