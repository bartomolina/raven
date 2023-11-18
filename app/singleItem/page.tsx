"use client";

import {
  Actions,
  ActionsButton,
  ActionsGroup,
  ActionsLabel,
  Button,
  Notification,
  Page,
} from "konsta/react";
import { useState } from "react";

import { useProfile } from "@/hooks";
import { Navigation } from "@/ui/layout";

export default function Restaurant() {
  const { data: profile } = useProfile();
  const [actionsOneOpened, setActionsOneOpened] = useState(false);
  const [notificationFull, setNotificationFull] = useState(false);

  if (!profile) {
    return null;
  }

  return (
    <Page>
      <Actions
        opened={actionsOneOpened}
        onBackdropClick={() => setActionsOneOpened(false)}
      >
        <ActionsGroup>
          <ActionsLabel>Rate this item</ActionsLabel>
          <ActionsButton onClick={() => setActionsOneOpened(false)} bold>
            ⭐️
          </ActionsButton>
          <ActionsButton onClick={() => setActionsOneOpened(false)}>
            ⭐️⭐️
          </ActionsButton>
          <ActionsButton onClick={() => setActionsOneOpened(false)}>
            ⭐️⭐️⭐️
          </ActionsButton>
          <ActionsButton onClick={() => setActionsOneOpened(false)}>
            ⭐️⭐️⭐️
          </ActionsButton>
          <ActionsButton onClick={() => setActionsOneOpened(false)}>
            ⭐️⭐️⭐️⭐️
          </ActionsButton>
          <ActionsButton onClick={() => setActionsOneOpened(false)}>
            ⭐️⭐️⭐️⭐️
          </ActionsButton>
          <ActionsButton onClick={() => setActionsOneOpened(false)}>
            Cancel
          </ActionsButton>
        </ActionsGroup>
      </Actions>
      <Notification
        opened={notificationFull}
        icon={<img src="/logo-dark.png" className="h-5 w-5" />}
        title="Raven"
        titleRightText="now"
        subtitle="Item ordered"
        text="Your order will be on its way soon!"
        onClick={() => setNotificationFull(false)}
      />
      <div className="flex h-full flex-col">
        <div className="w-full">
          <div>
            <img className="ml-7 mt-7 w-40" src="/demo/2.png" alt="Logo" />
          </div>
          <div className="ml-7 mt-2 flex flex-col">
            <div className="text-xl font-bold">SEXY SPANISH OMELETTE</div>
            <div className="pr-5 pt-3 text-lg">
              Free-range egg omelet filled with melted cheese and 100% D.O.
              Iberian ham. And on the side: salad!
            </div>
          </div>
        </div>
        <div className="mt-15">
          <div className="flex gap-5 px-5">
            <Button
              large
              className="!w-52 !bg-black normal-case !text-white dark:!bg-white dark:text-black"
              onClick={() => setNotificationFull(true)}
            >
              Order
            </Button>
            <Button
              large
              className="!w-52 !bg-black normal-case !text-white dark:!bg-white dark:text-black"
              onClick={() => setActionsOneOpened(true)}
            >
              Review
            </Button>
          </div>
        </div>
      </div>
      <Navigation activeTab="restaurants" />
    </Page>
  );
}
