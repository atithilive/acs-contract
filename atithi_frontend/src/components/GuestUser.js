import React,{useEffect,useState} from 'react'
import {getUserTokens} from "../api"
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';

function GuestUser() {
    const [userTokens, setUserTokens] = useState([])
    const handleCopyClick = (id) => {
      // Copy the id to the clipboard
      navigator.clipboard.writeText(id);
    };
    useEffect(() => {
        async function fetchData() {
          try {
            setUserTokens(await getUserTokens());
            
          } catch (error) {
            setUserTokens([]); 
          }
        }
        fetchData();
      }, []);
      console.log(userTokens)
      const handleTableRowClick=(e)=>{
        console.log(e)
      }
  return (

    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px', // Adjust the gap between cards as needed
    }}>
{userTokens.length > 0 ? (
userTokens.map((item)=>{
  return <Card sx={{ maxWidth: 245,ml:4,mt:4,flex: '1 0 300px' }}>
  <CardActionArea>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {item.name}
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
        {item.awn}
      </Typography>
      <IconButton
              onClick={() => handleCopyClick(item.awn)}
              color="primary"
              aria-label="Copy ID"
              sx={{ marginLeft: '1' }} // Align the icon to the right
            >
              <FileCopyIcon />
            </IconButton>
            </div>
        <Typography variant="body2" color="text.secondary">
        {item.mobileNumber}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.email}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {item.status}
      </Typography>
      <Typography variant="body2" color="text.secondary">
      {item.hotelId}
      </Typography>
      <Typography variant="body2" color="text.secondary">
      {item.isVerified}
      </Typography>
      <Button onClick={()=>handleTableRowClick(item.id)}>
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
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No Users data found at this moment. Consider creating a user first.
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
)}
</div>
    // <div>
    //     {userTokens.map((item) => (
       
    //     <div>
    //       <CardContent key={item.awn}>
    //   <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
    //   {item.awn}
    //   </Typography>
    //   <Typography variant="h5" component="div">
    //   {item.name}
    //   </Typography>
    //   <Typography sx={{ mb: 1.5 }} color="text.secondary">
    //   {item.mobileNumber}
    //   </Typography>
    //   <Typography variant="body2">
    //   {item.email}
    //   </Typography>
    //   <Typography variant="body2">
    //   {item.status}
    //   </Typography>
    //   <Typography variant="body2">
    //   {item.hotelId}
    //   </Typography>
    //   <Typography variant="body2">
    //   {item.isVerified}
    //   </Typography>
    // </CardContent>
    // <CardActions>
    //   <Button size="small">Learn More</Button>
    // </CardActions>
    // </div>
    //     ))}
    //   </div>
  )
}

export default GuestUser