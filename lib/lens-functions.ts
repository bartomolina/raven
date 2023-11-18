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

export const fetchProfile = async (handle: string) => {
  return await lensClient.profile.fetch({
    forHandle: `test/${handle}`,
  });
};
