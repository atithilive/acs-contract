import axios from "axios";
export const url1="http://localhost:4000"
// export const url1="https://34.229.39.151:4000"
const url2="http://localhost:8080"
// const url2="https://34.229.39.151:8080"
export const fetchNodeInfo = async () => {
    return fetch(`${url1}/api/node/info`)
      .then((res) => res.json())
      .then((res) => res.data);
  };

export const fetchAccountInfo = async (address) => {
    return fetch(`${url1}/api/accounts/${address}`)
      .then((res) => res.json())
      .then((res) => res.data);
  };
  
export const sendTransactions = async (tx) => {
    // return fetch("http://localhost:4000/api/transactions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(tx),
    // })
    //   .then((res) => res.json())
    //   .then((res) => res.data);
    try {
      const response = await axios.post(`${url1}/api/transactions`, tx, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
    } catch (error) {
      // Handle error here if needed
      console.error(error.response);
      throw error; // Rethrow the error to the caller
    }
  };

export const getUserTokens =async()=>{
    return fetch(`${url2}/api/atithi_users_tokens`)
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
}

export const getHotelsTokens =async()=>{
    return fetch(`${url2}/api/atithi_hotels_tokens`)
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
}
export const getCitiesTokens =async()=>{
    return fetch(`${url2}/api/atithi_cities_tokens`)
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
}