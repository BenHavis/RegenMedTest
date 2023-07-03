import React, { useContext, useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Typography } from '@mui/material'
import Map from '../components/Map'
import { AutoComplete, Input } from 'antd'
import styled from 'styled-components'
import { AuthContext } from '../AuthContext'
import Select from 'react-select'
import axios from 'axios'
import AsyncSelect from 'react-select/async'
import { analytics } from '../firebase'

const mainColor = '#4811ab' // Define the main color variable

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${mainColor};
  font-weight: bold;
  margin-top: 16px;
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
`

const Container = styled.div`
  min-height: calc(100vh - 64px); /* Subtract the height of the navbar (assuming it's 64px) */
  background-color: #f2f2f2;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Adjust the vertical alignment to start from the top */
  align-items: center;
  margin-top: 100px; /* Increase the margin-top value to move the content further down */

  .link {
    text-decoration: none;
    color: ${mainColor};
    font-weight: bold;
    margin-top: 16px;
  }
`

const ProfileWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-left: 2rem;
`

const MapContainer = styled.div`
  flex: 1;
  margin-right: 2rem;
`

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 80%; /* Adjust the width value to make the cards wider */

	.select-dropdown {
  appearance: none;
  background-color: #f2f2f2;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.select-dropdown:focus {
  outline: none;
  box-shadow: 0 0 0 2px #bfbfbf;
}

  @media (max-width: 768px) {
    width: 100%;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  color: ${mainColor};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
  }
