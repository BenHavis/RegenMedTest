import React, { useState, useEffect } from 'react'
import { Layout } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { GOOGLE_MAPS_API_KEY } from '../config'
import styled from 'styled-components'
import { getDistance } from 'geolib'

const mainColor = '#4811ab' // Define the main color variable

const StyledLayout = styled(Layout)`
  h4 {
    color: ${mainColor};
    font-weight: bold;
  }
  .result-card.selected {
    background-color: #f5f5f5; /* Add your desired gray color value */
  }
`

const apiKey = GOOGLE_MAPS_API_KEY

const Result = ({ result, isSelected, onProfileClick }) => {
  const { id, name, city, state, country, specialty, placeId, address } = result
  const [distance, setDistance] = useState('')

  useEffect(() => {
    const fetchDistance = async () => {
      // Fetch the user's current location
      const userLocation = await getUserLocation()

      // Calculate the distance between user's location and the result city
      const resultLocation = await getLocationCoordinates(city)
      const distanceInMeters = getDistance(userLocation, resultLocation)
      const distanceInMiles = distanceInMeters * 0.000621371 // Conversion factor for meters to miles

      // Set the distance state
      setDistance(distanceInMiles.toFixed(2))
    }

    fetchDistance()
  }, [city])

  // Function to get the user's current location
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          resolve({ latitude, longitude })
        },
        (error) => {
          console.error(error)
          reject(error)
        }
      )
    })
  }

  // Function to fetch coordinates of a location using Google Maps Geocoding API
	const getLocationCoordinates = async (location) => {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
		);
		const data = await response.json();
		console.log('Geocoding API response:', data); // Log the response object
		const { lat, lng } = data.results[0].geometry.location;
		console.log('Coordinates:', lat, lng); // Log the extracted coordinates
		return { latitude: lat, longitude: lng };
	};

  const navigate = useNavigate()

  const handleProfileClick = (result) => {
    console.log('Result:', result) // Log the result object
    navigate(`/profile/${id}`, { state: result })
  }


  return (
    <StyledLayout className={`result-card ${isSelected ? 'selected' : ''}`} onClick={() => handleProfileClick(result)}>
      <Link
        style={{ textDecoration: 'none' }}
      >
        <h4>{name}</h4>
      </Link>
      <p>{address}</p>
      <p>{specialty}</p>
      <p>Distance: {distance} miles</p>
      {placeId && (
        <p>
          <a href={`https://www.google.com/maps/place/?q=place_id:${placeId}`} target='_blank' rel='noopener noreferrer'>
            View on Google Maps
          </a>
        </p>
      )}
    </StyledLayout>
  )
}

export default Result