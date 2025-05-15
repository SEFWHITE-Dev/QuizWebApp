import { Grid, Item } from '@mui/material'
import React from 'react'

export default function Center(props) {
  return (
    <Grid
      container
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight:'100vh' }}>
        
      <Grid item xs={1}>
        { props.children }
      </Grid>
      {/* <Grid size={1}>
        <Item>
          { props.children }
        </Item>
      </Grid> */}

    </Grid>
  )
}
