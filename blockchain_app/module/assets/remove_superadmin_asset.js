const { BaseAsset } = require("lisk-sdk");
const {makeRemoveSuperAdmin}=require("../schemas")
// extend base asset to implement your custom asset
class RemoveSuperAdminAsset extends BaseAsset { 
    name = "removeSuperadmin";
    id = 5;
    schema=makeRemoveSuperAdmin

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress=transaction.senderAddress
        const senderAccount=await stateStore.account.get(senderAddress)
        if (senderAccount.atithi.superAdmin==true){
            throw new Error("you need to be a superadmin first");
        }
        senderAccount.atithi.superAdmin=false
        
        await stateStore.account.set(senderAddress,senderAccount)
        
    }
}

module.exports = RemoveSuperAdminAsset;