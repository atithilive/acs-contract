const { BaseAsset } = require("lisk-sdk");
const {removeManagerAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens}=require("../atithi")
// extend base asset to implement your custom asset
class RemoveManagerAsset extends BaseAsset { 
    name = "removeManager";
    id = 4;
    schema=removeManagerAssetSchema
    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);
        if(!senderAccount.atithi.superAdmin){
            throw new Error("Not authorised to remove manager");
        }

        const allTokens=await getAllTokens(stateStore)
        const hotelTokenIndex = allTokens.hotels.findIndex((t) => t.id.equals(asset.hotelId));
        if (hotelTokenIndex < 0) {
            throw new Error("Token id not found");
          }
        const hotels=allTokens.hotels
        const hotel=hotels[hotelTokenIndex]
        if (!hotel.managers.includes(senderAddress)) {
            throw new Error("Not the manager of this hotel");
        }
        hotel.manager.splice(senderAddress,1)
        hotels[hotelTokenIndex]=hotel
        allTokens.hotels=hotels
        await setAllTokens(stateStore,allTokens)

        managerAccount=await stateStore.account.get(asset.managerAddress)
        
        managerAccount.atithi.generalDetails.hotelId=Buffer.from("")
        await stateStore.account.set(asset.managerAddress,managerAccount)

    }
}

module.exports = RemoveManagerAsset;