import React from 'react'
import { Layout } from 'antd'
import { Link, Routes, Route } from 'react-router-dom';


const Result = ({ result}) => {
	const { reviewcount, name, city, state, country, specialty, id } = result;
	return (
		<Layout className='result-card'>
  
	<Link to={`/profile/${id}`}><h4>{name}</h4></Link>
  <p className='review-count'>{`${reviewcount} reviews`}</p>
  <p>{`${city}, ${state}, ${country}`}</p>
  <p>{specialty}</p>
</Layout>

	)
}

export default Result
