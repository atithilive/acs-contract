import React,{ useEffect, useState} from 'react'
import {getCitiesTokens} from "../api"

import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Button from '@mui/material/Button';
import { FileCopy as FileCopyIcon } from '@mui/icons-material';
function Cities() {
  const navigate=useNavigate()
    const [cityTokens, setCityTokens] = useState([])
    const handleCopyClick = (id) => {
      // Copy the id to the clipboard
      navigator.clipboard.writeText(id);
    };

    useEffect(() => {
        async function fetchData() {
          try {
            setCityTokens(await getCitiesTokens());
            
          } catch (error) {
            setCityTokens([]); 
          }
        }
        fetchData();
      }, []);
    // console.log(cityTokens)

const handleTableRowClick=(e)=>{
  console.log(e)
  navigate(`/cityHotel/${e}`)
}

  return (
  
<div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px', // Adjust the gap between cards as needed
      }}>
{cityTokens.length > 0 ? (
  cityTokens.map((item)=>{
    return <Card sx={{ maxWidth: 345,ml:4,mt:4,flex: '1 0 300px' }}>
    <CardActionArea>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.state}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.country}
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
            Cities
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No cities data found at this moment. Consider creating a city first.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
)}
</div>
  )
}

export default Cities