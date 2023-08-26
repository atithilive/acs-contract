const { BaseModule } = require("lisk-sdk");
const {atithiModuleSchema}=require("./schemas")
const AddManagerAsset=require("./assets/add_manager_asset")
const AddUserAsset=require("./assets/add_user_asset")
const CreateCityAsset=require("./assets/create_city_asset")
const CreateHotelAsset=require("./assets/create_hotel_asset")
const MakeSuperAdminAsset=require("./assets/make_superadmin_asset")
const RemoveManagerAsset=require("./assets/remove_manager_asset")
const RemoveSuperAdminAsset=require("./assets/remove_superadmin_asset")
const UserCheckInAsset=require("./assets/user_check_in_asset")
const UserCheckOutAsset=require("./assets/user_check_out_asset")
const {getAllTokensAsJSON}=require("./atithi")
class AtithiModule extends BaseModule {
    name='atithi'
    id=1024
    accountSchema=atithiModuleSchema
    transactionAssets=[new AddManagerAsset(),new AddUserAsset(),new CreateCityAsset(),new CreateHotelAsset(),new MakeSuperAdminAsset(),new RemoveManagerAsset(),new RemoveSuperAdminAsset(),new UserCheckInAsset(),new UserCheckOutAsset()]
    // 
    actions = {
        // get all the registered NFT tokens from blockchain
        getAllTokens: async () => getAllTokensAsJSON(this._dataAccess),
      };

}

module.exports = { AtithiModule };