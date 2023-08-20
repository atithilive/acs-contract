const { BaseAsset } = require("lisk-sdk");
const {createHotelAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens,createHotelToken}=require("../atithi")
// extend base asset to implement your custom asset
class CreateHotelAsset extends BaseAsset { 
    name = "createHotel";
    id = 2;
    schema=createHotelAssetSchema

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        if(!senderAccount.atithi.superAdmin){
            throw new Error("Not authorised to add city");
        }

        const allTokens=await getAllTokens(stateStore)

        const hotel=createHotelToken({
            name: asset.name,
            cityId: asset.cityId,
            nonce: transaction.nonce,
            location: asset.location,
            
        })
        allTokens.hotels.push(hotel)
        await setAllTokens(stateStore,allTokens)

    }
}

module.exports = CreateHotelAsset;