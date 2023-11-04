
// function generateUniqueID() {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const randomChars = Array.from({ length: 2 }, () => characters[Math.floor(Math.random() * characters.length)]);
//     const timestamp = Date.now().toString(36);
//     return randomChars.join('') + timestamp;
// }

const addManagerAssetSchema = {
    $id: "atithi-v1/atithi/addManager",
    type: "object",
    required: ["managerAddress", "hotelId"],
    properties: {
        managerAddress: {
            dataType: "bytes",
            fieldNumber: 1,
        },
        hotelId: {
            dataType: "bytes",
            fieldNumber: 2,
        },
    },
};

const createCityAssetSchema = {
    $id: "atithi-v1/atithi/createCity",
    type: "object",
    required: ["name", "state", "country"],
    properties: {
        name: {
            dataType: "string",
            fieldNumber: 1,
        },
        state: {
            dataType: "string",
            fieldNumber: 2,
        },
        country: {
            dataType: "string",
            fieldNumber: 3,
        },
    },
}

const createHotelAssetSchema = {
    $id: "atithi-v1/atithi/createHotel",
    type: "object",
    required: ["name", "cityId", "location"],
    properties: {
        name: {
            dataType: "string",
            fieldNumber: 1,
        },
        cityId: {
            dataType: "bytes",
            fieldNumber: 2,
        },
        location: {
            dataType: "string",
            fieldNumber: 3,
        },
    },
}

const removeManagerAssetSchema = {
    $id: "atithi-v1/atithi/removeManager",
    type: "object",
    required: ["hotelId","managerAddress"],
    properties: {
        hotelId: {
            dataType: "bytes",
            fieldNumber: 1,
        },
        managerAddress: {
            dataType: "bytes",
            fieldNumber: 2,
        },
    },
}

const addUserAssetSchema = {
    $id: "atithi-v1/atithi/addUser",
    type: "object",
    required: ["name", "mobileNumber", "email"],
    properties: {
        name: {
            dataType: "string",
            fieldNumber: 1,
        },
        mobileNumber: {
            dataType: "string",
            fieldNumber: 2,
        },
        email: {
            dataType: "string",
            fieldNumber: 3,
        },
    },
}

const userCheckInOutAssetSchema = {
    $id: "atithi-v1/atithi/userCheckIn",
    type: "object",
    required: ["hotelId", "awn"],
    properties: {
        hotelId: {
            dataType: "bytes",
            fieldNumber: 1,
        },
        awn: {
            dataType: "string",
            fieldNumber: 2,
        },
    },
}
const makeRemoveSuperAdmin={
    $id: "atithi-v1/atithi/makeRemoveSuperAdmin",
    type: "object",
    required: ["accountId"],
    properties: {
        accountId: {
            dataType: "bytes",
            fieldNumber: 1,
        },
    },
}

const atithiModuleSchema = {
    type: "object",
    required: ["generalDetails"],
    properties: {
        generalDetails: {
            fieldNumber: 1,
            type: "object",
            required: ["name", "mobileNumber", "email", "hotelId"],
            properties: {
                name: {
                    dataType: 'string',
                    fieldNumber: 1
                },
                mobileNumber: {
                    dataType: 'uint32',
                    fieldNumber: 2
                },
                email: {
                    dataType: 'string',
                    fieldNumber: 3
                },
                hotelId: {
                    dataType: "bytes",
                    fieldNumber: 4,
                }
            },
        },
        superAdmin: {
            fieldNumber: 2,
            dataType: "boolean"
        }
    },
    default: {
        generalDetails: {
            name: "",
            mobileNumber: 0,
            email: "",
            hotelId: Buffer.from(''),
        },
        superAdmin: false,
    },
}

module.exports = {
    addManagerAssetSchema,
    createCityAssetSchema,
    createHotelAssetSchema,
    removeManagerAssetSchema,
    addUserAssetSchema,
    userCheckInOutAssetSchema,
    atithiModuleSchema,
    makeRemoveSuperAdmin
}