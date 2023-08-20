# Atithi Compliance System

## Introduction


## Process


## Modules
One module (‘atithi’) is created in this project with id 1024 and several assets are created to change the state of an account or chain statestore.
### Chain statestore
A chainStore is created of type
```
        "registeredAtithiTokens" : {
                                    "cities" : [ ],
                                    "hotels" : [ ],
                                    "users" : [ ]
                                  }
```
### Assets
* ####  create city asset
An account with superAdmin field as “True” can add a new city to the registeredAtithiTokens[“cities”] array.  Fields required for creating a new city are “name”, “state”, “country”. We can get the address of the person creating a new city from transaction details.  “id” of the city is a unique hex code  generated using the “name”, ”state”, ”country” fields and “hotelIds” is an empty array by default.
* #### create hotel asset
  An account with superAdmin field as “True” can create a new hotel  and add it to registeredAtithiTokens[“hotels”] array. Fields required to create a new hotel are “name”, “cityId” and “location”. “id” of the hotel is a unique hex code generated using the “name”, ”cityId”, and ”location” fields. “users” array is empty by default. “managers” will be an empty array by default. SuperAdmin can create a new manager and the address of the manager will be added to this field. The newly created hotel will be added to the registeredAtithiTokens[“hotels”] array.
* #### add manager asset
  An account with superAdmin field as “True” can add a manager which will be linked to a hotel. Fields required to add a new manager are “name”, “mobileNumber”, “email” and “hotelId”. “hotelId” is the Id of the hotel that the manager has been linked to. If the conditions are met then the manager address is added to the managers array field of the hotel state store.
* #### remove manager asset
  Fields required are “managerId” and “hotelId”.. The managerId will be removed from the array of managers of a hotel. And “hotelId” will be removed from the manager account atithi[“generalDetails”][“hotels”] 
* #### add user asset
   When a user wants to check into a hotel the manager can check if the user is registered or not. If not registered he can create a new user by providing his “name”, “email”, “mobileNumber”  and “awn”. When the user has been created the default value of some additional  fields are “isVerified” = False, “status” = ”inactive”  and “hotelId” = “ ”.
The newly created user will be added to the registeredAtithiTokens[“users”].
* #### user check in asset
  A manager of a hotel is authorized to make a user check in to a hotel. Fields provided to do this are “hotelId” and “awn”. First it is checked that the person making the transaction is a manager of a hotel or not. If the person making the transaction is a manager of the hotel with id “hotelId” then the “userId” is added to the hotel users array in the state store. And the user with “awn” in registeredAtithiTokens[“users”] is updated in the following manner. “hotelId”=”hotelId” and “status”=”active”. If the user “status” state was “active” before the user_check_in_asset he first needed to do a user_check_out_asset and then user_check_in_asset again. 
* #### user check out asset
   A manager of a hotel is authorized to make a user check out of a hotel. Fields provided to do this are “hotelId” and “awn”. First it is checked that the person making the transaction is a manager of a hotel or not. If the person making the transaction is a manager of the hotel with id “hotelId'' then the “userId” is removed from the hotel users array. And the user with “awn” in registeredAtithiTokens[“users”] is updated in the following manner. “hotelId”=” ” and “status”=”inactive” . If the user “status” state was “inactive” before the user_check_out_asset he first needs to do a user_check_in_asset and then user_check_out_asset  again.
* #### make superadmin asset
This asset is just for testing purposes so that a user superadmin field can be changed and a user will be able to add cities to the registeredAtithiTokens[“cities”] array.
* #### remove superadmin asset
   This asset is just for testing purposes so that a user superadmin field can be changed.
### Plugins
* #### User history
* #### Hotel History


