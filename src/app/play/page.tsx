"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "~/components/ui/carousel";

export default function Page() {

  const [current, setCurrent] = useState<number>(0);
  const games = [
    {
      href: "/play/dance", cover: "/twice_album.png", title: "Dance", description: "Dance and stuff"
    },
    {
      href: "/play/wordhunt", cover: "/twice_album.png", title: "Word Hunt", description: "Word hunt and stuff"
    }
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* First Column */}
      <div className="flex flex-col justify-center items-center w-1/2 relative">
        <img
          src="./choose_your_game_text.png"
          alt="choose_your_game"
          className="h-auto w-[40vw] mb-10 mt-10"
        />

        <div className="bg-white relative w-[40vw] h-[50vh] mt-5">
          <img
            src="./top_left_description_frame.png"
            alt="top_left_description"
            className="absolute -top-[80px] -left-[72px]"
          />

          <div className="w-full h-[37.5vh] overflow-y-auto break-words text-black p-4">
            {games[current]?.description}
          </div>

          <img
            src="./bottom_right_description_frame.png"
            alt="bottom_right_description"
            className="absolute -bottom-[65px] -right-[76px]"
          />
        </div>

        <img
          src="./hacktx_sprite.png"
          alt="hacktx_sprite"
          className="h-auto w-[25vw] mt-20"
        />
      </div>

      {/* Second Column */}
      <div className="flex flex-col items-center justify-center w-1/2">
        <img src="clouds.png" alt="clouds" className="h-auto w-[50vw]" />

        <Carousel className="relative w-[25vw] mb-10 mt-20 h-auto">
          <img src="bottom_left_thumbnail_frame.png" alt="bottom_left_thumbnail_frame" className="absolute -left-[5px] -bottom-14 w-[400px] h-[400px]" />
          <img src="top_right_thumbnail_frame.png" alt="top_right_thumbnail_frame" className="absolute -top-[66px] -right-[3px] w-[400px] h-[400px]" />
          <CarouselContent>
            {games.map((game, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center h-full">
                  <img src={games[current]?.cover} alt="twice_album" className="w-[20vw] h-auto align-middle" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div onClick={() => setCurrent(current - 1)}>
            <CarouselPrevious />
          </div>
          <div onClick={() => setCurrent(current + 1)}>
            <CarouselNext />
          </div>
        </Carousel>

        <Link href={games[current]?.href}>
          <button className="mt-4 hover:scale-105 active:scale-95">
            <img src="./select_button.png" alt="select_button" className="w-[20vw] h-auto" />
          </button>
        </Link>
      </div>
    </div>
  );
}
