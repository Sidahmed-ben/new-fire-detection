import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
// import "./VideoPlayer.css";

import ReactPlayer from "react-player";

export default function VideoPlayer() {
  return (
    <ReactPlayer
      className="react-player"
      url="https://www.youtube.com/watch?v=LXb3EKWsInQ"
      width="100%"
      height="500px"
      controls
    />
  );
}
