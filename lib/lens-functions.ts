import { textOnly } from "@lens-protocol/metadata";
import { ConnectedWallet } from "@privy-io/react-auth";
import { polygonMumbai } from "viem/chains";

import { upload } from "@/utils/irys";

import { lensClient } from "./lens-client";

export const safeHandle = (handle: string) => {
  return `raven_${handle.toLocaleLowerCase().replaceAll(" ", "")}`;
};

export const createLensProfile = async (handle: string, to: string) => {
  const createProfileResult = await lensClient.profile.create({
    handle,
    to,
  });

  if (
    "txId" in createProfileResult &&
    typeof createProfileResult.txId === "string"
  ) {
    await lensClient.transaction.waitUntilComplete({
      forTxId: createProfileResult.txId,
    });
  }
};

export const getEthersProvider = async (wallet: ConnectedWallet) => {
  await wallet.switchChain(polygonMumbai.id);
  return await wallet.getEthersProvider();
};

export const enableProfileManager = async (
  connectedWallet: ConnectedWallet
) => {
  const wallet = await getEthersProvider(connectedWallet);
  const signer = wallet.getSigner();

  const updateProfileManagerResult =
    await lensClient.profile.createChangeProfileManagersTypedData({
      approveSignless: true,
    });

  if (
    "reason" in updateProfileManagerResult &&
    typeof updateProfileManagerResult.reason === "string"
  ) {
    throw new Error(updateProfileManagerResult.reason);
  }

  const { id, typedData } = updateProfileManagerResult.unwrap();
  const signature = await signer._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.value
  );

  await lensClient.transaction.broadcastOnchain({
    id,
    signature,
  });
};

export const createLensItem = async (
  connectedWallet: ConnectedWallet,
  address: string,
  item: {
    name: string;
    description: string;
    price: string;
    image: string;
  }
) => {
  const metadata = textOnly({
    content: item.description,
    attributes: [
      {
        value: item.name,
        key: "name",
        // @ts-ignore
        type: "String",
      },
    ],
  });

  const contentURI = await upload(connectedWallet, JSON.stringify(metadata));

  console.log(contentURI);
  const postResult = await lensClient.publication.postOnMomoka({
    contentURI,
  });

  console.log(postResult);
};

export const fetchProfile = async (handle: string) => {
  return await lensClient.profile.fetch({
    forHandle: `test/${handle}`,
  });
};
