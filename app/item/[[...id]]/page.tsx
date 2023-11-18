"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  Button,
  List,
  ListInput,
  Navbar,
  NavbarBackLink,
  Page,
} from "konsta/react";
import { useState } from "react";

import { createLensItem } from "@/lib/lens-functions";

interface NewItemForm {
  name: string;
  description: string;
  price: string;
  image: string;
}

const deleteItem = async () => {};

export default function Item({ params }: { params: { id: string } }) {
  console.log(params);
  const { wallets } = useWallets();
  const { user } = usePrivy();
  const [formData, setFormData] = useState<NewItemForm>({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const connectedWallet = wallets.find(
    (wallet) => wallet.address === user?.wallet?.address
  );

  const updateFormData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewItemForm
  ) => {
    setFormData((prevState) => ({ ...prevState, [field]: e.target.value }));
  };

  const createItem = async () => {
    console.log("creating item...");
    if (connectedWallet && user?.wallet?.address) {
      await createLensItem(connectedWallet, user?.wallet?.address, formData);
    }
  };

  return (
    <Page>
      <Navbar
        left={<NavbarBackLink text="Back" onClick={() => history.back()} />}
        title="Create Menu Item"
      />
      <div
        style={
          true
            ? {
                textShadow:
                  "-1.5px 0 black, 0 1.5px black, 1.5px 0 black, 0 -1.5px black",
                backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/e/ed/01_Paella_Valenciana_original.jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center top",
                backgroundSize: "contain",
                backgroundAttachment: "fixed",
              }
            : {
                textShadow:
                  "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
              }
        }
      />
      <List strongIos insetIos>
        <ListInput
          outline
          label="Name"
          type="text"
          placeholder="The name of the item"
          value={formData.name}
          onChange={(e) => updateFormData(e, "name")}
        />
        <ListInput
          outline
          label="Description"
          type="textarea"
          placeholder="A brief description of the item"
          inputClassName="!h-20 resize-none"
          value={formData.description}
          onChange={(e) => updateFormData(e, "description")}
        />
        <ListInput
          outline
          label="Price"
          type="text"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => updateFormData(e, "price")}
        />
        <ListInput
          outline
          label="Image"
          type="text"
          placeholder="Image URI"
          value={formData.image}
          onChange={(e) => updateFormData(e, "image")}
        />
      </List>
      <div className="flex justify-between">
        <Button
          large
          onClick={deleteItem}
          className="mx-10 !w-32 !bg-black normal-case !text-white dark:!bg-white dark:text-black"
        >
          Delete
        </Button>
        <Button
          large
          onClick={createItem}
          className="mx-10 !w-32 !bg-black normal-case !text-white dark:!bg-white dark:text-black"
        >
          Save
        </Button>
      </div>
    </Page>
  );
}
