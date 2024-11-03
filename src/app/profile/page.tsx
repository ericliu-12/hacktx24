"use client";

import Link from "next/link";
import ModelCard from "../_components/ModelCard";
import { useSession } from "next-auth/react";
import { updateUserAvatar } from "../api/avatars/route";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Page() {
  const [avatar, setAvatar] = useState();
  const { data: session } = useSession();
  // const [backSound] = useSound("/audio/select.wav");

  // const avatarSelect = async (avatar: [string, string]) => {
  //   const userId = session?.user?.id;
  //   if (userId) {
  //     try {
  //       await updateUserAvatar(userId, avatar[1]);
  //       console.log("Avatar updated successfully");
  //     } catch (error) {
  //       console.error("Failed to update avatar:", error);
  //     }
  //   } else {
  //     console.error("User not authenticated");
  //   }
  // };

  if (avatar) {
    // const res = avatarSelect(avatar);
    // console.log(res);

    return (
      <div className="flex h-screen w-full flex-col items-center justify-center">
        <div>
          <h1 className="mb-4 text-xl">Set up your profile</h1>
        </div>
        <Link href="/">
          <div
            // onClick={() => backSound()}
            className="fixed left-6 top-6 z-50 hover:translate-y-1"
          >
            Back
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4">Nice choice!</h1>
          <div className="flex">
            <ModelCard
              name={avatar[0]!}
              path={avatar[1]!}
              setAvatar={setAvatar}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-left">
      <Link href="/">
        <div className="fixed left-6 top-6 hover:translate-y-1">Back</div>
      </Link>

      <div>
        <h1 className="mb-4 text-xl">Set up your profile</h1>
      </div>
      <div className="flex flex-col">
        <h1 className="mb-4">Choose your avatar</h1>
        <div className="flex">
ard
            name="Suki"
            path="/models/suki.vrm"
            setAvatar={setAvatar}
          />
          <ModelCard
            name="Cyber"
            path="/models/cyber.vrm"
            setAvatar={setAvatar}
          />
          <ModelCard name="Rei" path="/models/rei.vrm" setAvatar={setAvatar} />
          <ModelCard
            name="David"
            path="/models/david.vrm"
            setAvatar={setAvatar}
          />
          <ModelCard
            name="Bun"
            path="/models/bunny.vrm"
            setAvatar={setAvatar}
          />
        </div>
      </div>
    </div>
  );
}
