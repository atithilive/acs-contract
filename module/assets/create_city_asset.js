const { BaseAsset } = require("lisk-sdk");
const {createCityAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens,createCityToken}=require("../atithi")
// extend base asset to implement your custom asset
class CreateCityAsset extends BaseAsset { 
    name = "createCity";
    id = 1;
    schema = createCityAssetSchema

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        const allTokens=getAllTokens(stateStore)
        if (!senderAccount.atithi.superAdmin){
            throw new Error("Not authorised to add city");
        }
        const city=createCityToken({
            name:asset.name,
            state:asset.state,
            country:asset.country,
            nonce:transaction.nonce
        })
        allTokens.cities.push(city)
        await setAllTokens(stateStore,allTokens)
        
    }
}

module.exports = CreateCityAsset;