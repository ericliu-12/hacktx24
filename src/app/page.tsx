import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import ThreeScene from "./_components/ThreeScreen";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <ThreeScene />

      <div className="text-red-500 fixed top-1/2 -translate-y-1/2 right-0">
        Play
      </div>
    </HydrateClient>
  );
}
