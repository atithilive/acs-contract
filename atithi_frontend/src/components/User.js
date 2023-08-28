import React, { useState } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { fetchAccountInfo } from '../api';
import axios from 'axios'
import "./css/user.css"
import { cryptography } from "@liskhq/lisk-client";
import {url1} from "../api"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function User() {
    const [address, setaddress] = useState("");
    const [account, setAccount] = useState({});
    const [open, setOpen] = useState(false)

    const handleChange = (event) => {
        setaddress( event.target.value );
      };

      const handleClose = () => {
        setOpen(false);
      };

    const handleSubmit=async ()=>{
        const binaryAddress = cryptography.getAddressFromBase32Address(address).toString('hex')
        await axios.get(`${url1}/api/accounts/${binaryAddress}`)
        .then(res=>{
          try {
            setAccount(res.data);
            setOpen(true)
          } catch (error) {
            setAccount({"response":"No account was found"});
            setOpen(true)
          }
            
        }).catch(err=>{
            console.log(err.response.data)
            setAccount(err.response.data);
            setOpen(true)
        })
    }
    return (<>
        <div className='userContainer'>
            <Typography variant="h4" >
                Enter Your account details
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
                <TextField fullWidth label="Address" id="fullWidth" name="address" value={address} onChange={handleChange}/>
                {/* <TextField fullWidth label="PassPhrase" id="fullWidth" name="pass" value={data.pass} onChange={handleChange} /> */}
                
                <Button onClick={handleSubmit} variant="contained">Submit</Button>
               
            </Stack>
            
            <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Account information for address ${address}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* {JSON.stringify(account)} */}
            <pre>{JSON.stringify(account, null, 2)}</pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
     

        </div>
    </>
    )
}

export default User