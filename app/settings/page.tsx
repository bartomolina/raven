"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  BlockTitle,
  List,
  ListButton,
  ListItem,
  Page,
  Toggle,
} from "konsta/react";
import { useTheme } from "next-themes";

import { logout as lensLogout } from "@/lib/lens-client";
import { Navigation } from "@/ui/layout";

export default function Settings() {
  const { user, logout } = usePrivy();
  const { theme, setTheme } = useTheme();

  const signOut = async () => {
    lensLogout();
    await logout();
  };

  return (
    <Page>
      <BlockTitle>Profile</BlockTitle>
      <List strong inset>
        <ListButton onClick={signOut}>Log out</ListButton>
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
      </List>
      <Navigation activeTab="settings" />
    </Page>
  );
}
