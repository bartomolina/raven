import { useQuery } from "@tanstack/react-query";

import { lensClient } from "@/lib/lens-client";

export const useProfile = () => {
  return useQuery({
    queryFn: async () => {
      try {
        const forProfileId = await lensClient.authentication.getProfileId();
        if (forProfileId) {
          const profile = await lensClient.profile.fetch({ forProfileId });
          return profile;
        }
      } catch {
        // logout();
      }
      // eslint-disable-next-line unicorn/no-null
      return null;
    },
  });
};
