import { useQuery } from "@tanstack/react-query";

import { lensClient } from "@/lib/lens-client";

export const useRestaurantMenu = ({ profileId }: { profileId: string }) => {
  return useQuery({
    queryKey: ["menu" + profileId],
    queryFn: async () => {
      return await lensClient.publication.fetchAll({
        where: {
          from: [profileId],
        },
      });
    },
  });
};
