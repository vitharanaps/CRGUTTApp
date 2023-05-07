import { AppBar, Avatar, Badge, IconButton, Toolbar, Typography } from '@mui/material'
import { Box, width } from '@mui/system'
import React, { useContext } from 'react'
// import { NotificationsIcon, SettingsIcon, LogoutIcon } from '@mui/icons-material';

import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/AuthContext';


const Navbar = () => {
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)
  return (
    <AppBar>
        <Toolbar>
            <Box sx={style.leftContainer} >
                <Typography variant='h6' color="#fff" >
                    CRGU TT Management System
                </Typography>
            </Box>
            <Box sx={{ flexGrow :1  }}/>
            <Box sx={style.rightContainer}>
            <IconButton title='NOtifictions' >
                    <Badge badgeContent={4} color="error">
                        <NotificationsIcon sx={{ color: "#fff"}}  />
                    </Badge>
                </IconButton>
                <IconButton title='NOtifictions'sx={{ color: "#fff"}}>
                         <SettingsIcon />
                </IconButton>
                <IconButton title='NOtifictions' sx={{ color: "#fff"}}>
                <Avatar alt="Travis Howard" src={ currentUser?.profileImage ? currentUser?.profileImage : "/assests/avatar.png" } />
                </IconButton>

            </Box>
        </Toolbar>
    </AppBar>
    )
}

/** @type {import("@mui/material").SxProps}*/
const style={
    rightContainer:{
       
    }

}

export default Navbar