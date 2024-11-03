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

  return (
    <div>
      {/* <CaptureExampleAction /> */}
      {/* <CompareAction /> */}
      {/* <ThreeScene /> */}
      <WordHuntGame />
      <h1>Hack TX</h1>
    </div>
    // <div>
    //   <h1>Hack TX</h1>

    //   {/* Display the employees data */}
    //   {employeesData ? (
    //     <ul>
    //       {employeesData.map((employee: { id: number; name: string }) => (
    //         <li key={employee.id}>
    //           ID: {employee.id}, Name: {employee.name}
    //         </li>
    //       ))}
    //     </ul>
    //   ) : (
    //     <p>No data available</p>
    //   )}
    // </div>
  );
}
