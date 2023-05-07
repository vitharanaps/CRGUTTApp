import { Box, Typography } from '@mui/material'
import React from 'react'

const NotFound = () => {
  return (
    <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", marginTop:10, height:"100%", flexDirection:"column"}}>
       <img src='../assests/stop.png' />
    <Typography variant='h1'color="error"  >Page Not Found</Typography>
    <Typography variant='h1'color="primary"  >404</Typography>

    </Box>
   
  )
}

export default NotFound