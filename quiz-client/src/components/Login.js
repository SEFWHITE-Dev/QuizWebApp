import { Box, Button, Card, CardContent, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Center from './Center'
import useForm from '../hooks/useForm'
import { createAPIEndpoint, ENDPOINTS } from '../api'
import useStateContext from '../hooks/useStateContext'
import { useNavigate } from 'react-router-dom'


const getFreshModel = () =>({
  name: '',
  email: '',
  maxQuestions: 5
})



// sx to apply styles to components

export default function Login() {

  const { context, setContext, resetContext } = useStateContext();
  const navigate = useNavigate();

  const { 
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange
  } = useForm(getFreshModel);

  useEffect(() => {
    resetContext()
  }, []);

  const login = e => {
    e.preventDefault();
    if (validate()) {
      createAPIEndpoint(ENDPOINTS.participant)
      .post(values)
      .then(res => {
        setContext({ participantId:res.data.participantId, maxQuestions: values.maxQuestions })
        navigate('/quiz');
        
      })
      .catch(err => console.log(err))
    }
  }

  const validate = () => {
    let temp = {};
    temp.email = (/\S+@\S+\.\S+/).test(values.email) ? "" : "Please enter a valid Email.";
    temp.name = values.name != "" ? "" : "This field is required.";

    setErrors(temp);
    return Object.values(temp).every(x => x=== "");
  }

  const signInAsGuest = () => {
    // Use dummy guest info
    const guestInfo = { name: "Guest", email: "guest@example.com" };

    createAPIEndpoint(ENDPOINTS.participant)
      .post(guestInfo)
      .then(res => {
        setContext({ participantId: res.data.participantId, maxQuestions: values.maxQuestions });
        navigate('/quiz');
      })
      .catch(err => console.log(err))
  }

  return (
    <Center>
      {context.participantId}
      <Card sx={{ width:400 }}>
        <CardContent sx={{ textAlign:"center" }}>
          <Typography variant='h3' sx={{ my:3 }}>Quiz App</Typography>
          <Box sx={{
            '&  .MuiTextField-root':{
              m:1,
              width: '90%'
            }
          }}>
            <form noValidate autoComplete="off" onSubmit={login}>
              <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              variant="outlined"
              {...(errors.email && {error:true, helperText:errors.email})} 
              />

              <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              variant="outlined" 
              {...(errors.name && {error:true, helperText:errors.email})} 
              />
              
              {/* Dropdown for Max Questions */}
              <Select
                name="maxQuestions"
                value={values.maxQuestions}
                onChange={handleInputChange}
                variant="outlined"
                displayEmpty
                sx={{ m: 1, width: '90%' }}
              >
                {/* Generate options: 5, 10, 15, 20, 25, 30 */}
                {[5, 10, 15, 20, 25, 30].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Questions
                  </MenuItem>
                ))}
              </Select>

              <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{width:'90%'}}
              >Start</Button>

              <Button
                variant="outlined"
                size="large"
                sx={{ width: '90%', mt: 2 }}
                onClick={signInAsGuest}
              >START Quiz as Guest</Button>

            </form>
          </Box>

        </CardContent>
      </Card>
    </Center>
  )
}
