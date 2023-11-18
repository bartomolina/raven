"use client";

import { Page } from "konsta/react";

import { useProfile } from "@/hooks";
import { Navigation } from "@/ui/layout";

export default function Restaurant() {
  const { data: profile } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <Page>
      <div>{profile.handle?.fullHandle}</div>
      <div>{profile.signless}</div>
      <Navigation activeTab="restaurants" />
    </Page>
  );
}
