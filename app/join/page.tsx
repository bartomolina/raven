"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Block, Button, List, ListInput, Page } from "konsta/react";
import { useContext, useState } from "react";

import { useLensLogin } from "@/hooks";
import {
  createLensProfile,
  fetchProfile,
  safeHandle,
} from "@/lib/lens-functions";
import { RavenContext } from "@/lib/raven-context";

interface NewRestaurantForm {
  name: string;
  description: string;
  profileURI: string;
  address: string;
}

export default function Join() {
  const [formData, setFormData] = useState<NewRestaurantForm>({
    name: "",
    description: "",
    profileURI: "",
    address: "",
  });
  const { user, logout } = usePrivy();
  const { refetchProfile } = useContext(RavenContext);
  const { mutate: login } = useLensLogin({
    onSuccess: () => refetchProfile(),
    onError: () => console.log("error"),
  });

  const updateFormData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewRestaurantForm
  ) => {
    setFormData((prevState) => ({ ...prevState, [field]: e.target.value }));
  };

  const createProfileAndLogin = async () => {
    if (user?.email && user?.wallet) {
      console.log("logging: start");
      const handle = safeHandle(formData.name);
      try {
        console.log("creating profile...");
        await createLensProfile(handle, user.wallet.address);
        console.log("created");

        console.log("logging: fetch profile");

        const profile = await fetchProfile(handle);

        console.log("logging: fetch restaurants from DB");

        await fetch("/api/restaurant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: profile?.id,
          }),
        });

        if (profile?.id) {
          console.log("logging in");
          login(profile.id);
          console.log("logged in");
        }
      } catch {
        console.log("error");
      }
    }
  };

  const disabled = !formData.name || !formData.description || !formData.address;

  return (
    <Page>
      <Block strong>
        <p>
          Before we continue, we need to know some details about your
          business...
        </p>
      </Block>
      <List strongIos insetIos>
        <ListInput
          outline
          label="Name"
          type="text"
          placeholder="The name of the restaurant"
          value={formData.name}
          onChange={(e) => updateFormData(e, "name")}
        />
        <ListInput
          outline
          label="Description"
          type="textarea"
          placeholder="A brief description about your cuisine"
          inputClassName="!h-20 resize-none"
          value={formData.description}
          onChange={(e) => updateFormData(e, "description")}
        />
        <ListInput
          outline
          label="Address"
          type="text"
          placeholder="Exact location"
          value={formData.address}
          onChange={(e) => updateFormData(e, "address")}
        />
      </List>
      <div className="flex flex-col items-center justify-center gap-5">
        <Button
          large
          disabled={disabled}
          onClick={createProfileAndLogin}
          className="!w-52 !bg-black normal-case !text-white dark:!bg-white dark:text-black"
        >
          Join Raven
        </Button>
        <Button
          small
          onClick={() => {
            logout();
          }}
          className="!w-52 !bg-white normal-case !text-black"
        >
          Back
        </Button>
      </div>
    </Page>
  );
}
