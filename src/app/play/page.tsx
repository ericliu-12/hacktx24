"use client";

import Image from "next/image";
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
        <Image
          src="/choose_your_game_text.png"
          alt="Choose your game"
          width={0} height={0} sizes="40vw"
          className="h-auto w-[40vw] mb-10 mt-10"
        />

        <div className="bg-white relative w-[40vw] h-[50vh] mt-5">
          <Image
            src="/top_left_description_frame.png"
            alt="Top left description"
            width={500} height={500}
            style={{ width: 'auto', height: 'auto' }}
            className="absolute -top-[80px] -left-[72px]"
          />

          <div className="w-full h-[37.5vh] overflow-y-auto break-words text-black p-4">
            {games[current]?.description}
          </div>

          <Image
            src="/bottom_right_description_frame.png"
            alt="Bottom right description"
            width={500} height={500}
            style={{ width: 'auto', height: 'auto' }}
            className="absolute -bottom-[65px] -right-[76px]"
          />
        </div>

        <Image
          src="/hacktx_sprite.png"
          alt="HackTX Sprite"
          width={0} height={500} sizes="25vw"
          style={{ width: 'auto' }}
          className="mt-20" />
      </div>

      {/* Second Column */}
      <div className="flex flex-col items-center justify-center w-1/2">
        <Image
          src="/clouds.png"
          alt="clouds"
          width={500} height={500}
          style={{ width: '40vw', height: 'auto' }} />

        <Carousel className="relative w-[25vw] mb-10 mt-20 h-auto">
          <Image
            src="/bottom_left_thumbnail_frame.png"
            alt="Bottom left thumbnail frame"
            width={400} height={400}
            className="absolute -left-[20px] -bottom-14" />
          <Image
            src="/top_right_thumbnail_frame.png"
            alt="top right thumbnail frame"
            width={400} height={400}
            className="absolute -top-[66px] -right-[20px] " />

          <CarouselContent>
            {games.map((game, index) => (
              <CarouselItem key={index}>
                <div className="flex items-center justify-center h-full">
                  <Image
                    src={game.cover}
                    alt="Page cover"
                    width={500} height={500}
                    style={{ width: '20vw', height: 'auto' }}
                    className="align-middle" />
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
