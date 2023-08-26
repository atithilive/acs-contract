const { BaseAsset } = require("lisk-sdk");
const {addUserAssetSchema}=require("../schemas")
const {createUserToken,getAllTokens,setAllTokens}=require("../atithi")
// extend base asset to implement your custom asset

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
class AddUserAsset extends BaseAsset { 
    name = "addUser";
    id = 6;
    schema=addUserAssetSchema

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);
        const transactionHotelId=senderAccount.atithi.generalDetails.hotelId

        const allTokens=await getAllTokens(stateStore)

        const user=createUserToken({
            name:asset.name,
            email:asset.email,
            mobileNumber:asset.mobileNumber,
            nonce:transaction.nonce
        })
        if (isEmptyObject(allTokens)) {
            allTokens["users"]=[user]
        }else{
            const c=allTokens["users"]
            c.push(user)
            allTokens["users"]=c
        }

        // allTokens.user.push(user)
        await setAllTokens(stateStore,allTokens)
    }
}

module.exports = AddUserAsset;