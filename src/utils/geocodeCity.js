const axios = require('axios')
const { GOOGLE_MAPS_API_KEY } = require('../config')

const geocodeCity = async (city, state, country) => {
  try {
    const address = `${city}, ${state}, ${country}`
    const encodedAddress = encodeURIComponent(address)
    const apiKey = 'AIzaSyBsY7TWsifdD_oYfwhEKBqVdLzfBaSeu6A'

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    )

    const results = response.data.results
    console.log('geocode results:', results)

    if (results && results.length > 0) {
      const result = results[0]
      const { lat, lng } = result.geometry.location
      return { latitude: lat, longitude: lng }
    } else {
      console.log('No results found for the city:', city, state, country)
      return null
    }
  } catch (error) {
    console.log('Error geocoding:', error)
    return null
  }
}

module.exports = {
  geocodeCity: geocodeCity
}
