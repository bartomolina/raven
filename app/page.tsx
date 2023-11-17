"use client";

import { Button, Link, Page } from "konsta/react";
import { useContext } from "react";

import { env } from "@/env.mjs";
import { RavenContext } from "@/lib/raven-context";
import { AddToHomeScreenAndroid, AddToHomeScreeniOS } from "@/ui/layout";

import { spaceGrotesk } from "./client";

const join = (path: "restaurant" | "user") => {
  alert(`joining as ${path}`);
};

export default function Home() {
  const { loading } = useContext(RavenContext);

  return (
    <Page>
      {!loading && (
        <>
          {env.NEXT_PUBLIC_ONESIGNAL_APPID &&
            env.NEXT_PUBLIC_ONESIGNAL_APPID.length > 0 && (
              <>
                <AddToHomeScreenAndroid />
                <AddToHomeScreeniOS />
              </>
            )}
          <div className="mt-20 flex flex-col items-center justify-center gap-10 text-center">
            <div
              className={`${spaceGrotesk.className} flex flex-col items-center justify-center gap-2 text-center`}
            >
              <img src="/icons/icon-192x192.png" alt="raven logo" />
              <div className="text-2xl">Raven</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
              <Button
                large
                onClick={() => join("user")}
                className="!w-36 !bg-black normal-case dark:!bg-white dark:text-black"
              >
                Join
              </Button>
              <Link
                className="text-sm !text-neutral-500"
                onClick={() => join("restaurant")}
              >
                I&apos;m a restaurant owner
              </Link>
            </div>
          </div>
        </>
      )}
    </Page>
  );
}
