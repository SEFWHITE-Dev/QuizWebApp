import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useStateContext from '../hooks/useStateContext'

export default function Layout() {

  const { resetContext } = useStateContext();
  const navigate = useNavigate();

  // clear everything from the context api and navigate to the login page
  const logout = () => {
    resetContext();
    navigate("/");
  }

  return (
    <>
      <AppBar position='sticky'>
        <Toolbar sx={{width:640, m:'auto'}}>
          <Typography
            variant='h4'
            align='center'
            onClick={ () => navigate('/') } 
            sx={ { flexGrow:1, cursor:'pointer' } }>
            Quiz App
          </Typography>
          <Button onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container>
        {/* whatever we have inside the targetted component according to the current route will be
            shown in place of this Outlet*/}
        <Outlet /> 
      </Container>
    </>
  )
}
