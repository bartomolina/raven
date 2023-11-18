"use client";

import { Plus } from "@phosphor-icons/react";
import { Fab, List, ListItem, Page } from "konsta/react";

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
      <div className="flex h-full flex-col">
        <div className="flex h-32 w-full">
          <div className="border-2">Picture</div>
          <div className="border-2">Details</div>
        </div>
        <div className="h-full border-4">
          <List strongIos outlineIos>
            <ListItem
              link
              chevronMaterial={false}
              title="Yellow Submarine"
              after="$15"
              subtitle="Beatles"
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
              media={
                <img
                  className="material:w-10 material:rounded-full ios:w-20 ios:rounded-lg"
                  src="https://cdn.framework7.io/placeholder/people-160x160-1.jpg"
                  width="80"
                  alt="demo"
                />
              }
            />
          </List>
        </div>
      </div>
      <Fab
        className="fixed bottom-28 left-1/2 z-20 -translate-x-1/2 !bg-black"
        icon={<Plus />}
        text="Add item"
        textPosition="after"
        href="/item"
      />
      {menu?.items.map((menuItem) => (
        <div key={menuItem.id}>Menu Item: {menuItem.by.handle?.fullHandle}</div>
      ))}
      <Navigation activeTab="restaurants" />
    </Page>
  );
}
