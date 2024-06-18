import React, { useState } from "react";
import { NextPage } from "next";
import CarouselSlider from "@/components/CarouselSlider/CarouselSlider";
import { getGame } from "@/libs/apis";
import GameDetailsClient from "@/components/GameDetails/GameDetailsClient";
import GameDetailsServer from "@/components/GameDetails/GameDetailsServer";

const GameItem = async (props: { params: { slug: string } }) => {
  // console.log(props);
  const {
    params: { slug },
  } = props;

  return (
    <>
      <GameDetailsClient slug={slug}>
        <GameDetailsServer slug={slug} />
      </GameDetailsClient>
    </>
  );
};

export default GameItem;