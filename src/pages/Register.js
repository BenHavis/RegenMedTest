import React, { useState, useEffect } from 'react'
import { useForm, Controller, reset } from 'react-hook-form'
import styled from 'styled-components'
import axios from 'axios'
import { TextField, Button, Snackbar, Typography, InputAdornment, MenuItem } from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { states, countries } from '../config'
import Select from 'react-select'


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: var(--main-color);
  padding: 20px;
`
const StyledControllerContainer = styled.div`
  margin-bottom: 1rem;

  /* Added styles for positioning */
  position: relative;
  z-index: 0;

  /* Added styles for dropdown container */
  .country-dropdown-container {
    position: relative;
    z-index: 9999;
  }

  /* Added styles for dropdown menu */
  .react-dropdown-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 99999;
    margin-top: 4px;
  }
`


const FormContainer = styled.div`
  width: 100%;
  max-width: 45%;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
	const { control, handleSubmit, formState: { errors }, getValues, reset } = useForm({
		defaultValues: {
			treatments: [] // Set initial value as an empty array
		}
	});
	
  const [errorMessage, setErrorMessage] = useState('')
	const [dropdownHeight, setDropdownHeight] = useState(null);

	useEffect(() => {
		const menu = document.getElementsByClassName('react-dropdown-select-dropdown')[0];
		if (menu) {
			setDropdownHeight(menu.offsetHeight);
		}
	}, []);
 
  // Function to set the error message
  const handleSetErrorMessage = (message) => {
    setErrorMessage(message)
  }

  const onSubmit = async (data) => {
    try {
			const treatments = data.treatments.join(',') // Convert treatments array to string
			const requestData = { ...data, treatments } // Add treatments to the request data
			console.log('Request Body from front end:', JSON.stringify(requestData))
			const response = await axios.post('http://regenmedglobal.com/data', requestData, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
	
			if (response.status === 200) {
        // Data inserted successfully
        setSuccessMessage('Registration Successful. Thank you for signing up!')
				setOpenSnackbar(true)

				reset()
			} else {
        // Request was successful, but data insertion failed
        handleSetErrorMessage('Registration Failed. Please try again.')
			}
    } catch (error) {
      console.error('Error inserting data:', error)
			handleSetErrorMessage('Registration Failed. Please try again.')
		}
  }
	

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

	const handleTreatmentSelection = (selectedTreatments, treatmentType, field) => {
		console.log('Selected Treatments before:', selectedTreatments);
	
		let updatedTreatments = [...selectedTreatments];
		
		// Check if the treatment type is already selected
		const treatmentIndex = updatedTreatments.indexOf(treatmentType);
		
		if (treatmentIndex > -1) {
			// Treatment is already selected, remove it
			updatedTreatments.splice(treatmentIndex, 1);
			console.log('Removed Treatment:', treatmentType);
		} else {
			// Treatment is not selected, add it
			updatedTreatments.push(treatmentType);
			console.log('Added Treatment:', treatmentType);
		}
		
		console.log('Updated Treatments:', updatedTreatments);
		
		// Update the field value
		field.onChange(updatedTreatments);
	};
	
	

  const Alert = React.forwardRef(function Alert (props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
  })

  return (
    <Container>
      <FormContainer>
        <Title>Sign Up</Title>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields */}
          <StyledControllerContainer>
            <Controller
              name='clinicName'
              control={control}
              defaultValue=''
              rules={{ required: 'Clinic Name is required' }}
              render={({ field }) => (
                <TextField
                  label='Clinic Name'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  required
                  error={Boolean(errors.clinicName)}
                  helperText={errors.clinicName ? errors.clinicName.message : ''}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    console.log('Clinic values:', e.target.value)
                  }}
                />
              )}
            />

          </StyledControllerContainer>

          <StyledControllerContainer>
            <Controller
              name='description'
              control={control}
              defaultValue=''
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  label='Description'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  required
                  error={Boolean(errors.description)}
                  helperText={errors.description ? errors.description.message : ''}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    console.log('Description values:', e.target.value)
                  }}
                />
              )}
            />
          </StyledControllerContainer>

          <StyledControllerContainer>
            <Controller
              name='conditions'
              control={control}
              defaultValue=''
              rules={{ required: 'Conditions/Diseases treated is required' }}
              render={({ field }) => (
                <TextField
                  label='Conditions/Diseases treated'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  required
                  error={Boolean(errors.treatment)}
                  helperText={errors.treatment ? errors.treatment.message : ''}
                  {...field}
                />
              )}
            />
          </StyledControllerContainer>

          <StyledControllerContainer>
            <Controller
              name='treatments'
              control={control}
              defaultValue={[]}
              rules={{ required: 'At least one Treatment Type must be selected' }}
              render={({ field }) => (
                <div>
                  <label>Treatments</label>
                  <div>
									<Button
  variant={field.value.includes('PRP') ? 'contained' : 'outlined'}
  color='primary'
  onClick={() => handleTreatmentSelection(field.value, 'PRP', field)}
>
  PRP
</Button>
<Button
  variant={field.value.includes('Stem Cell') ? 'contained' : 'outlined'}
  color='primary'
  onClick={() => handleTreatmentSelection(field.value, 'Stem Cell', field)}
>
  Stem Cell
</Button>
<Button
  variant={field.value.includes('Prolotherapy') ? 'contained' : 'outlined'}
  color='primary'
  onClick={() => handleTreatmentSelection(field.value, 'Prolotherapy', field)}
>
  Prolotherapy
</Button>

                  </div>
                  {/* Add more buttons for different treatments */}
                </div>
              )}
            />
            {errors.treatments && <p>{errors.treatments.message}</p>}
          </StyledControllerContainer>

          <StyledControllerContainer>
            <Controller
              name='address'
              control={control}
              defaultValue=''
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <TextField
                  label='Address'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  required
                  error={Boolean(errors.address)}
                  helperText={errors.address ? errors.address.message : ''}
                  {...field}
                  onChange={(e) => {
									  field.onChange(e)
                    console.log('Address values:', e.target.value)
                  }}
                />
              )}
            />
          </StyledControllerContainer>

          <StyledControllerContainer>
  <Controller
        name='country'
        control={control}
        defaultValue=''
        rules={{ required: 'Country is required' }}
        render={({ field }) => (
          <TextField
  label='Country'
  variant='outlined'
  style={{ width: '25rem' }}
  required
  error={Boolean(errors.country)}
  helperText={errors.country ? errors.country.message : ''}
  select
  {...field}
  SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: '30vh'
        }
      }
    }
  }}
