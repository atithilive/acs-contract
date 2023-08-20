import React,{useState, useEffect } from 'react'

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { passphrase, cryptography } from "@liskhq/lisk-client";


function CreateAccountDialog(props) {
    const [data, setData] = useState({ passphrase: "", address: "" });
    useEffect(() => {
        const pw = passphrase.Mnemonic.generateMnemonic();
        const address = cryptography.getBase32AddressFromPassphrase(pw).toString("hex");
        setData({ passphrase: pw, address });
      }, [props.open]);
    
  return (
    <Dialog open={props.open} onBackdropClick={props.handleClose} fullWidth >
        <DialogTitle id="alert-dialog-title">
          {"Please copy the address and passphrase"}
        </DialogTitle>
        <DialogContent >
          <form noValidate autoComplete="off"  >
            <TextField
              label="Passphrase"
              value={data.passphrase}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Address"
              value={data.address}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{
                margin: 1,
              }}
            />
          </form>
        </DialogContent>
      </Dialog>
  )
}

export default CreateAccountDialog