import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import PoseWithWebcam from "./_components/PoseWithWebcam";
import CaptureExampleAction from "./_components/CaptureExampleAction";
import CompareAction from "./_components/CompareAction";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <div>
      {/* <CaptureExampleAction /> */}
      <CompareAction />
      <h1>Hack TX</h1>
    </div>
  );
}
