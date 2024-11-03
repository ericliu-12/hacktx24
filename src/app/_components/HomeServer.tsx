// app/HomeServer.tsx

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import Home from "./Home"; // Assuming your client component is in the same directory

const HomeServer = async () => {
  const session = await auth(); // Fetch session on the server

  if (session?.user) {
    await api.post.getLatest.prefetch();
  }

  return <Home session={session} />;
};

export default HomeServer;
