import React, { Fragment, useContext, useState } from "react";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { NodeInfoContext } from "../../context";
import { transfer } from "../../utils/transactions/transfer";
import * as api from "../../api";



export default function TransferFundsDialog(props) {
  const nodeInfo = useContext(NodeInfoContext);
  const [data, setData] = useState({
    recipientAddress: "",
    passphrase: "",
    amount: "",
    fee: "",
  });

  const handleChange = (event) => {
    event.persist();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const res = await transfer({
      ...data,
      networkIdentifier: nodeInfo.networkIdentifier,
      minFeePerByte: nodeInfo.minFeePerByte,
    });
    await api.sendTransactions(res.tx);
    props.handleClose();
  };

  return (
    <>
      <Dialog open={props.open} onBackdropClick={props.handleClose}>
        <DialogTitle id="alert-dialog-title">{"Transfer Funds"}</DialogTitle>
        <DialogContent>
          <form  noValidate autoComplete="off">
            <TextField
              label="Recipient Address"
              value={data.recipientAddress}
              name="recipientAddress"
              onChange={handleChange}
              fullWidth
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Amount"
              value={data.amount}
              name="amount"
              onChange={handleChange}
              fullWidth
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Fee"
              value={data.fee}
              name="fee"
              onChange={handleChange}
              fullWidth
              sx={{
                margin: 1,
              }}
            />
            <TextField
              label="Passphrase"
              value={data.passphrase}
              name="passphrase"
              onChange={handleChange}
              fullWidth
              sx={{
                margin: 1,
              }}
            />

            <Button
              onClick={() => {
                setData({
                  ...data,
                  passphrase:
                    "peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready",
                });
              }}
            >
              Use Genesis Account
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>Send Funds</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}