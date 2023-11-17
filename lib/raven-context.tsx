import { createContext, Dispatch, SetStateAction } from "react";

export interface Profile {
  type: "user" | "restaurant" | undefined;
}

type RavenContextType = {
  profile: Profile | undefined;
  setProfile: Dispatch<SetStateAction<Profile | undefined>>;
  loading: boolean;
};

export const initialState = {
  profile: undefined,
  setProfile: () => {},
  loading: true,
};

export const RavenContext = createContext<RavenContextType>({
  ...initialState,
});
