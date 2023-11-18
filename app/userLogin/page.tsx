"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Block, Button, Page } from "konsta/react";

import { useLensLogin } from "@/hooks";
import { lensClient } from "@/lib/lens-client";

export default function UserLogin() {
  const { logout } = usePrivy();
  const { mutate: login } = useLensLogin({
    onSuccess: console.log,
    onError: console.log,
  });
  const { user } = usePrivy();

  const createProfileAndLogin = async () => {
    if (user?.email && user?.wallet) {
      const handle = `raven_${user.email.address.split("@")[0]}`;

      const createProfileResult = await lensClient.profile.create({
        handle,
        to: user.wallet.address,
      });

      if (
        "txId" in createProfileResult &&
        typeof createProfileResult.txId === "string"
      ) {
        await lensClient.transaction.waitUntilComplete({
          forTxId: createProfileResult.txId,
        });
      }

      const profile = await lensClient.profile.fetch({
        forHandle: `test/${handle}`,
      });

      if (profile?.id) {
        login(profile?.id);
      }
    }
  };

  return (
    <Page>
      <div className="mt-10 flex justify-center">
        <img src="/lens-logo.png" alt="Lens Logo" />
      </div>
      <Block strong>
        <p>
          To use Raven, you need a Lens account. You can create a new one here
          or link an existing account if you already have one
        </p>
      </Block>
      <div className="flex flex-col items-center justify-center gap-5">
        <Button
          large
          onClick={createProfileAndLogin}
          className="!w-52 !bg-black normal-case dark:!bg-white dark:text-black"
        >
          Create new profile
        </Button>
        <Button
          large
          onClick={createProfileAndLogin}
          className="!w-52 !bg-black normal-case dark:!bg-white dark:text-black"
        >
          Link an existing profile
        </Button>
        <Button
          small
          onClick={() => logout()}
          className="!w-52 !bg-white normal-case !text-black"
        >
          Back
        </Button>
      </div>
    </Page>
  );
}
