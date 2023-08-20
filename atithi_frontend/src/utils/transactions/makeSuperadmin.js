/* global BigInt */

import { transactions, codec, cryptography } from "@liskhq/lisk-client";
import { getFullAssetSchema} from "../common";
import { fetchAccountInfo } from "../../api";
export const createSuperadminSchema = {
  $id: "lisk/create-superadmin-asset",
  type: "object",
  required: ["accountId"],
  properties: {
    accountId: {
      dataType: "bytes",
      fieldNumber: 1,
      minLength: 20,
      maxLength: 20,
    },
  },
};

export const createSuperadminToken = async ({
  accountId,
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
    createSuperadminSchema,
    {
      moduleID: 1024,
      assetID: 3,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows("1130001")),
      senderPublicKey: publicKey,
      asset: {
        accountId,
      },
    },
    Buffer.from(networkIdentifier, "hex"),
    passphrase
  );

  return {
    id: id.toString("hex"),
    tx: codec.codec.toJSON(getFullAssetSchema(createSuperadminSchema), rest),
    time:new Date()
  };
};