/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";

export const removeManagerSchema = {
  $id: "lisk/remove-manager-asset",
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
    }
  },
};

export const RemoveManagerToken = async ({
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
    removeManagerSchema,
    {
      moduleID: 1024,
      assetID: 4,
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
    tx: codec.codec.toJSON(getFullAssetSchema(removeManagerSchema), rest),
    time:new Date()
  };
};