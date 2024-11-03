import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import PoseWithWebcam from "./_components/PoseWithWebcam";
import CaptureExampleAction from "./_components/CaptureExampleAction";
import CompareAction from "./_components/CompareAction";
import ThreeScene from "./_components/ThreeScreen";
import WordHuntGame from "./_components/WordHuntGame";
import TestComponent from "./_components/TestComponent";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  // const { data: employeesData } = api.employee.getEmployees.useQuery();

  // Log the response to the console
  // console.log("Employees Data:", employeesData);
  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return <>
    <ThreeScene />

    <div className="fixed top-1/2 -translate-y-1/2 right-6">
      <p>Welcome, {session?.user ? session.user.name : "Guest!"}</p>

      {!session?.user ?
        <Link href="/api/auth/signin">
          <button>Sign In</button>
        </Link>
        : <button>Play</button>}
    </div>

  </>;
}
