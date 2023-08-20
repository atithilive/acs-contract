const { BaseAsset } = require("lisk-sdk");
const {userCheckInOutAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens}=require("../atithi")
// extend base asset to implement your custom asset
class UserCheckInAsset extends BaseAsset { 
    name = "userCheckIn";
    id = 7;
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
        if (user.status=="active"){
            throw new Error("cant checkin as  the user is already checkedin to a hotel")
        }
        if(!hotel.managers.includes(senderAddress)){
            throw new Error("Not authorised")
        }
        
        user.status="active"
        user.hotelId=asset.hotelId
        hotel.users.push(asset.awn)
        hotels[hotelIndex]=hotel
        users[userTokenIndex]=user
        allTokens.users=users
        allTokens.hotels=hotels
        await setAllTokens(stateStore,allTokens)
        // await stateStore.account.set(asset.userId,user)
    }
}

module.exports = UserCheckInAsset;