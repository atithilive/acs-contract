import React, { useState,useContext } from 'react'
import { transactions, codec, cryptography } from "@liskhq/lisk-client";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {NodeInfoContext} from "../../context"
import { createCityToken } from '../../utils/transactions/create_city_token';
import * as api from "../../api"

function CreateCityDialog(props) {
  const [data,setData]=useState({
    name:"",
    state:"",
    country:"",
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
      const res = await createCityToken({
          // accountId,
          name:data.name,
          state:data.state,
          country:data.country,
          passphrase:data.passphrase,
          networkIdentifier: nodeInfo.networkIdentifier
        });
        console.log(res," yahan tak chala")
        await api.sendTransactions(res.tx);
        props.handleClose();
  }
  return (
    <Dialog open={props.open} onBackdropClick={props.handleClose} fullWidth >
        <DialogTitle id="alert-dialog-title">
          {"Enter the address"}
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
              label="state"
              name="state"
              value={data.state}
              fullWidth
              sx={{
                margin: 1,
              }}
              onChange={handleChange}
            />
            <TextField
              label="country"
              name="country"
              value={data.country}
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
          <Button onClick={handleSend}>Create City</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
  )
}

export default CreateCityDialog