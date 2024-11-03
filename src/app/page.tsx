import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import PoseWithWebcam from "./_components/PoseWithWebcam";
import CaptureExampleAction from "./_components/CaptureExampleAction";
import CompareAction from "./_components/CompareAction";
import ThreeScene from "./_components/ThreeScreen";
import WordHuntGame from "./_components/WordHuntGame";
import TestComponent from "./_components/TestComponent";

export default async function Home() {
  const session = await auth();
  // const { data: employeesData } = api.employee.getEmployees.useQuery();

  // Log the response to the console
  // console.log("Employees Data:", employeesData);
  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return <ThreeScene />;
}
