import { PaginatedResult, ProfileFragment } from "@lens-protocol/client";
import {
  Block,
  BlockTitle,
  Button,
  Link,
  List,
  ListButton,
  ListItem,
  Navbar,
  NavbarBackLink,
  Page,
  Popup,
  Preloader,
} from "konsta/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useLensLogin, useProfile } from "@/hooks";
import { lensClient, logout } from "@/lib/lens-client";
import { NotificationContext } from "@/ui/common";

interface LensDialogProps {
  lensPopupOpened: boolean;
  setLensPopupOpened: Dispatch<SetStateAction<boolean>>;
  address: string;
}

export default function LensDialog({
  lensPopupOpened,
  setLensPopupOpened,
  address,
}: LensDialogProps) {
  const [managedProfiles, setManagedProfiles] =
    useState<PaginatedResult<ProfileFragment>>();
  const [loadingProfile, setLoadingProfile] = useState("");
  const { mutate: login, isLoading } = useLensLogin({
    onSuccess: () => {
      refetchProfile();
    },
    onError: console.log,
  });
  const notification = useContext(NotificationContext);
  const [isFetchingProfiles, setIsFetchingProfiles] = useState(false);
  const { data: currentProfile, refetch: refetchProfile } = useProfile();

  const fetchProfiles = useCallback(async () => {
    setIsFetchingProfiles(true);
    const profiles = await lensClient.wallet.profilesManaged({ for: address });
    setManagedProfiles(profiles);
    setIsFetchingProfiles(false);
  }, [address, setManagedProfiles]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <Popup
      opened={lensPopupOpened}
      onBackdropClick={() => setLensPopupOpened(false)}
    >
      <Page>
        <Navbar
          title="Link Lens Profile"
          left={
            <NavbarBackLink
              text="Back"
              onClick={() => setLensPopupOpened(false)}
            />
          }
        />
        {currentProfile && (
          <>
            <Block strong outline>
              <div className="space-y-5 text-lg">
                <p>
                  Yay! You&apos;ve successfully linked your your Lens account.
                </p>
              </div>
            </Block>
            <Block strong outline>
              <div className="space-y-5 text-lg">
                <p>Share a post on Lens with your referral code</p>
              </div>
            </Block>
            <List strong outline>
              <ListButton
                onClick={() => {
                  logout();
                  refetchProfile();
                }}
              >
                Log out
              </ListButton>
            </List>
          </>
        )}
        {!currentProfile && (
          <>
            <BlockTitle medium>1. Copy your wallet address</BlockTitle>
            <Block strong outline>
              <p>
                Tap on the address below to copy your <strong>quiz.tech</strong>{" "}
                wallet address
              </p>
              <List strong outlineIos>
                <Button
                  large
                  className="!bg-black font-mono text-xs normal-case dark:!bg-white dark:text-black"
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    notification.show(
                      "Wallet address copied to the clipboard!"
                    );
                  }}
                >
                  {address}
                </Button>
              </List>
            </Block>
            <BlockTitle medium>2. Link your account</BlockTitle>
            <Block strong outline>
              <p>
                Tap below to open Orb and add your <strong>quiz.tech</strong>{" "}
                wallet as a manager for your Lens profile
              </p>
              <List strong outlineIos>
                <Link
                  className="relative z-10 flex h-11 w-full cursor-pointer select-none appearance-none items-center justify-center overflow-hidden rounded !bg-black px-2 py-1 text-center font-semibold normal-case text-white transition-colors duration-100 focus:outline-none active:bg-ios-primary-shade dark:!bg-white dark:text-black"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  href="https://orb.ac/"
                  target="_blank"
                >
                  Open Orb
                </Link>
              </List>
            </Block>
            <BlockTitle medium>3. Log in</BlockTitle>
            <Block strong outline>
              <p>Log in with your Lens handle</p>
              <List strong outlineIos>
                <Button
                  large
                  className="!bg-black normal-case text-white dark:!bg-white dark:text-black"
                  onClick={fetchProfiles}
                >
                  {isFetchingProfiles && (
                    <Preloader
                      size="w-5 h-5"
                      className="mr-2 text-white dark:text-black"
                    />
                  )}
                  Refresh profiles
                </Button>
              </List>
              {managedProfiles?.items && managedProfiles?.items.length > 0 && (
                <List strong outline>
                  {managedProfiles.items.map((profile) => (
                    <ListItem
                      key={profile.id}
                      link
                      onClick={() => {
                        if (!isLoading) {
                          setLoadingProfile(profile.id);
                          login(profile.id);
                        }
                      }}
                      title={profile.handle?.fullHandle}
                      after={
                        isLoading && loadingProfile === profile.id ? (
                          <Preloader size="w-5 h-5" />
                        ) : (
                          "Log in"
                        )
                      }
                    />
                  ))}
                </List>
              )}
              {!managedProfiles?.items.length && (
                <p>
                  Couldn&apos;t find any profiles linked to your{" "}
                  <strong>quiz.tech</strong> wallet. Make sure you&apos;ve added
                  your wallet as a Manager for your Lens profile. It may take a
                  few seconds after you&apos;ve updated the profile manager for
                  the profile to show up here!
                </p>
              )}
            </Block>
          </>
        )}
      </Page>
    </Popup>
  );
}
