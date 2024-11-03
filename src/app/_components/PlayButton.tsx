import Link from "next/link";
import Image from "next/image";
import type { Session } from "next-auth";

export default function PlayButton({ session } : {session: Session | null}) {

    return (
        <Link className="inline-block" href={session?.user ? './play' : '/api/auth/signin'}>
            <Image src={"/play.png"} alt="Play" width={100} height={100}></Image>
        </Link>
    )
}