import Link from "next/link";
import ModelCard from "../_components/ModelCard";

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-left">
      <Link href="/">
        <div className="hover:translate-y-1 fixed top-6 left-6">
          Back
        </div>
      </Link>

      <div>
        <h1 className="mb-4 text-xl">Set up your profile</h1>
      </div>
      <div className="flex flex-col">
        <h1 className="mb-4">Choose your avatar</h1>
        <div className="flex">
          <ModelCard name="Suki" path="/models/suki.vrm" />
          <ModelCard name="Cyber" path="/models/cyber.vrm" />
          <ModelCard name="Rei" path="/models/rei.vrm" />
          <ModelCard name="David" path="/models/david.vrm" />
          <ModelCard name="Bun" path="/models/bunny.vrm" />
        </div>
      </div>
    </div>
  );
}
