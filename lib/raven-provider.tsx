import { SessionType, useSession } from "@lens-protocol/react-web";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { initialState, Profile, RavenContext } from "./raven-context";

export function RavenProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | undefined>(
    initialState.profile
  );
  const [loading, setLoading] = useState(initialState.loading);
  const { data: session, loading: lensLoading } = useSession();
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const pathName = usePathname();

  // set profile type
  useEffect(() => {
    console.log("test:getting context");
    setLoading(true);
    if (
      !lensLoading &&
      session?.authenticated &&
      session.type === SessionType.WithProfile
    ) {
      setProfile({ type: "restaurant" });
      setLoading(false);
      router.push("/restaurant");
    }
    setLoading(false);
    setProfile(initialState.profile);
  }, [session, lensLoading, router]);

  // logged out from Privy, redirect to home
  useEffect(() => {
    if (ready && !authenticated && pathName !== "/") {
      router.push("/");
    }
  }, [ready, authenticated, router]);

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
