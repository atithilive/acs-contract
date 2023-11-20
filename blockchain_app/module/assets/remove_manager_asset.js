const { BaseAsset } = require("lisk-sdk");
const {removeManagerAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens}=require("../atithi")
// extend base asset to implement your custom asset

function compareByteArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}
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
        
        // if (!hotel.managers.includes(asset.managerAddress)) {
        //     throw new Error("Not the manager of this hotel");
        // }
        let isManager = false;

        for (const manager of hotel.managers) {
            if (compareByteArrays(manager, asset.managerAddress)) {
                isManager = true;
                break;
            }
        }

        if (!isManager) {
            throw new Error("Not the manager of this hotel");
        }
        hotel.managers.splice(asset.managerAddress,1)
        // hotel.managers=[]
        hotels[hotelTokenIndex]=hotel
        allTokens.hotels=hotels
        console.log('After removing',hotels)
        await setAllTokens(stateStore,allTokens)

        let managerAccount=await stateStore.account.get(asset.managerAddress)
    
        managerAccount.atithi.generalDetails.hotelId=Buffer.from('')
        await stateStore.account.set(asset.managerAddress,managerAccount)
    }
}

module.exports = RemoveManagerAsset;