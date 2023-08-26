import React, { useState,useContext } from 'react'
import { transactions, codec, cryptography } from "@liskhq/lisk-client";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {NodeInfoContext} from "../../context"
import { createHotelToken } from '../../utils/transactions/create_hotel_token';
import * as api from "../../api"

function CreateHotelDialog(props) {
  const [data,setData]=useState({
    name:"",
    cityId:"",
    location:"",
    passphrase:""
  })
  const nodeInfo = useContext(NodeInfoContext);
  // console.log(nodeInfo.networkIdentifier)
  const handleChange=(event)=>{
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  }
  const handleSend=async (event)=>{
      event.preventDefault();
      // const accountId=cryptography.getAddressFromBase32Address(data.accountId)
      const res = await createHotelToken({
          // accountId,
          name:data.name,
          cityId:data.cityId,
          location:data.location,
          passphrase:data.passphrase,
          networkIdentifier: nodeInfo.networkIdentifier
        });
        // console.log(res.tx," yahan tak chala")
        await api.sendTransactions(res.tx);
        props.handleClose();
  }
  return (
    <Dialog open={props.open} onBackdropClick={props.handleClose} fullWidth >
        <DialogTitle id="alert-dialog-title">
          {"Enter Hotel Details"}
        </DialogTitle>
        <DialogContent >
          <form noValidate autoComplete="off"  >
            <TextField
              label="name"
              name="name"
              value={data.name}
              fullWidth
              sx={{
                margin: 1,
              }}
              onChange={handleChange}
            />
            <TextField
              label="cityId"
              name="cityId"
              value={data.cityId}
              fullWidth
              sx={{
                margin: 1,
              }}
              onChange={handleChange}
            />
            <TextField
              label="location"
              name="location"
              value={data.location}
              fullWidth
              sx={{
                margin: 1,
              }}
              onChange={handleChange}
            />
            <TextField
              label="passphrase"
              value={data.passphrase}
              name="passphrase"
              fullWidth
              sx={{
                margin: 1,
              }}
              onChange={handleChange}
            />
            
          </form>
          <DialogActions>
          <Button onClick={handleSend}>Create Hotel</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
  )
}

export default CreateHotelDialog