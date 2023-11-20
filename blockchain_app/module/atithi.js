const { codec, cryptography } = require("lisk-sdk");

function generateUniqueID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomChars = Array.from({ length: 2 }, () => characters[Math.floor(Math.random() * characters.length)]);
    const timestamp = Date.now().toString(36);
    return randomChars.join('') + timestamp;
  }

// registeredAtithiTokens:{
//     cities:[{
//         "id":"",
//         "name":"",
//         "state":"",
//         "country":"",
//         "hotelIds":[]
//     }],
//     hotels:[{
//         "id":"",
//         "name":"",
//         "managers":[],
//         "cityId":"",
//         "location":"",
//         "users":[]
//     }],
//     users:[{
//          "awn":"",
//          "name":"",
//          "email":"",
//          "mobileNumber":0,
//          "status":"",
//          "hotelId":"",
//          "isVerified":""
//      }]
// }
const registeredTokensSchema = {
    $id: "lisk/atithi/registeredTokens",
    type: "object",
    required: ["registeredAtithiTokens"],
    properties: {
        registeredAtithiTokens: {
            type: "object",
            fieldNumber:1,
            // required: ["cities", "hotels","users"],
            properties: {
                cities: {
                    type: "array",
                    fieldNumber: 1,
                    items: {
                        type: "object",
                        // required: ["id", "name", "state", "country", "hotelIds"],
                        properties: {
                            id: {
                                dataType: "bytes",
                                fieldNumber: 4,
                            },
                            name: {
                                dataType: "string",
                                fieldNumber: 1,
                            },
                            state: {
                                dataType: "string",
                                fieldNumber: 2,
                            },
                            country: {
                                dataType: "string",
                                fieldNumber: 3,
                            },
                            hotelIds: {
                                type: "array",
                                fieldNumber: 5,
                                items:{
                                    dataType:'bytes'
                                }
                            },
                        },
                    }
                },
                hotels: {
                    type: "array",
                    fieldNumber: 2,
                    items: {
                        type: "object",
                        // required: ["id", "name", "managers", "cityId", "location","users"],
                        properties: {
                            id: {
                                dataType: "bytes",
                                fieldNumber: 1,
                            },
                            name: {
                                dataType: "string",
                                fieldNumber: 2,
                            },
                            managers: {
                                type: "array",
                                fieldNumber: 3,
                                items:{
                                    dataType:'bytes'
                                }
                            },
                            cityId: {
                                dataType: "bytes",
                                fieldNumber: 4,
                            },
                            location: {
                                dataType: "string",
                                fieldNumber: 5,
                            },
                            users: {
                                type: "array",
                                fieldNumber: 6,
                                items:{
                                    dataType:"string"
                                }
                            },
                        },
                    }
                },
                users: {
                    type: "array",
                    fieldNumber: 3,
                    items: {
                        type: "object",
                        // required: ["awn", "name", "email", "mobileNumber", "status","hotelId","isVerified"],
                        properties: {
                            awn: {
                                dataType: "string",
                                fieldNumber: 1,
                            },
                            name: {
                                dataType: "string",
                                fieldNumber: 2,
                            },
                            email: {
                                dataType: "string",
                                fieldNumber: 3,
                            },
                            mobileNumber: {
                                dataType: "string",
                                fieldNumber: 4,
                            },
                            status: {
                                dataType: "string",
                                fieldNumber: 5,
                            },
                            hotelId: {
                                dataType: "string",
                                fieldNumber: 6,
                            },
                            isVerified: {
                                dataType: "boolean",
                                fieldNumber: 7,
                            },
                        },
                    }
                },
            }
        }
    }
}

const CHAIN_STATE_ATITHI_TOKENS = "atithi:registeredAtithiTokens";


//id, name, state,country,hotelIds
const createCityToken = ({ nonce,name, state,country }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce);
    // Create a unique seed by using a combination of the owner account address and the current nonce of the account.
    const nameBuffer = Buffer.from(name, "utf-8");
    const stateBuffer = Buffer.from(state, "utf-8");
    const countryBuffer = Buffer.from(country, "utf-8");
    const seed = Buffer.concat([nameBuffer,stateBuffer,countryBuffer, nonceBuffer]);
    const id = cryptography.hash(seed);
  
    return {
      id,
      name,
      state,
      country,
      hotelIds:[]
    };
};


