const { BaseAsset } = require("lisk-sdk");
const {addManagerAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens}=require("../atithi")

// extend base asset to implement your custom asset
class AddManagerAsset extends BaseAsset { 
    name = "addManager";
    id = 0;
    schema = addManagerAssetSchema

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress =transaction.senderAddress
        const senderAccount = await stateStore.account.get(senderAddress);
        const managerAccount=await stateStore.account.get(asset.managerAddress)
        if (senderAccount.atithi.superAdmin ==false){
            throw new Error("Not a superadmin");
        }
        const allTokens = await getAllTokens(stateStore);
        const hotels=allTokens.hotels
        const cities=allTokens.cities
        const hotelIndex = hotels.findIndex((t) => t.id.equals(asset.hotelId));
        if (hotelIndex < 0) {
            throw new Error("hotel id not found");
        }
        const hotel=hotels[hotelIndex]
        
        hotel.managers.push(asset.managerAddress)
        hotels[hotelIndex]=hotel
        allTokens.hotels=hotels
        await setAllTokens(stateStore,allTokens)
        managerAccount.atithi.generalDetails.hotelId=asset.hotelId
        await stateStore.account.set(asset.managerAddress,managerAccount)

    }
}

module.exports = AddManagerAsset;