const { BaseAsset } = require("lisk-sdk");
// extend base asset to implement your custom asset
const {makeRemoveSuperAdmin}=require("../schemas")
class MakeSuperAdminAsset extends BaseAsset { 
    name = "makeSuperadmin";
    id = 3;
    schema=makeRemoveSuperAdmin

    async apply({ asset, stateStore, reducerHandler, transaction }){
        const senderAddress=transaction.senderAddress
        const senderAccount=await stateStore.account.get(senderAddress)
        // const accountAddress=asset.accountId
        // const account=await stateStore.account.get(accountAddress)
        
        if (senderAccount.atithi.superAdmin==true){
            throw new Error("Already a super admin");
        }
        if (senderAccount.atithi.superAdmin==true){
            throw new Error("Already a super admin");
        }
        senderAccount.atithi.superAdmin=true
        
        await stateStore.account.set(senderAddress,senderAccount)
    }
}

module.exports = MakeSuperAdminAsset;