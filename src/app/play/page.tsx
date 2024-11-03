"use client"

import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [isHovered, setHovered] = useState<boolean>(false);

    return (
        <>
            <div>select game</div>

            <Link href={"/play/dance"}>
                <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                    {isHovered ? "> dance" : "dance"}
                </div>
            </Link>
        </>
    )

}