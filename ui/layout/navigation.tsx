"use client";

import { Gear, Storefront } from "@phosphor-icons/react";
import { Icon, Tabbar, TabbarLink } from "konsta/react";
import { useRouter } from "next/navigation";

export function Navigation({ activeTab }: { activeTab: string }) {
  const router = useRouter();

  return (
    <Tabbar className="fixed bottom-0 left-0 h-24 pt-6">
      <TabbarLink
        active={activeTab === "restaurants"}
        onClick={() => router.push("")}
        icon={
          <Icon
            ios={<Storefront size={28} />}
            material={<Storefront size={28} />}
          />
        }
        label={"Restaurants"}
      />
      <TabbarLink
        active={activeTab === "restaurant"}
        onClick={() => router.push("/restaurant")}
        icon={
          <Icon
            ios={<Storefront size={28} />}
            material={<Storefront size={28} />}
          />
        }
        label={"Restaurant"}
      />
      <TabbarLink
        active={activeTab === "settings"}
        onClick={() => router.push("/settings")}
        icon={<Icon ios={<Gear size={28} />} material={<Gear size={28} />} />}
        label={"Settings"}
      />
    </Tabbar>
  );
}
