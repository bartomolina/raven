import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useProfile } from "@/hooks";

import { initialState, Profile, RavenContext } from "./raven-context";

export function RavenProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | undefined>(
    initialState.profile
  );
  const [loading, setLoading] = useState(initialState.loading);
  const { ready, authenticated } = usePrivy();
  const { data: lensProfile } = useProfile();
  const router = useRouter();
  const pathName = usePathname();

  // set profile type
  useEffect(() => {
    setLoading(true);
    if (
      lensProfile &&
      (pathName === "/" || pathName === "/userLogin" || pathName === "/join")
    ) {
      setProfile({ type: "user" });
      setLoading(false);
      router.push("/restaurant");
    }
    setLoading(false);
    setProfile(initialState.profile);
  }, [lensProfile, router, pathName]);

  // logged out from Privy, redirect to home
  useEffect(() => {
    if (ready && !authenticated && pathName.length > 0 && pathName !== "/") {
      router.push("/");
    }

    if (
      ready &&
      authenticated &&
      !lensProfile &&
      pathName.length > 0 &&
      pathName !== "/join" &&
      pathName !== "/userLogin"
    ) {
      const userType = localStorage.getItem("userType");
      userType === "restaurant"
        ? router.push("/join")
        : router.push("/userLogin");
    }
  }, [ready, authenticated, lensProfile, router, pathName]);

  // logged in Lens, redirect to restaurants
  useEffect(() => {}, []);

  return (
    <RavenContext.Provider
      value={{
        profile,
        setProfile,
        loading,
      }}
    >
      {children}
    </RavenContext.Provider>
  );
}
