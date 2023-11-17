"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Button } from "konsta/react";

export default function Join({ params }: { params: { userType: string } }) {
  const userType = params.userType;
  const { logout } = usePrivy();

  return (
    <>
      {userType}
      <div className="mt-20 flex flex-col items-center justify-center gap-10 text-center">
        <div className="flex flex-col items-center justify-center gap-5">
          <Button
            large
            onClick={() => logout()}
            className="!w-36 !bg-black normal-case dark:!bg-white dark:text-black"
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
}
