import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { Input, Button } from 'antd'
import { UserOutlined, KeyOutlined } from '@ant-design/icons'
import { AuthContext } from '../AuthContext'

import axios from 'axios'

const Container = styled.div`
  width: 80%;
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--main-color);
`

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`

const StyledForm = styled.form`
  .input-group {
    margin-bottom: 15px;
  }

  .btn-login {
    width: 100%;
  }

  .signup-text {
    text-align: center;
    margin-top: 20px;
  }
`

const IconWrapper = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  color: rgba(0, 0, 0, 0.25);
`
const DoctorLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault();
	
		try {
			// Make a POST request to the server to verify the login credentials
		//	const response = await axios.post('http://localhost:3000/login', { email, password });
			const response = await axios.post('http://regenmedglobal.com/login', { email, password });
			// Log the response
			console.log('Login response:', response);
	
			// Handle the response based on the server's authentication logic
			if (response.status === 200) {
				// Login successful
				const id = response.data.userId;
				login({ userData: JSON.stringify(response.data), id });
	
				console.log('Login successful');
	
				// Redirect to the user's profile page
				const userData = { ...response.data }; // Include loggedIn property
				navigate(`/profile/${id}`, { state: userData });
			} else if (response.status === 401) {
				// Login failed with "Invalid email or password" error
				console.log('Login failed: Invalid email or password');
				// Display the error message to the user
				setError('Invalid email or password');
			} else {
				// Login failed with an unknown error
				console.log('Login failed: Unknown error');
				// Display a generic error message to the user
				setError('Login failed. Please try again.');
			}
		} catch (error) {
			// Handle any errors that occur during the request
			console.error('Error during login:', error);
			// Display a generic error message to the user
			setError('An error occurred. Please try again later.');
		}
	};

  return (
    <Container>
      <Title>Sign In</Title>
      <StyledForm onSubmit={handleSubmit}>
        <div className='input-group'>
          <IconWrapper>
            <UserOutlined />
          </IconWrapper>
          <Input
            type='text'
            name='email'
            placeholder='Email'
            prefix={<UserOutlined />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='input-group'>
          <IconWrapper>
            <KeyOutlined />
          </IconWrapper>
          <Input.Password
            type='password'
            name='password'
            placeholder='Password'
            prefix={<KeyOutlined />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && error}
        <Button className='btn-login' type='primary' htmlType='submit'>
          Login
        </Button>
        <p className='signup-text'>
  {/* Don't have an account? <Link to='/register'>Sign Up</Link> or <Link to='/claim'>claim your profile</Link> */}
	Don't have an account? <Link to='/register'>Sign Up</Link>
</p>
      </StyledForm>
    </Container>
  )
}

export default DoctorLogin
