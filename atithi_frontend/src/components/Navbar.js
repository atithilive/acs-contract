import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate=useNavigate()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          
          <Typography onClick={()=>navigate("/")} variant="h6" color="inherit" sx={{ flexGrow: 1 }} component="div">
            <Button color="inherit">Atithi</Button>
          </Typography>
          
          <Button color="inherit" onClick={()=>navigate("/account")}>Account</Button>
          <Button color="inherit" onClick={()=>navigate("/cities")}>Cities</Button>
          <Button color="inherit" onClick={()=>navigate("/hotels")}>Hotels</Button>
          <Button color="inherit" onClick={()=>navigate("/guestUser")}>Guest Users</Button>
        </Toolbar>
      </AppBar>
      <div>
        
      </div>
    </Box>
  );
}