>
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
     </StyledControllerContainer>

          <StyledControllerContainer>
  <Controller
        name='state'
        control={control}
        defaultValue=''
        rules={{ required: 'State is required' }}
        render={({ field }) => (
          <TextField
            label='State'
            variant='outlined'
            style={{ width: '25rem' }}
            required
            error={Boolean(errors.state)}
            helperText={errors.state ? errors.state.message : ''}
            select
            {...field}
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
     </StyledControllerContainer>

          <StyledControllerContainer>
  <Controller
              name='city'
              control={control}
              defaultValue=''
              rules={{ required: 'City is required' }}
              render={({ field }) => (
                <TextField
                  label='City'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  required
                  error={Boolean(errors.city)}
                  helperText={errors.city ? errors.city.message : ''}
                  {...field}
                />
              )}
            />
     </StyledControllerContainer>

          <StyledControllerContainer>
            <Controller
              name='phone'
              control={control}
              defaultValue=''
              rules={{ required: 'Phone is required' }}
              render={({ field }) => (
                <TextField
                  label='Phone'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  required
                  error={Boolean(errors.phone)}
                  helperText={errors.phone ? errors.phone.message : ''}
                  {...field}
                  onChange={(e) => {
									  field.onChange(e)
                    console.log('Phone values:', e.target.value)
                  }}
                />
              )}
            />
          </StyledControllerContainer>

          <StyledControllerContainer>
  <Controller
              name='website'
              control={control}
              defaultValue=''
              rules={{ required: 'Website is required' }}
              render={({ field }) => (
                <TextField
                  label='Website'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  rules={{
									  pattern: {
									    value: /^(ftp|http|https):\/\/[^ "]+$/,
									    message: 'Invalid website URL'
									  }
									}}
                  error={Boolean(errors.website)}
                  helperText={errors.website ? errors.website.message : ''}
                  {...field}
                  onChange={(e) => {
									  field.onChange(e)
                    console.log('Website values:', e.target.value)
                  }}
                />
              )}
            />
     </StyledControllerContainer>

          <StyledControllerContainer>
					<Controller
  name="email"
  control={control}
  defaultValue=""
  rules={{
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email format',
    },
  }}
  render={({ field }) => (
    <>
      <TextField
        label="Email"
        variant="outlined"
        style={{ width: '25rem' }}
        required
        error={Boolean(errors.email)}
        helperText={errors.email ? errors.email.message : ''}
        {...field}
        onChange={(e) => {
          field.onChange(e);
          console.log('Email values:', e.target.value);
        }}
      />
      <Typography variant="caption" color="textSecondary">
        Your email will be used as your username
      </Typography>
    </>
  )}
/>

          </StyledControllerContainer>

          <StyledControllerContainer>
            <Controller
              name='confirmEmail'
              control={control}
              defaultValue=''
              rules={{
                required: 'Confirm Email is required',
                validate: (value) =>
                  value === getValues('email') || 'Email and Confirm Email must match'
              }}
              render={({ field }) => (
                <TextField
                  label='Confirm Email'
                  variant='outlined'
                  style={{ width: '25rem' }}
                  fullWidth
                  required
                  error={Boolean(errors.confirmEmail)}
                  helperText={errors.confirmEmail ? errors.confirmEmail.message : ''}
                  {...field}
                />
              )}
            />
          </StyledControllerContainer>

					<StyledControllerContainer>
  <Controller
    name='password'
    control={control}
    defaultValue=''
    rules={{ required: 'Password is required' }}
    render={({ field }) => (
      <TextField
        label='Password'
        variant='outlined'
        style={{ width: '25rem' }}
        required
        error={Boolean(errors.password)}
        helperText={errors.password ? errors.password.message : ''}
        {...field}
        type='password'
        onChange={(e) => {
          field.onChange(e);
          console.log('Password values:', e.target.value);
        }}
      />
    )}
  />
</StyledControllerContainer>


<StyledControllerContainer>
  <Controller
    name='confirmPassword'
    control={control}
    defaultValue=''
    rules={{
      required: 'Confirm Password is required',
      validate: (value) =>
        value === getValues('password') || 'Password and Confirm Password must match',
    }}
    render={({ field }) => (
      <TextField
        label='Confirm Password'
        variant='outlined'
        style={{ width: '25rem' }}
        fullWidth
        required
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
        {...field}
        type='password'
      />
    )}
  />
</StyledControllerContainer>

          <div>
            <Button type='submit' variant='contained' color='primary'>
              Sign Up
            </Button>
          </div>
        </form>

        {/* Snackbar */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity='success'>
            {successMessage}
          </Alert>
        </Snackbar>
      </FormContainer>
    </Container>
  )
}

export default Register
