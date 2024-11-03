"use client";

import EmployeesList from "../_components/EmployeesList";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

export default function Page() {
  return (
    <>
      <EmployeesList />
      <div>select game</div>
      <div className="flex h-screen w-screen">
        {/* First Column */}
        <div className="relative flex w-1/2 flex-col items-center justify-center">
          <img
            src="./choose_your_game_text.png"
            alt="choose_your_game"
            className="mb-10 mt-10 h-auto w-[40vw]" // Add margin for spacing
          />

          <div className="relative mt-5 h-[50vh] w-[40vw] bg-white">
            <img
              src="./top_left_description_frame.png"
              alt="top_left_description"
              className="absolute -left-[72px] -top-[80px]"
            />

            <div className="h-[37.5vh] w-1/3 overflow-y-auto break-words p-4 text-black">
              {/* Description content goes here */}
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
            className="mt-20 h-auto w-[25vw]" // Add margin for spacing
          />
        </div>

        {/* Second Column */}
        <div className="flex w-1/2 flex-col items-center justify-center">
          <img src="clouds.png" alt="clouds" className="h-auto w-[50vw]" />

          <Carousel className="relative mb-10 mt-20 h-auto w-[25vw]">
            <img
              src="bottom_left_thumbnail_frame.png"
              alt="bottom_left_thumbnail_frame"
              className="absolute -bottom-14 -left-[5px] h-[400px] w-[400px]"
            />
            <img
              src="top_right_thumbnail_frame.png"
              alt="top_right_thumbnail_frame"
              className="absolute -right-[3px] -top-[66px] h-[400px] w-[400px]"
            />
            <CarouselContent>
              <CarouselItem>
                <div className="flex h-full items-center justify-center">
                  <img
                    src="./twice_album.png"
                    alt="twice_album"
                    className="h-auto w-[20vw] align-middle"
                  />
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="flex h-32 items-center justify-center"></div>
              </CarouselItem>

              <CarouselItem>
                <div className="flex h-32 items-center justify-center"></div>
              </CarouselItem>
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <button className="mt-4">
            <img
              src="./select_button.png"
              alt="select_button"
              className="h-auto w-[20vw]"
            />
          </button>
        </div>
      </div>
    </>
  );
}
