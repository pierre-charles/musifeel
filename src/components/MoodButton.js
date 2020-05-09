import React from 'react'
import { Link } from 'react-router-dom'
import Emoji from 'react-emojis'

const MoodButton = props => {
  const emojis = {
    happy: 'grinning-face-with-big-eyes',
    sad: 'disappointed-face',
    angry: 'angry-face',
    fearful: 'face-screaming-in-fear',
    neutral: 'neutral-face',
    disgusted: 'confounded-face',
    surprised: 'face-with-open-mouth'
  }

  if (props.emotion === 'unknown') return (
    <div className='text-center my-3'>
      <p>Scanning your mood <i className='ml-2 fas fa-spinner fa-spin'></i></p>
    </div>
  )
  return (
    <div className='text-center my-3'>
      <p>Your mood is: {props.emotion}</p>
      <div className='h2'>
        {props.emotion === 'neutral' && <Emoji emoji={emojis.neutral} />}
        {props.emotion === 'happy' && <Emoji emoji={emojis.happy} />}
        {props.emotion === 'sad' && <Emoji emoji={emojis.sad} />}
        {props.emotion === 'angry' && <Emoji emoji={emojis.angry} />}
        {props.emotion === 'surprised' && <Emoji emoji={emojis.surprised} />}
        {props.emotion === 'fearful' && <Emoji emoji={emojis.fearful} />}
        {props.emotion === 'disgusted' && <Emoji emoji={emojis.disgusted} />}
      </div>
      <Link to={{ pathname: `/playlists` }}>
        <button type='button' className='button-next mt-5 mb-3'>Make my playlists!<i className='pl-2 fas fa-headphones'></i></button>
      </Link>
    </div>
  )
}

export default MoodButton
