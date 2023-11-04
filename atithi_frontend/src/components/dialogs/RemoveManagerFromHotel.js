import React, { useState,useContext,useEffect } from 'react'
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { passphrase, cryptography } from "@liskhq/lisk-client";
import DialogActions from '@mui/material/DialogActions';
import "../css/user.css"
import { NodeInfoContext } from '../../context';
import * as api from "../../api"
// import { AddManagerToken } from '../../utils/transactions/addManager';
import {RemoveManagerToken} from '../../utils/transactions/removeManager';
function RemoveManagerFromHotel(props) {
    const [data,setData]=useState({
        managerAddress:"",
        hotelId:"",
        passphrase:""
    })

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            hotelId: props.hotelId // Replace "newHotelId" with the actual new hotelId value
          }))
      }, [props.open]);
    const handleChange=(event)=>{
        setData({ ...data, [event.target.name]: event.target.value });
    }
    const nodeInfo = useContext(NodeInfoContext);
    const handleSend=async (event)=>{
        event.preventDefault();
      // const accountId=cryptography.getAddressFromBase32Address(data.accountId)
      const accountId=cryptography.getAddressFromBase32Address(data.managerAddress)
      const res = await RemoveManagerToken({
        managerAddress:accountId,
        hotelId:data.hotelId,
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
          {"Enter the following details"}
        </DialogTitle>
        <DialogContent >
          <form noValidate autoComplete="off"  >
            <TextField
              label="Hotel Id"
              value={data.hotelId}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Manager Account Id"
              name="managerAddress"
              value={data.managerAddress}
              fullWidth
              onChange={handleChange}
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Passphrase"
              name="passphrase"
              value={data.passphrase}
              fullWidth
              onChange={handleChange}
              sx={{
                margin: 1,
              }}
            />
          </form>
          <DialogActions>
          <Button onClick={handleSend}>Remove Manager</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
  )
}

export default RemoveManagerFromHotel