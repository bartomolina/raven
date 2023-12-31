import { usePrivy, useWallets } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useProfile } from "@/hooks";

import { enableProfileManager } from "./lens-functions";
import { initialState, Profile, RavenContext } from "./raven-context";

const fetchRestaurants = async () => {
  return await fetch("/api/restaurant", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
};

export function RavenProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | undefined>(
    initialState.profile
  );
  const [loading, setLoading] = useState(initialState.loading);
  const { ready, authenticated } = usePrivy();
  const { data: lensProfile, isLoading, refetch } = useProfile();
  const router = useRouter();
  const pathName = usePathname();
  const { wallets } = useWallets();
  const { user } = usePrivy();

  const connectedWallet = wallets.find(
    (wallet) => wallet.address === user?.wallet?.address
  );

  const refetchProfile = async () => {
    await refetch();
  };

  // set user type
  useEffect(() => {
    setLoading(true);
    if (ready && authenticated && lensProfile) {
      fetchRestaurants().then((result) => {
        result.json().then((data) => {
          const isProfileInRestaurants = data.restaurants.some(
            (restaurant: { profileId: string }) =>
              restaurant.profileId === lensProfile.id
          );
          console.log("isRestaurant:", isProfileInRestaurants);
          setProfile({ type: isProfileInRestaurants ? "restaurant" : "user" });
        });
      });
    } else {
      setProfile(initialState.profile);
    }
    setLoading(false);
  }, [ready, authenticated, lensProfile]);

  // user is logged in, redirect to relevant path
  useEffect(() => {
    if (
      ready &&
      authenticated &&
      lensProfile &&
      !isLoading &&
      profile &&
      (pathName === "/" || pathName === "/userLogin" || pathName === "/join")
    ) {
      profile.type === "restaurant"
        ? router.push(`/restaurant/${lensProfile.id}`)
        : router.push("/restaurants");
    }
  }, [lensProfile, router, pathName, ready, authenticated, profile, isLoading]);

  // logged out from Privy, redirect to home
  useEffect(() => {
    if (ready && !authenticated && pathName.length > 0 && pathName !== "/") {
      router.push("/");
    }

    if (
      ready &&
      authenticated &&
      !lensProfile &&
      !isLoading &&
      pathName.length > 0 &&
      pathName !== "/join" &&
      pathName !== "/userLogin"
    ) {
      const userType = localStorage.getItem("userType");
      console.log(userType);
      userType === "restaurant"
        ? router.push("/join")
        : router.push("/userLogin");
    }
  }, [ready, authenticated, lensProfile, isLoading, router, pathName]);

  useEffect(() => {
    if (lensProfile && !lensProfile?.signless && connectedWallet) {
      enableProfileManager(connectedWallet);
    }
  }, [lensProfile, connectedWallet]);

  return (
    <RavenContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        refetchProfile,
      }}
    >
      {children}
    </RavenContext.Provider>
  );
}
