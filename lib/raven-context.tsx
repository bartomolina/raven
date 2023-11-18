import { createContext, Dispatch, SetStateAction } from "react";

export interface Profile {
  type: "user" | "restaurant" | undefined;
}

type RavenContextType = {
  profile: Profile | undefined;
  setProfile: Dispatch<SetStateAction<Profile | undefined>>;
  loading: boolean;
  refetchProfile: () => void;
};

export const initialState = {
  profile: undefined,
  setProfile: () => {},
  loading: true,
  refetchProfile: () => null,
};

export const RavenContext = createContext<RavenContextType>({
  ...initialState,
});
