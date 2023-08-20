import React,{ useEffect, useState} from 'react'
import {getCitiesTokens} from "../api"
function Cities() {
    const [cityTokens, setCityTokens] = useState([])
    useEffect(() => {
        async function fetchData() {
            setCityTokens(await getCitiesTokens());
        }
        fetchData();
      }, []);
    
  return (
    <div>{cityTokens.map((item) => (
        <div>item</div>
      ))}</div>
  )
}

export default Cities