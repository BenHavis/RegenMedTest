import React from 'react'
import PropTypes from 'prop-types'

const Card = ({ header, body }) => {
  return (
    <div className='w-64 bg-white rounded-lg shadow-md mx-4 p-4'>
      <h2 className='text-xl font-semibold mb-2'>{header}</h2>
      <p className='text-gray-700'>{body}</p>
    </div>
  )
};

Card.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
}

export default Card
