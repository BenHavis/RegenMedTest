import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { Layout, Pagination, Input, Form, Button, Select, Progress as Antprogress, AutoComplete, Checkbox as AntCheckbox } from 'antd'
import { getDistance } from 'geolib'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import LinearProgress from '@mui/material/LinearProgress'
import styled from 'styled-components'
import PlacesAutocomplete from 'react-places-autocomplete' // Make sure to remove the unnecessary empty braces
import Result from './Result'
import ResultsMap from './ResultsMap'
import Sort from './Sort'
const { GOOGLE_MAPS_API_KEY, API_ENDPOINT } = require('../config.js')

const StyledForm = styled(Form)`
  width: 40%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`

const AutocompleteContainer = styled.div`
  position: relative;
  width: 13rem;
  margin-right: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .location-search-input {
    width: 100%;
  }

  .autocomplete-dropdown-container {
    position: absolute;
    top: 100%;
    width: 100%;
    max-height: 10rem;
    overflow-y: auto;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    z-index: 10;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  button {
    margin: 0 5px 5px 0;
  }
`

const { Option } = Select
const PAGE_SIZE = 10

const Results = () => {

	const geocodeCity = async (city, state, country) => {
		try {
			const address = `${city}, ${state}, ${country}`
			const encodedAddress = encodeURIComponent(address)
			const apiKey =  GOOGLE_MAPS_API_KEY
	
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

  const [sortOrder, setSortOrder] = useState('distance')
  const { state } = useLocation()
  const [radius, setRadius] = useState(25)
  const [results, setResults] = useState([])
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(-1)
  const [currentResults, setCurrentResults] = useState([])
  const [sortedResults, setSortedResults] = useState([])
	const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [checkboxOptions, setCheckboxOptions] = useState(
    state?.checkedOptions ?? [
      { label: 'PRP', value: 'PRP', checked: false },
      { label: 'Stem Cell', value: 'Stem', checked: false },
      { label: 'Prolotherapy', value: 'Prolotherapy', checked: false }
    ]
  )
  const [page, setPage] = useState(1)
  const [filterTerm, setFilterTerm] = useState(state?.searchTerm ?? '')

  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState(state?.location ?? '')
  const [userLocation, setUserLocation] = useState(null)
  const [filterCoordinates, setFilterCoordinates] = useState(null)



  const handleSearch = async (value) => {
    setFilterTerm(value)

    try {
      const response = await axios.get(
				`https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${encodeURIComponent(
					value
				)}&maxList=7`
      )
      const suggestions = response.data[3].map((label) => ({
        value: label
      }))
      console.log('Autocomplete suggestions:', suggestions)
      setOptions(suggestions)
    } catch (error) {
      console.log('Error retrieving autocomplete suggestions:', error)
    }
  }

  const handleAddressChange = (value) => {
    setAddress(value)
    console.log('address:', value)
  }

  const handleRadiusChange = (value) => {
    setRadius(value)
		console.log(`radius: ${radius}`)
  }

  // const collectionRef = collection(db, 'maindata')
  // const q = query(collectionRef, limit(100))
  // const [snapshot, loadingCollection, errorCollection] = useCollection(q)

  const handleCheckChange = (e) => {
    const value = e.target.value
    const checked = e.target.checked

    const updatedOptions = checkboxOptions.map((option) =>
      option.value === value ? { ...option, checked } : option
    )

    setCheckboxOptions(updatedOptions)
  }

  const handleChangePage = useCallback((page) => {
    setPage(page)
  }, [])

  const handleProfileClick = (result) => {
    console.log('Clicked result:', result)
  }

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
      } catch (error) {
        console.log('Error retrieving user location:', error)
      }
    }

    fetchUserLocation()
  }, [])

  const handleButtonClick = (value) => {
    const updatedOptions = checkboxOptions.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option
    )
    setCheckboxOptions(updatedOptions)
    localStorage.setItem('checkboxOptions', JSON.stringify(updatedOptions))
  }

  const handleInputChange = useCallback((e) => {
    const searchTerm = e.target.value
    setFilterTerm(searchTerm)
  }, [])

  const fetchResults = async () => {
		try {
			console.log('Fetching results...');
			const locationArray = address.split(',');
			const city = locationArray[0]?.trim();
			const state = locationArray[1]?.trim();
			const country = locationArray[2]?.trim();
	
			console.log('City:', city);
			console.log('State:', state);
			console.log('Country:', country);
			console.log('Filter Term:', filterTerm);
			console.log('Checkbox Options:', checkboxOptions);
	

			const response = await axios.get(`${API_ENDPOINT}/data`, {
				params: {
					filterTerm: String(filterTerm).toLowerCase(), // Convert to string and then apply toLowerCase()
					checkboxOptions: checkboxOptions
						.filter((option) => option.checked)
						.map((option) => option.value.toLowerCase()),
					city: city,
					state: state,
					country: country,
					maxDistance: radius
				},
			});
	
			// Process the response data
			const filteredResults = response.data;
			console.log('Filtered results:', filteredResults);
	
			setResults(filteredResults);
			setPage(1);
		} catch (error) {
			console.log('Error retrieving search results:', error);
			// Add error handling here, such as showing an error message to the user or setting a specific state variable to indicate the error.
		}
	};
	

	
  useEffect(() => {
    console.log('Running useEffect for filterTerm, checkboxOptions, and address...')
    console.log('Address:', address) // Add this line to log the address
    fetchResults()
  }, [filterTerm, checkboxOptions, address, radius])


  useEffect(() => {
    const locationArray = address.split(',')
    if (locationArray.length >= 3) {
      const city = locationArray[0]?.trim()
      const state = locationArray[1]?.trim()
      const country = locationArray[2]?.trim()

      if (city && state && country) {
        const getGeocodedAddress = async () => {
          const geocodedAddress = await geocodeCity(city, state, country)
          console.log('geocodedAddress:', JSON.stringify(geocodedAddress))
          setFilterCoordinates(geocodedAddress)
        }

        getGeocodedAddress()
      } else {
        console.log('Invalid address format:', address)
      }
    } else {
      console.log('Invalid address:', address)
    }
  }, [address])

  useEffect(() => {
    if (results.length >= 0) {
      setLoading(false)
    }
  }, [results])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
        },
        (error) => {
          console.log('Error retrieving user location:', error)
        }
      )
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }, [])

	useEffect(() => {
		console.log('Current sorted results:', sortedResults);
	
		// Update currentResults based on sortedResults
		const startIndex = (page - 1) * PAGE_SIZE;
		const endIndex = startIndex + PAGE_SIZE;
		const slicedResults = sortedResults.slice(startIndex, endIndex);
		setCurrentResults(slicedResults);
	}, [sortedResults, page]);

	useEffect(() => {
		const sortResults = () => {
			let sorted = [];
	
			if (sortOrder === 'distance') {
				console.log('Sorting by distance...');
				sorted = results.map((result) => {
					const distance = getDistance(
						{ latitude: userLocation.latitude, longitude: userLocation.longitude },
						{ latitude: result.latitude, longitude: result.longitude }
					);
					return { ...result, distance };
				});
				sorted.sort((a, b) => a.distance - b.distance);
			} else if (sortOrder === 'asc') {
				console.log('Sorting in ascending order...');
				sorted = [...results];
				sorted.sort((a, b) => a.name.localeCompare(b.name));
			} else if (sortOrder === 'desc') {
				console.log('Sorting in descending order...');
				sorted = [...results];
				sorted.sort((a, b) => b.name.localeCompare(a.name));
			}
	
			return sorted;
		};
	
		const updateSortedResults = () => {
			const sorted = sortResults();
	
			setPage(1);
	
			// Update sortedResults state
			setSortedResults(sorted);
	
			// Update currentResults based on sortedResults
			const startIndex = (page - 1) * PAGE_SIZE;
			const endIndex = startIndex + PAGE_SIZE;
			const slicedResults = sorted.slice(startIndex, endIndex);
			setCurrentResults(slicedResults);
		};
	
		updateSortedResults();
	}, [results, sortOrder, userLocation, page]);
	



  if (loading) {
    return (
      <Suspense fallback={<Antprogress percent={50} status='active' />}>
        <LinearProgress color='secondary' />
      </Suspense>
    )
  }
  console.log('USer location:', userLocation)
	console.log(`results: `, results)
	console.log(`Current results:`, currentResults)
	console.log(`sorted results:`, sortedResults)
	console.log(`radius: `, radius)
  return (
    <Layout className='results'>
      <h1>Results</h1>

      <section className='results-section'>
        <section className='search'>
          <h4>Search</h4>
          <AutoComplete
            style={{ width: '450px', height: '50px' }}
            value={filterTerm}
            options={options}
            onSelect={(value) => setFilterTerm(value)}
            onSearch={handleSearch}
            placeholder='Search medical conditions'
          />

          <SearchContainer className='location-search'>
            <StyledForm>
              <Form.Item style={{ width: '40%', margin: '0 auto' }}>
                <PlacesAutocomplete
                value={address}
                onChange={handleAddressChange}
                searchOptions={{
									  types: ['(cities)'] // Limit suggestions to cities only
              }}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <AutocompleteContainer>
                <Input
                style={{ width: '15rem' }}
                {...getInputProps({
												  placeholder: 'Enter a location...',
												  className: 'location-search-input'
              })}
              />
                <div className='autocomplete-dropdown-container'>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
												  const className = suggestion.active
												    ? 'suggestion-item--active'
												    : 'suggestion-item'
                // inline style for demonstration purpose
                const style = suggestion.active
												    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
												    : { backgroundColor: '#ffffff', cursor: 'pointer' }
                return (
                <div
                {...getSuggestionItemProps(suggestion, {
															  className,
															  style
              })}
              >
                <span>{suggestion.description}</span>
              </div>
												  )
              })}
              </div>
              </AutocompleteContainer>
              )}
              </PlacesAutocomplete>
              </Form.Item>
              <Form.Item>
                <Select
                value={radius}
                onChange={handleRadiusChange}
                style={{ width: '100%', marginTop: '10px' }}
              >
                <Option value={25}>25 miles</Option>
                <Option value={50}>50 miles</Option>
                <Option value={100}>100 miles</Option>
                <Option value={500}>500 miles</Option>
              </Select>
              </Form.Item>
              {/* <Form.Item>
                <Button type='primary' htmlType='submit'>
                Search
								</Button>
              </Form.Item> */}
            </StyledForm>
          </SearchContainer>
          <Sort sortOrder={sortOrder} onSortOrderChange={setSortOrder} />

          <ButtonContainer>
            {checkboxOptions.map((option) => (
              <Button
                key={option.value}
                type={option.checked ? 'primary' : 'default'}
                onClick={() => handleButtonClick(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonContainer>
          <ResultsMap style={{ width: '20%' }} results={results} />
        </section>

        <section className='results-list'>
          {currentResults.length > 0 ? (
            <section className='results-list'>
              {currentResults.map((result, index) => (
                <Result
                result={result}
                key={result.id}
                onProfileClick={handleProfileClick}
                isSelected={selectedMarkerIndex === index}
              />
              ))}
              <Pagination
                total={currentResults.length}
                pageSize={PAGE_SIZE}
                current={page}
                onChange={handleChangePage}
              />
            </section>
          ) : (
            <div>No results found.</div>
          )}
        </section>
      </section>
    </Layout>
  )
}

export default Results