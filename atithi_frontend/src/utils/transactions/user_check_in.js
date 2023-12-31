/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";

export const createUserCheckInSchema = {
  $id: "lisk/user_checkin_asset",
  type: "object",
  required: ["awn","hotelId"],
  properties: {
    awn: {
      dataType: "string",
      fieldNumber: 2,
    },
    hotelId: {
      dataType: "bytes",
      fieldNumber: 1,
    },
  },
};

export const createUserCheckIn = async ({
  awn,
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
    createUserCheckInSchema,
    {
      moduleID: 1024,
      assetID: 7,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows("113001")),
      senderPublicKey: publicKey,
      asset: {
        // account:cryptography.getAddressFromBase32Address(address),
        awn,
        hotelId:hotelIdBuffer,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );
  
  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createUserCheckInSchema), rest),
    time:new Date()
  };
};