//id,name,managers,cityId,location,users
const createHotelToken = ({ name, cityId, nonce, location }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce);
    const nameBuffer = Buffer.from(name, "utf-8");
    const locationBuffer = Buffer.from(location, "utf-8");
    // Create a unique seed by using a combination of the owner account address and the current nonce of the account.
    const seed = Buffer.concat([cityId,nameBuffer,locationBuffer, nonceBuffer]);
    const id = cryptography.hash(seed);
  
    return {
      id,
      name,
      cityId,
      location,
      managers:[],
      users:[]
    };
};

const createUserToken = ({ name, email, nonce, mobileNumber }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce);
    // Create a unique seed by using a combination of the owner account address and the current nonce of the account.
    const nameBuffer = Buffer.from(name, "utf-8");
    const emailBuffer = Buffer.from(email, "utf-8");
    const mobileNumberBuffer = Buffer.from(mobileNumber, "utf-8");
    const seed = Buffer.concat([emailBuffer,nameBuffer,mobileNumberBuffer, nonceBuffer]);
    const id = cryptography.hash(seed);
  
    return {
      awn:generateUniqueID(),
      name,
      email,
      mobileNumber,
      isVerified:false,
      status:"inactive",
      hotelId:""
    };
};

const getAllTokens = async (stateStore) => {
    const registeredTokensBuffer = await stateStore.chain.get(
        CHAIN_STATE_ATITHI_TOKENS
    );
    if (!registeredTokensBuffer) {
      return [];
    }
  
    const registeredTokens = codec.decode(
      registeredTokensSchema,
      registeredTokensBuffer
    );
  
    return registeredTokens.registeredAtithiTokens;
  };
  
  const getAllTokensAsJSON = async (dataAccess) => {
    const registeredTokensBuffer = await dataAccess.getChainState(
        CHAIN_STATE_ATITHI_TOKENS
    );
  
    if (!registeredTokensBuffer) {
      return [];
    }
  
    const registeredTokens = codec.decode(
      registeredTokensSchema,
      registeredTokensBuffer
    );
  
    return codec.toJSON(registeredTokensSchema, registeredTokens)
      .registeredAtithiTokens;
  };
  
  const setAllTokens = async (stateStore, atithiTokens) => {
    
    // const sortedCities = atithiTokens.cities.sort((a, b) => a.id.compare(b.id));
    // const sortedHotels = atithiTokens.hotels.sort((a, b) => a.id.compare(b.id));
    // const sortedUsers = atithiTokens.users.sort((a, b) => a.id.compare(b.id));
    let sortedCities,sortedHotels,sortedUsers
    if (atithiTokens.hasOwnProperty("cities")) {
        // console.log("cities key exists.");
        sortedCities = atithiTokens.cities.sort((a, b) => a.id.compare(b.id));
      } else {
        // console.log("cities key is missing.");
        sortedCities=[]
      }
      
      if (atithiTokens.hasOwnProperty("users")) {
        sortedUsers = atithiTokens.users.sort((a, b) => a.awn.localeCompare(b.awn));
      } else {
        // console.log("users key is missing.");
        sortedUsers=[]
      }
      
      if (atithiTokens.hasOwnProperty("hotels")) {
        // console.log("hotels key exists.");
        sortedHotels = atithiTokens.hotels.sort((a, b) => a.id.compare(b.id));
      } else {
        // console.log("hotels key is missing.");
        sortedHotels=[]
      }
    const registeredTokens = {
      registeredAtithiTokens: {
        cities: sortedCities,
        hotels: sortedHotels,
        users: sortedUsers,
      }
    };
    
    await stateStore.chain.set(
        CHAIN_STATE_ATITHI_TOKENS,
      codec.encode(registeredTokensSchema, registeredTokens)
    );
  };
  
  module.exports={
    setAllTokens,
    getAllTokensAsJSON,
    getAllTokens,
    createHotelToken,
    createCityToken,
    registeredTokensSchema,
    CHAIN_STATE_ATITHI_TOKENS,
    createUserToken

  }