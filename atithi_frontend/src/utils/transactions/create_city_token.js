/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";

export const createCityTokenSchema = {
  $id: "lisk/create-city-asset",
  type: "object",
  required: ["name","state", "country"],
  properties: {
    // accountId:{
    //   dataType: "bytes",
    //   fieldNumber: 1,
    // },
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
};

export const createCityToken = async ({
  name,
  state,
  country,
  passphrase,
  networkIdentifier,
  
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);

  const { id, ...rest } = transactions.signTransaction(
    createCityTokenSchema,
    {
      moduleID: 1024,
      assetID: 1,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows("113001")),
      senderPublicKey: publicKey,
      asset: {
        name,
        state,
        country,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );
  
  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createCityTokenSchema), rest),
    time:new Date()
  };
};