`

const Card = styled.section`
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  transition: background-color 0.3s, color 0.3s;
  padding: 12px;
  margin-bottom: 16px;
  width: 60%;
	border-radius: 1rem;

  a {
    color: ${mainColor};
    text-decoration: none;
    font-weight: bold;
    margin-top: 16px;
  }

  &:hover {
    background-color: ${mainColor};
    color: white;

    a {
      color: white;
    }

    button {
      color: white;
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${mainColor};
    font-weight: bold;
    margin-top: 16px;
    padding: 8px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }
`;

const Profile = () => {
  const { loggedIn, currentUser } = useContext(AuthContext)
  const [options, setOptions] = useState([])
  const [cardStates, setCardStates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
	const [profileId, setProfileId] = useState(``)


  console.log('current user from profile:', currentUser)
  let currentUserID
  try {
    const jsonUser = JSON.parse(currentUser)
    console.log('jsonuser', jsonUser)
    currentUserID = jsonUser.userId // Update the property name to "userId"
    console.log('current userid from json:', currentUserID)
  } catch (error) {
    console.error('Error parsing or accessing user data:', error)
  }

  useEffect(() => {
    const url = window.location.href // Get the current URL
    const id = url.substring(url.lastIndexOf('/') + 1) // Extract the ID from the URL

    // Make an API call to fetch the profile data using the ID
    axios
      .get(`http://regenmedglobal.com/api/profiles/${id}`)
      .then((response) => {
        console.log('Profile data:', response.data)
        const data = response.data // Assuming the response contains the profile data
				// Update the ID state variable
        setProfileId(data.id);
				
        const fieldNames = ['Name', 'Description', 'Conditions', 'Treatments', 'Website', 'Address', 'Email', 'Phone']
        const cardStates = fieldNames.map((fieldName) => ({
          editMode: false,
          fieldName,
          fieldValue: data[fieldName.toLowerCase()] || '' // Assuming the profile data is in the form of fieldName: value
        }))
        setCardStates(cardStates)
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error)
        // Handle the error case here
        // Perform any necessary error handling or display an error message
      })
  }, [])

  const handleAddTreatment = (event, index) => {
    const selectedTreatment = event.target.value
    setCardStates((prevState) => {
      const updatedCardStates = [...prevState]
      const fieldValue = updatedCardStates[index].fieldValue

      if (fieldValue) {
        updatedCardStates[index].fieldValue = `${fieldValue.trim()}, ${selectedTreatment}`
      } else {
        updatedCardStates[index].fieldValue = selectedTreatment
      }

      return updatedCardStates
    })
  }

	const handleConditionChange = (selectedOption, index) => {
		setCardStates((prevCardStates) => {
			const updatedCardStates = [...prevCardStates];
			updatedCardStates[index].fieldValue = selectedOption;
			return updatedCardStates;
		});
	};
	
	const loadOptions = async (inputValue, callback) => {
		try {
			const response = await axios.get(
				`https://clinicaltables.nlm.nih.gov/api/conditions/v3/search?terms=${encodeURIComponent(
					inputValue
				)}&maxList=7`
			);
			const suggestions = response.data[3].map((label) => ({
				value: label,
			}));
			callback(suggestions);
		} catch (error) {
			console.log('Error retrieving autocomplete suggestions:', error);
			callback([]);
		}
	};


  const handleSearch = async (value) => {
    setSearchTerm(value)

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

  const handleCloseClick = (index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates]
      updatedCardStates[index].editMode = false
      return updatedCardStates
    })
  }

  const handleEditClick = (index) => {
    console.log('Clicked on Edit for card index:', index)

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates]
      updatedCardStates[index].editMode = true
      return updatedCardStates
    })
  }

  const handleSaveClick = (index) => {
    const url = window.location.href // Get the current URL
    const id = url.substring(url.lastIndexOf('/') + 1) // Extract the ID from the URL

    console.log('URL:', url) // Log the URL
    console.log('ID:', id) // Log the ID
    console.log('Saving value:', cardStates[index].fieldValue) // Log the value being saved

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates]
      updatedCardStates[index].editMode = false
      return updatedCardStates
    })

    // Determine the field name based on the index
    let fieldName
    switch (index) {
      case 0:
        fieldName = 'name'
        break
      case 1:
        fieldName = 'description'
        break
      case 2:
        fieldName = 'conditions'
        break
      case 3:
        fieldName = 'treatments'
        break
      case 4:
        fieldName = 'website'
        break
      case 5:
        fieldName = 'address'
        break
      case 6:
        fieldName = 'email'
        break
      case 7:
        fieldName = 'phone'
        break
        // Add more cases for other fields if needed
      default:
        break
    }

    // Make the API call to update the profile with the provided ID and field value
    axios
      .put(
				`http://regenmedglobal.com/api/profiles/${id}`,
				{ field: fieldName, value: cardStates[index].fieldValue },
				{ headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        console.log('Request:', { field: fieldName, value: cardStates[index].fieldValue }) // Log the request data
        console.log('Response:', response.data) // Log the response data
        // Handle the success case here
        // Perform any necessary actions or display a success message
      })
      .catch((error) => {
        console.error('Error updating profile:', error)
        // Handle the error case here
        // Perform any necessary error handling or display an error message
      })
  }

  const handleInputChange = (event, index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates]
      updatedCardStates[index].fieldValue = event.target.value
      console.log('updated card states: ', updatedCardStates) // Move this line before the return statement
      return updatedCardStates
    })
  }

	const renderFieldValue = (fieldName, fieldValue, editMode, index) => {
		if (fieldName === 'Conditions' && !editMode) {
			return fieldValue.split(',').map((condition, i) => (
				<span key={i}>
					{condition.trim()}
					{i !== fieldValue.split(',').length - 1 && ', '}
				</span>
			));
		} else if (fieldName === 'Website' && !editMode) {
			return <a href={fieldValue}>{fieldValue}</a>;
		} else if (fieldName === 'Email' && !editMode) {
			return <a href={`mailto:${fieldValue}`}>{fieldValue}</a>;
		} else {
			return fieldValue;
		}
	};
	


  console.log('cardStates:', cardStates)

  if (cardStates.length === 0) {
    return (
      <Container>
        <h3>No profile data available.</h3>
      </Container>
    )
  }

	console.log('profileid: ', profileId)
  return (
    <Container>
      {loggedIn && currentUser.firstTimeLogin && (
        <Typography variant='h4' component='h4' sx={{ mb: 2 }}>
          Welcome back, {currentUser.name}!
        </Typography>
      )}
      <ProfileWrapper>
        <MapContainer>
          <Map address={cardStates[5].fieldValue} />
        </MapContainer>
				<CardContainer>
  {cardStates.map((cardState, index) => (
    <Card key={index}>
      <h3>{cardState.fieldName}:</h3>
      {cardState.editMode ? (
        <div>
          {cardState.fieldName === 'Treatments' && (
            <div>
              <select className="select-dropdown" onChange={(event) => handleAddTreatment(event, index)}>
                <option value="">Select a treatment</option>
                <option value="PRP">PRP</option>
                <option value="Prolotherapy">Gene Therapy</option>
                <option value="Stem">Stem Cell</option>
              </select>
            </div>
          )}
          <input
            type="text"
            value={cardState.fieldValue}
            onChange={(event) => handleInputChange(event, index)}
          />
          <button onClick={() => handleSaveClick(index)}>Save</button>
          <button onClick={() => handleCloseClick(index)}>Close</button>
        </div>
      ) : (
        <div>
          {cardState.fieldName === 'Treatments' ? (
            <div>
              {cardState.fieldValue.split(',').map((treatment, i) => (
                <span key={i}>
                  {treatment.trim()}
                  {i !== cardState.fieldValue.split(',').length - 1 && ', '}
                </span>
              ))}
              {loggedIn && currentUserID === profileId && (
                <div>
                  <EditButton onClick={() => handleEditClick(index)}>
            
                    Edit
                  </EditButton>
                </div>
              )}
            </div>
          ) : (
            <div>
              {renderFieldValue(cardState.fieldName, cardState.fieldValue, cardState.editMode, index)}
              {loggedIn && currentUserID === profileId && (
                <EditButton onClick={() => handleEditClick(index)}>
               
                  Edit
                </EditButton>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  ))}
</CardContainer>

      </ProfileWrapper>
      {!loggedIn && (
        <Link className='link' to='/results'>
          Return to Results
        </Link>
      )}
    </Container>
  )
}

export default Profile
