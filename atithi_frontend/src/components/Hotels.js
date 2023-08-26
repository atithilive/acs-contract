import React,{useState,useEffect} from 'react'
import { getHotelsTokens } from '../api';

function DisplayObject({ data }) {
    return (
      <pre>{JSON.stringify(data, null, 2)}</pre>
    );
  }

function Hotels() {
    const [hotelTokens, setHotelTokens] = useState([])
    useEffect(() => {
        async function fetchData() {
          try {
            setHotelTokens(await getHotelsTokens());
            
          } catch (error) {
            setHotelTokens([]); 
          }
        }
        fetchData();
      }, []);
      console.log(hotelTokens)
  return (
    <div>
       <DisplayObject data={hotelTokens} />
    </div>
  )
}

export default Hotels