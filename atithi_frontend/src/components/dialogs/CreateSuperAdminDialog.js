import React, { useState,useContext } from 'react'
import { transactions, codec, cryptography } from "@liskhq/lisk-client";

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {NodeInfoContext} from "../../context"
import { createSuperadminToken } from '../../utils/transactions/makeSuperadmin';
import * as api from "../../api"
function CreateSuperAdminDialog(props) {
    const [data,setData]=useState({
      accountId:"",
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
        const accountId=cryptography.getAddressFromBase32Address(data.accountId)
        const res = await createSuperadminToken({
          accountId,
          passphrase:data.passphrase,
          networkIdentifier: nodeInfo.networkIdentifier
          });
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
              label="address"
              name="accountId"
              value={data.addressId}
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
          <Button onClick={handleSend}>Create Superadmin</Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
  )
}

export default CreateSuperAdminDialog