"use client";

import { Page } from "konsta/react";

import { useProfile } from "@/hooks";
import { useRestaurantMenu } from "@/hooks/use-restaurant-menu";
import { Navigation } from "@/ui/layout";

export default function Restaurant({
  params,
}: {
  params: { profileId: string };
}) {
  const { data: menu } = useRestaurantMenu({ profileId: params.profileId });
  const { data: profile } = useProfile();

  if (!profile) {
    return null;
  }

  return (
    <Page>
      <div>{profile.handle?.fullHandle}</div>
      <div>{profile.signless.toString()}</div>
      {menu?.items.map((menuItem) => (
        <div key={menuItem.id}>Menu Item: {menuItem.by.handle?.fullHandle}</div>
      ))}
      <Navigation activeTab="restaurants" />
    </Page>
  );
}
