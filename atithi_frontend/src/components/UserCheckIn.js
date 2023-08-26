import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import "./css/user.css"
function UserCheckIn() {
    const [data,setData]=useState({
        awn:"",
        hotelId:"",
        passphrase:""
    })

    const handleChange=(event)=>{
        setData({ ...data, [event.target.name]: event.target.value });
    }
    const handleSubmit=()=>{
        
    }
  return (
    <div className='userContainer'>
            <Typography variant="h4" >
                Enter Your details for checkin
            </Typography>;
            <Stack
                component="form"
                sx={{
                    width: '100ch',
                }}
                spacing={2}
                noValidate
                autoComplete="off"
            >
                <TextField fullWidth label="User AWN" id="fullWidth" name="awn" value={data.awn} onChange={handleChange}/>
                <TextField fullWidth label="Hotel Id" id="fullWidth" name="hotelId" value={data.hotelId} onChange={handleChange} />
                <TextField fullWidth label="Passphrase" id="fullWidth" name="passphrase" value={data.passphrase} onChange={handleChange} />
                
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
               
            </Stack>
            </div>
  )
}

export default UserCheckIn