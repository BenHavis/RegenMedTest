import React, { useState } from 'react'
import styled from 'styled-components'
import MainBack from '../assets/newmainback4.jpg'
import { Form, Link, useNavigate } from 'react-router-dom'
import Services from './Services'
import Contact from './Contact'
import { Layout, Input as Antinput, Button as Antbutton } from 'antd'

const StyledForm = styled.form`
 
	display: flex;
	
	height: 20%;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	margin-top: 15rem;
	#search {
		width: 40%;
		height: 15%;
		
	}

	button {
		width: 20%;
		height: 20%;
	}

`

const StyledContainer = styled.div`
margin-top: 0;
    height: 90vh;
		background:url(${MainBack}); 
 background-size: cover;
 h1 {
  color: white;
  padding-top: 6rem;

 }	
`

const Main = (props) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

	const handleSearchChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/results', {
      state: {
        searchTerm: searchTerm
      }
    }) // Omit optional second argument
  }

  return (

    <Layout>
			<StyledContainer>
      <h1 className='animate__animated animate__fadeIn animate__slower'>
        Connecting Patients with Doctors of the “New Era” Medicine
      </h1>
      <StyledForm onSubmit={handleSubmit}>
        <Antinput type='text' name='search' id='search' value={searchTerm} placeholder='Search by Condition, Treatment, or Clinic' onChange={handleSearchChange} />
        <Antbutton className='main-button' type='submit'>Search</Antbutton>
      </StyledForm>
      <Services />
    </StyledContainer>
		</Layout>
  )
}

export default Main
