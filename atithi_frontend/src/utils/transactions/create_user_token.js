/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";

export const createUserTokenSchema = {
  $id: "lisk/create-user-asset",
  type: "object",
  required: ["name","mobileNumber", "email"],
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
};

export const createUserToken = async ({
  name,
  mobile,
  email,
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

  const { id, ...rest } = transactions.signTransaction(
    createUserTokenSchema,
    {
      moduleID: 1024,
      assetID: 6,
      nonce: BigInt(nonce),

      fee: BigInt(transactions.convertLSKToBeddows("113001")),
      senderPublicKey: publicKey,
      asset: {
        // account:cryptography.getAddressFromBase32Address(address),
        name,
        mobileNumber:mobile,
        email,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );
  
  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createUserTokenSchema), rest),
    time:new Date()
  };
};