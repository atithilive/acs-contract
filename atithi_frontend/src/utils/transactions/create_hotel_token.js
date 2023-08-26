/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";

export const createHotelTokenSchema = {
  $id: "lisk/create-hotel-asset",
  type: "object",
  required: ["name","cityId", "location"],
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
};

export const createHotelToken = async ({
  name,
  cityId,
  location,
  passphrase,
  networkIdentifier,
  
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  // const addressId = cryptography.getAddressFromPassphrase(passphrase);
  const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");
  const cityIdBuffer=Buffer.from(cityId, "hex")

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);

  const { id, ...rest } = transactions.signTransaction(
    createHotelTokenSchema,
    {
      moduleID: 1024,
      assetID: 2,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows("113001")),
      senderPublicKey: publicKey,
      asset: {
        // account:cryptography.getAddressFromBase32Address(address),
        name,
        cityId:cityIdBuffer,
        location,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );
  
  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createHotelTokenSchema), rest),
    time:new Date()
  };
};