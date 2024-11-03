// app/Home.tsx

"use client";

import { useEffect, useState } from "react";
import ThreeScene from "../_components/ThreeScreen";
import Link from "next/link";
import { Session } from "next-auth"; // Adjust import based on your session type

interface HomeProps {
  session: Session | null;
}

const Home: React.FC<HomeProps> = ({ session }) => {
  const [route, setRoute] = useState("");

  return (
    <>
      <ThreeScene route={route} />

      <div className="fixed right-6 top-1/2 -translate-y-1/2">
        <p>Welcome, {session?.user ? session.user.name : "Guest!"}</p>

        {!session?.user ? (
          <Link href="/api/auth/signin">
            <button>Sign In</button>
          </Link>
        ) : (
          <>
            <button onClick={() => setRoute("/play")}>Play</button>
            <br />
            <button onClick={() => setRoute("/profile")}>Set up profile</button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
