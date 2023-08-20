
const { BaseAsset } = require("lisk-sdk");
const {userCheckInOutAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens}=require("../atithi")
// extend base asset to implement your custom asset
class UserCheckOutAsset extends BaseAsset { 
    name = "userCheckOut";
    id = 8;
    schema =userCheckInOutAssetSchema

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);
    
        const allTokens = await getAllTokens(stateStore);
        const hotelTokenIndex = allTokens.hotels.findIndex((t) => t.id.equals(asset.hotelId));
        if (hotelTokenIndex < 0) {
            throw new Error("Hotel id not found");
          }
    
        const userTokenIndex = allTokens.user.findIndex((t) => t.awn.equals(asset.awn));
          if (userTokenIndex < 0) {
              throw new Error("user id not found");
            }
        const hotels=allTokens.hotels
        const hotel=hotels[hotelTokenIndex]
        const users=allTokens.users 
        const user=users[userTokenIndex]  
        if (user.status=="inactive"){
            throw new Error("cant checkout as  the user is not in any  hotel")
        }
        if(!hotel.managers.includes(senderAddress)){
            throw new Error("Not authorised")
        }
        
        user.status="inactive"
        user.hotelId=Buffer.from("")
        hotel.users.push(asset.awn)
        hotels[hotelIndex]=hotel
        users[userTokenIndex]=user
        allTokens.users=users
        allTokens.hotels=hotels
        await setAllTokens(stateStore,allTokens)
        // await stateStore.account.set(asset.userId,user)
    }
}

module.exports = UserCheckOutAsset;

