const fs_extra = require("fs-extra");
const os = require("os");
const path = require("path");
const { cryptography, codec, db } = require("lisk-sdk");

const DB_KEY_TRANSACTIONS = "atithi:transactions";
const CREATENFT_ASSET_ID = 0;
const TRANSFERNFT_ASSET_ID = 2;
const ADD_MANAGER_ASSET_ID=0
const REMOVE_MANAGER_ASSET_ID=4
const CREATE_USER_ASSET_ID=6
const USER_CHECKIN_ASSET_ID=7
const USER_CHECKOUT_ASSET_ID=8


// Schemas
const encodedTransactionSchema = {
  $id: 'nft/encoded/transactions',
  type: 'object',
  required: ['transactions'],
  properties: {
    transactions: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

const encodedNFTHistorySchema = {
  $id: 'nft/encoded/nftHistory',
  type: 'object',
  required: ['nftHistory'],
  properties: {
    nftHistory: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

const encodedUserHistorySchema = {
  $id: 'atithi/encoded/userHistory',
  type: 'object',
  required: ['userHistory'],
  properties: {
    nftHistory: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

const encodedHotelHistorySchema = {
  $id: 'atithi/encoded/hotelHistory',
  type: 'object',
  required: ['hotelHistory'],
  properties: {
    nftHistory: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
};

const getDBInstance = async (dataPath = '~/.lisk/nft-app/', dbName = 'nft_plugin.db') => {
  const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
  await fs_extra.ensureDir(dirPath);
  return new db.KVStore(dirPath);
};

const getTransactions = async (db) => {
  try {
    const encodedTransactions = await db.get(DB_KEY_TRANSACTIONS);
    const { transactions } = codec.decode(encodedTransactionSchema, encodedTransactions);
    return transactions;
  }
  catch (error) {
    return [];
  }
};

const getAllTransactions = async (db, registeredSchema) => {
  const savedTransactions = await getTransactions(db);
  const transactions = [];
  for (const trx of savedTransactions) {
    transactions.push(decodeTransaction(trx, registeredSchema));
  }
  return transactions;
}

const saveTransactions = async (db, payload) => {
  const savedTransactions = await getTransactions(db);
  const transactions = [...savedTransactions, ...payload];
  const encodedTransactions = codec.encode(encodedTransactionSchema, { transactions });
  await db.put(DB_KEY_TRANSACTIONS, encodedTransactions);
};

const getNFTHistory = async (db, dbKey) => {
  try {
    const encodedNFTHistory = await db.get(dbKey);
    const { nftHistory } = codec.decode(encodedNFTHistorySchema, encodedNFTHistory);

    return nftHistory;
  }
  catch (error) {
    return [];
  }
};

const saveNFTHistory = async (db, decodedBlock, registeredModules, channel) => {
  decodedBlock.payload.map(async trx => {
    const module = registeredModules.find(m => m.id === trx.moduleID);
    if (module.name === 'atithi') {
    let dbKey, savedHistory, base32Address, nftHistory, encodedNFTHistory;
      if (trx.assetID === CREATENFT_ASSET_ID){
        channel.invoke('atithi:getAllTokens').then(async (val) => {
          for (let i = 0; i < val.length; i++) {
            const senderAdress = cryptography.getAddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'));
            if (val[i].ownerAddress === senderAdress.toString('hex')) {
              dbKey = `nft:${val[i].id}`;
              savedHistory = await getNFTHistory(db, dbKey);
              if (savedHistory && savedHistory.length < 1) {
                base32Address = cryptography.getBase32AddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'), 'lsk');
                nftHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
                encodedNFTHistory = codec.encode(encodedNFTHistorySchema, { nftHistory });
                await db.put(dbKey, encodedNFTHistory);
              }
            }
          };
        });
      } else {
        dbKey = `nft:${trx.asset.nftId}`;
        base32Address = (trx.assetID === TRANSFERNFT_ASSET_ID) ? cryptography.getBase32AddressFromAddress(Buffer.from(trx.asset.recipient, 'hex')) : cryptography.getBase32AddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'), 'lsk');
        savedHistory = await getNFTHistory(db, dbKey);
        nftHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
        encodedNFTHistory = codec.encode(encodedNFTHistorySchema, { nftHistory });
        await db.put(dbKey, encodedNFTHistory);
      }
    }
  });
};

const saveUserHistory = async (db, decodedBlock, registeredModules, channel) => {
    decodedBlock.payload.map(async trx => {
      const module = registeredModules.find(m => m.id === trx.moduleID);
      if (module.name === 'atithi') {
      let dbKey, savedHistory, base32Address, userHistory, encodedUserHistory;
        if (trx.assetID === USER_CHECKIN_ASSET_ID){
          channel.invoke('atithi:getAllTokens').then(async (valAll) => {
            const val=valAll.users
            const hotelId=trx.asset.hotelId
            const hotelTokenIndex = valAll.hotels.findIndex((t) => t.id.equals(hotelId));
            const hotel=valAll['hotels'][hotelTokenIndex]
            for (let i = 0; i < val.length; i++) {
              const senderAdress = cryptography.getAddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'));
              if (senderAdress.toString('hex').includes(hotel.managers)) {
                dbKey = `atithi:${val[i].awn}`;
                savedHistory = await getNFTHistory(db, dbKey);
                if (savedHistory) {
                  const checkinData = { hotelId: hotelId, status: "checkin", date:new Date()  }
                  base32Address = cryptography.getBase32AddressFromPublicKey(Buffer.from(JSON.stringify(checkinData), 'hex'), 'lsk');
                  userHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
                  encodedUserHistory = codec.encode(encodedUserHistorySchema, { userHistory });
                  await db.put(dbKey, encodedUserHistory);
                }else{
                const checkinData = { hotelId: hotelId, status: "checkin", date:new Date()  }
                  base32Address = cryptography.getBase32AddressFromPublicKey(Buffer.from(JSON.stringify(checkinData), 'hex'), 'lsk');
                  userHistory = [Buffer.from(base32Address, 'binary')];
                  encodedUserHistory = codec.encode(encodedUserHistorySchema, { userHistory });
                  await db.put(dbKey, encodedUserHistory);
                }
              }
            };
          });
        } else {
          dbKey = `atithi:${trx.asset.awn}`;
          const checkOutData = { hotelId: hotelId, status: "checkOut", date:new Date()  }
            base32Address = cryptography.getBase32AddressFromPublicKey(Buffer.from(JSON.stringify(checkOutData), 'hex'), 'lsk');  
          savedHistory = await getNFTHistory(db, dbKey);
          userHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
          encodedUserHistory = codec.encode(encodedUserHistorySchema, { userHistory });
          await db.put(dbKey, encodedUserHistory);
        }
      }
    });
};
const saveHotelHistory = async (db, decodedBlock, registeredModules, channel) => {
    decodedBlock.payload.map(async trx => {
      const module = registeredModules.find(m => m.id === trx.moduleID);
      if (module.name === 'atithi') {
      let dbKey, savedHistory, base32Address, nftHistory, encodedNFTHistory;
        if (trx.assetID === USER_CHECKIN_ASSET_ID ){
          channel.invoke('atithi:getAllTokens').then(async (valAll) => {
            const val=valAll.hotels
            const valUsers=valAll.users
            for (let i = 0; i < val.length; i++) {
              dbKey = `atithi:${val[i].id}`;
              savedHistory = await getNFTHistory(db, dbKey);
              if (savedHistory && savedHistory.length < 1) {
              const senderAdress = cryptography.getAddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'))
              const checkInData={ userAwn: hotelId, status: "checkin", date:new Date(),manager:senderAdress}

              }else{

              }
            };
          });
        } else {
          dbKey = `atithi:${trx.asset.nftId}`;
          base32Address = (trx.assetID === TRANSFERNFT_ASSET_ID) ? cryptography.getBase32AddressFromAddress(Buffer.from(trx.asset.recipient, 'hex')) : cryptography.getBase32AddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'), 'lsk');
          savedHistory = await getNFTHistory(db, dbKey);
          nftHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
          encodedNFTHistory = codec.encode(encodedNFTHistorySchema, { nftHistory });
          await db.put(dbKey, encodedNFTHistory);
        }
      }
    });
  };




const decodeTransaction = (
  encodedTransaction,
  registeredSchema,
) => {
  const transaction = codec.decode(registeredSchema.transaction, encodedTransaction);
  const assetSchema = getTransactionAssetSchema(transaction, registeredSchema);
  const asset = codec.decode(assetSchema, transaction.asset);
  const id = cryptography.hash(encodedTransaction);
  return {
    ...codec.toJSON(registeredSchema.transaction, transaction),
    asset: codec.toJSON(assetSchema, asset),
    id: id.toString('hex'),
  };
};

const getTransactionAssetSchema = (
  transaction,
  registeredSchema,
) => {
  const txAssetSchema = registeredSchema.transactionsAssets.find(
    assetSchema =>
      assetSchema.moduleID === transaction.moduleID && assetSchema.assetID === transaction.assetID,
  );
  if (!txAssetSchema) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `ModuleID: ${transaction.moduleID} AssetID: ${transaction.assetID} is not registered.`,
    );
  }
  return txAssetSchema.schema;
};

module.exports = {
  getDBInstance,
  getAllTransactions,
  getTransactions,
  saveTransactions,
  saveNFTHistory,
  getNFTHistory,
  saveUserHistory,
}