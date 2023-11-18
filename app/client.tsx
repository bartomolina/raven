"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "konsta/react";
import { Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { polygonMumbai } from "viem/chains";

import { env } from "@/env.mjs";
import { APP_URL } from "@/lib/constants";
import { RavenProvider } from "@/lib/raven-provider";
import { Notification, NotificationProvider } from "@/ui/common";
import { isiOS } from "@/utils/ios";

export const spaceGrotesk = Space_Grotesk({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export function Client({ children }: { children: React.ReactNode }) {
  const [mounted, isMounted] = useState(false);
  const [theme, setTheme] = useState<"material" | "ios">("material");

  useEffect(() => {
    if (
      env.NEXT_PUBLIC_ONESIGNAL_APPID &&
      env.NEXT_PUBLIC_ONESIGNAL_APPID.length > 0
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      OneSignalDeferred.push(function (OneSignal) {
        OneSignal.init({
          appId: env.NEXT_PUBLIC_ONESIGNAL_APPID,
          safari_web_id:
            "web.onesignal.auto.09714a24-a3bb-414f-8109-d75a4f07e6fa",
        });
        OneSignal.Slidedown.promptPush();
      });
      return () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.OneSignalDeferred = undefined;
      };
    }
  }, []);

  useEffect(() => {
    isMounted(true);
    if (isiOS()) {
      setTheme("ios");
    }
  }, [isMounted]);

  return mounted ? (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          loginMethods: ["wallet", "email"],
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
            noPromptOnSignature: true,
          },
          appearance: {
            theme: "light",
            accentColor: "#000000",
            logo: `${APP_URL}logo.png`,
          },
          defaultChain: polygonMumbai,
        }}
      >
        <NotificationProvider>
          <App theme={theme}>
            <ThemeProvider attribute="class" enableSystem={false}>
              <Notification />
              <RavenProvider>{children}</RavenProvider>
            </ThemeProvider>
          </App>
        </NotificationProvider>
      </PrivyProvider>
    </QueryClientProvider>
  ) : (
    <></>
  );
}
