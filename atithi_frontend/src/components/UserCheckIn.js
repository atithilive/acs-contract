import React, { useState,useContext } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import "./css/user.css"
import * as api from "../api"
import { NodeInfoContext } from '../context';
import {createUserCheckIn} from '../utils/transactions/user_check_in'
function UserCheckIn() {
    const [data,setData]=useState({
        awn:"",
        hotelId:"",
        passphrase:""
    })

    const handleChange=(event)=>{
        setData({ ...data, [event.target.name]: event.target.value });
    }
    const nodeInfo = useContext(NodeInfoContext);
    const handleSubmit=async (event)=>{
        event.preventDefault();
      // const accountId=cryptography.getAddressFromBase32Address(data.accountId)
      const res = await createUserCheckIn({
        awn:data.awn,
        hotelId:data.hotelId,
        passphrase:data.passphrase,
        networkIdentifier: nodeInfo.networkIdentifier
        });
        console.log(res.tx," yahan tak chala")
        await api.sendTransactions(res.tx);
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