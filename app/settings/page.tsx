"use client";

import { SessionType, useLogout, useSession } from "@lens-protocol/react-web";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import {
  BlockTitle,
  List,
  ListButton,
  ListItem,
  Page,
  Toggle,
} from "konsta/react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/ui/common";
import { Navigation } from "@/ui/layout";

export default function Settings() {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { theme, setTheme } = useTheme();
  const [connectedWallet, setConnectedWallet] = useState<
    ConnectedWallet | undefined
  >();
  const { data: session, loading: loadingSession } = useSession();
  const { execute: logout } = useLogout();

  const signlessText = useMemo<
    { text: string; loading: string } | undefined
  >(() => {
    if (
      !loadingSession &&
      session?.authenticated &&
      session.type == SessionType.WithProfile
    ) {
      return session.profile.signless
        ? {
            text: "Disable signless transactions",
            loading: "Disabling signless transactions",
          }
        : {
            text: "Enable signless transactions",
            loading: "Enabling signless transactions",
          };
    }
  }, [loadingSession, session]);

  useEffect(() => {
    const wallet = wallets.find(
      (wallet) => wallet.address === user?.wallet?.address
    );
    setConnectedWallet(wallet);
  }, [wallets, user]);

  useEffect(() => {
    console.log("settings:user:", user);
  }, [user]);

  return (
    <Page>
      <BlockTitle>Profile</BlockTitle>
      <List strong inset>
        <ListButton onClick={() => logout()}>Log out</ListButton>
        <Button
          text={signlessText?.text}
          textLoading={signlessText?.loading}
          isFetching={loadingSession}
        />
      </List>
      <BlockTitle>Theme</BlockTitle>
      <List strong inset>
        <ListItem
          label
          title="Dark Mode"
          after={
            <Toggle
              checked={theme === "light" ? false : true}
              onChange={() =>
                theme === "light" ? setTheme("dark") : setTheme("light")
              }
            />
          }
        />
      </List>
      <BlockTitle>Wallet</BlockTitle>
      <List strong inset>
        <ListItem
          header="User Wallet Address"
          title={user?.wallet?.address}
          titleWrapClassName="font-mono text-xs"
        />
        <ListItem
          header="Connected Wallet"
          title={connectedWallet?.address}
          titleWrapClassName="font-mono text-xs"
        />
      </List>
      <Navigation activeTab="settings" />
    </Page>
  );
}
