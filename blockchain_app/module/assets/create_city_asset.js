const { BaseAsset } = require("lisk-sdk");
const {createCityAssetSchema}=require("../schemas")
const {getAllTokens,setAllTokens,createCityToken}=require("../atithi")


function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}
// extend base asset to implement your custom asset
class CreateCityAsset extends BaseAsset { 
    name = "createCity";
    id = 1;
    schema = createCityAssetSchema

    async apply({ asset, stateStore, reducerHandler, transaction }){
        // console.log(asset,"backend se asset")
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        const allTokens=await getAllTokens(stateStore)
        if (!senderAccount.atithi.superAdmin){
            throw new Error("Not authorised to add city");
        }
        const city=createCityToken({
            name:asset.name,
            state:asset.state,
            country:asset.country,
            nonce:transaction.nonce
        })
        if (isEmptyObject(allTokens)) {
            allTokens["cities"]=[city]
        }else{
            const c=allTokens.cities
            c.push(city)
            allTokens.cities=c
        }
        
        
        await setAllTokens(stateStore,allTokens)
        
    }
}

module.exports = CreateCityAsset;