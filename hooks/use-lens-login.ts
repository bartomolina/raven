import { usePrivy } from "@privy-io/react-auth";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

import { lensClient } from "@/lib/lens-client";
import { NotificationContext, NotificationType } from "@/ui/common";

interface LoginOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export const useLensLogin = ({ onSuccess, onError }: LoginOptions) => {
  const notification = useContext(NotificationContext);
  const { user, signMessage } = usePrivy();

  return useMutation({
    mutationFn: async (profileId: string) => {
      if (user?.wallet?.address) {
        try {
          const { id, text } =
            await lensClient.authentication.generateChallenge({
              for: profileId,
              signedBy: user?.wallet?.address,
            });

          const signature = await signMessage(text);
          await lensClient.authentication.authenticate({ id, signature });
        } catch (error) {
          notification.show(
            "There was an error logging in",
            NotificationType.ERROR
          );
          throw error;
        }
      }
    },
    onSuccess,
    onError,
  });
};
