/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";

export const addManagerSchema = {
  $id: "lisk/add-manager-asset",
  type: "object",
  required: ["managerAddress","hotelId"],
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

export const AddManagerToken = async ({
  managerAddress,
  hotelId,
  passphrase,
  networkIdentifier,
  
}) => {
  const { publicKey } = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase
  );
  // const addressId = cryptography.getAddressFromPassphrase(passphrase);
  const address = cryptography.getAddressFromPassphrase(passphrase).toString("hex");

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);
  const hotelIdBuffer=Buffer.from(hotelId, "hex")
  
  const { id, ...rest } = transactions.signTransaction(
    addManagerSchema,
    {
      moduleID: 1024,
      assetID: 0,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows("113001")),
      senderPublicKey: publicKey,
      asset: {
        // account:cryptography.getAddressFromBase32Address(address),
        managerAddress,
        hotelId:hotelIdBuffer,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );
  
  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(addManagerSchema), rest),
    time:new Date()
  };
};