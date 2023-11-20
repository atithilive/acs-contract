import React,{useEffect,useContext,useState} from 'react'
import './css/singleHotel.css'
import {getUserFromHotelTokens} from "../api"
import { useLocation,useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { NodeInfoContext } from '../context';
import * as api from "../api"
import { passphrase, cryptography } from "@liskhq/lisk-client";
import {createUserCheckOut} from '../utils/transactions/userCheckOut'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function SingleHotel(props) {
    let location = useLocation();
    let navigate = useNavigate();
    const allUsers=(location.state.users);
    const [managerPasscode,setManagerPasscode]=useState()
    const [awn,setAwn]=useState()
    const [open, setOpen] = useState(false)

    const handleChange = (event) => {
        setManagerPasscode( event.target.value );
      };

      const handleClose = () => {
        setOpen(false);
      };

    const handleSubmit=async (awn)=>{
        setAwn(awn)
        setOpen(true);
    }
    const [userTokens, setUserTokens] = useState([])
   
    useEffect(() => {
        async function fetchData() {
          try {
            // setUserTokens(await getUserFromHotelTokens());
            let a=await getUserFromHotelTokens(allUsers);
            setUserTokens(a)
            console.log(a)
          } catch (error) {
            setUserTokens([]); 
          }
        }
        fetchData();
        // console.log(userTokens)
      }, []);
      const nodeInfo = useContext(NodeInfoContext);


      async function checkoutButton(){
        const res = await createUserCheckOut({
            awn:awn,
            hotelId:allUsers[0],
            passphrase:managerPasscode,
            networkIdentifier: nodeInfo.networkIdentifier
            });
        await api.sendTransactions(res.tx);
        setOpen(true);
      }
  return (
    <div className='singleHotelContainer'>
        <div className='singleHotelContainerTop'>
<IconButton onClick={()=>navigate('/guest/checkin')}>
        <AddIcon/>
        </IconButton>
        </div>
        
            <table className='singleHoteltable'>
                <tr className='singleHoteltr'>
                    <th className='singleHotelth'>Name</th>
                    <th className='singleHotelth'>AWN</th>
                    <th className='singleHotelth'>Mobile number</th>
                    <th className='singleHotelth'>Email</th>
                </tr>
                {Array.isArray(userTokens) ? (
    userTokens.length > 0 ? (
        userTokens.map((val) => (
            <tr className='singleHoteltr' key={val.awn}>
                <td className='singleHoteltd'>{val.name}</td>
                <td className='singleHoteltd'>{val.awn}</td>
                <td className='singleHoteltd'>{val.email}</td>
                <td className='singleHoteltd'>{val.mobileNumber}</td>
                <Button variant="contained" onClick={()=>handleSubmit(val.awn)}>Check out</Button>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="4">No user tokens available</td>
        </tr>
    )
) : (
    <tr>
        <td colSpan="4">Invalid userTokens data type. Expected an array.</td>
    </tr>
)}
            </table>

            <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Enter The passcode of the manager
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <TextField fullWidth label="Address"  name="address" value={managerPasscode} onChange={handleChange}/>
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button> */}
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
          <Button onClick={checkoutButton} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
        </div>
  )
}

export default SingleHotel