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
        <div className="w-full">
          <div>
            <img className="ml-7 mt-7 w-40" src="/demo/1.png" alt="Logo" />
          </div>
          <div className="ml-7 mt-2 flex flex-col">
            <div className="text-lg font-bold">BRUNCHIT</div>
            <div className="pr-5 text-xs">
              Brunchit is a foodie temple. An Atelier of magnificent brunches.
              Fine Dining: excellent quality cuisine, high standards of service
              and unique environments in exceptional locations.
            </div>
          </div>
        </div>
        <div className="-mt-4 h-full">
          <List strongIos outlineIos>
            {menu?.items.map((item) => (
              <>
                {item.__typename === "Post" && (
                  <ListItem
                    link
                    chevronMaterial={false}
                    title={
                      item.metadata.attributes?.find(
                        (item) => item.key === "name"
                      )?.value
                    }
                    after={
                      "$" +
                      item.metadata.attributes?.find(
                        (item) => item.key === "price"
                      )?.value
                    }
                    text={
                      item.metadata.attributes?.find(
                        (item) => item.key === "description"
                      )?.value
                    }
                    media={
                      <img
                        className="material:w-10 material:rounded-full ios:w-20 ios:rounded-lg"
                        src={
                          item.metadata.attributes?.find(
                            (item) => item.key === "image"
                          )?.value
                        }
                        width="80"
                        alt="demo"
                      />
                    }
                  />
                )}
              </>
            ))}
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
      <Navigation activeTab="restaurants" />
    </Page>
  );
}
