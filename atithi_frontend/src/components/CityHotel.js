import React,{ useEffect, useState} from 'react'
import {getHotelsTokens} from "../api"
import { useParams } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddManagerToHotel from './dialogs/AddManagerToHotel';
import RemoveManagerFromHotel from './dialogs/RemoveManagerFromHotel';
import { useNavigate } from 'react-router-dom';

function CityHotel() {
    const {cityId}=useParams()
    const [hotelTokens, setHotelTokens] = useState([])
    const [hotelId, setHotelId] = useState()
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDialogOpenRemove, setDialogOpenRemove] = useState(false);
    const navigate=useNavigate()

    const handleCopyClick = (id) => {
      // Copy the id to the clipboard
      navigator.clipboard.writeText(id);
    };
    useEffect(() => {
        async function fetchData() {
          try {
            const tokens = await getHotelsTokens();
            setHotelTokens(tokens);
            console.log(hotelTokens)
          } catch (error) {
            setHotelTokens([]); 
          }
        }
        fetchData();
        console.log(hotelTokens)
      }, []);
      if (hotelTokens.length === 0) {
        return <div>Loading...</div>;
      }
    
      if (!hotelTokens[cityId]) {
        // If hotelTokens[cityId] is undefined, set it to an empty array
        hotelTokens[cityId] = [];
      }   

  const handleTableRowClick=(hotelId,user)=>{
    navigate(`/cityHotel/${cityId}/${hotelId}`)
  }

  const handleManagerToggle=(e,managerId)=>{
    // console.log(e)
    // console.log(managerId)
    if (managerId == null){
      setDialogOpen(true);
      setHotelId(e)
    }
    else{
      setDialogOpenRemove(true)
      setHotelId(e)
    }
    
  }
  return (
   
    <div style={{display: 'flex',flexWrap: 'wrap',gap: '20px',}}>
{hotelTokens[cityId].length > 0 ? (
hotelTokens[cityId].map((item)=>{
  return <Card sx={{ maxWidth: 345,ml:4,mt:4,flex: '1 0 300px' }}>
  <CardActionArea>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {item.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.location}
      </Typography>
      <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
      <Typography variant="body2" color="text.secondary"  style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
        {item.id}
      </Typography>
      <IconButton
                onClick={() => handleCopyClick(item.id)}
                color="primary"
                aria-label="Copy ID"
                sx={{ marginLeft: '1' }} // Align the icon to the right
              >
                <FileCopyIcon />
              </IconButton>
              </div>
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}>
              <Typography variant="body2" color="text.secondary" style={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
        Manager - {item.managers?item.managers[0]:"None"}
      </Typography>
      <IconButton
    // color={item.managers[0] ? 'red' : 'green'}
    onClick={() => item.managers[0]?handleManagerToggle(item.id,item.managers[0]):handleManagerToggle(item.id,null)}
  >
    {item.managers[0] ? <RemoveCircleOutlineIcon style={{ color: 'red' }} /> : <AddCircleOutlineIcon style={{ color: 'green' }} />}
  </IconButton>
  </div>
      {/* <Button onClick={()=>handleTableRowClick(item.id,item.users)}> */}
      <Button onClick={()=>navigate(`/cityHotel/${cityId}/${item.id}`, { state: { 'hotelId': [item.id],'cityId':[cityId] } })}>
        Show More
      </Button>
    </CardContent>
  </CardActionArea>
</Card>
})
) : (
// <div>No cities data available.</div>
<Card sx={{ maxWidth: 545,ml:"auto",mr:"auto",mt:10 }}>
    <CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Hotels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No Hotel data found at this moment. Consider creating a Hotel first.
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
)}

<AddManagerToHotel open={isDialogOpen}
						handleClose={() => {
							setDialogOpen(null);
						}}
            hotelId={hotelId}/>

<RemoveManagerFromHotel open={isDialogOpenRemove}
						handleClose={() => {
							setDialogOpenRemove(null);
						}}
            hotelId={hotelId}/>
</div>
    
  )
}

export default CityHotel