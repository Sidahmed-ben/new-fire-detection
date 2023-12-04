import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import VideoPlayer from "./VideoPlayer";
import Register from "./Register";
import UrlVideo from "./UrlVideo";
import videoFire from "../video/fire.mp4";
import Notification from "./Notification";
import User from "./User";
import { Button } from "@mui/material";
import FireCheckSwitch from "./FireCheckSwitch";
// Render a YouTube video player
import { render } from "@react-email/render";
import ImageHist from "./ImageHist";
// import nodemailer from "nodemailer";

const ItemVideo = styled(Paper)(({ theme }) => ({
  backgroundColor: "black",
  ...theme.typography.body2,
  // padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: "4px",
  margin: "10px",
  marginLeft: "50px",
  minHeight: "200px",
}));

const ItemRegister = styled(Paper)(({ theme }) => ({
  backgroundColor: "#FB8500AA",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  marginTop: "50px",
  marginLeft: "60px",
  marginRight: "60px",
  color: theme.palette.text.secondary,
  borderRadius: "20px",
}));

const FireCheckSwitchItem = styled(Paper)(({ theme }) => ({
  backgroundColor: "#023047DD",
  padding: theme.spacing(1),
  textAlign: "center",
  marginTop: "50px",
  marginLeft: "60px",
  marginRight: "60px",
  borderRadius: "20px",
  display: "flex",
  alignItems: "center",
}));

const Item = styled(Paper)(({ theme }) => ({}));
const ItemUrl = styled(Paper)(({ theme }) => ({
  borderRadius: "4px",
  // margin: "auto",
  marginLeft: "50px",
  marginTop: "30px",
  marginRight: 10,
  backgroundColor: "#FB8500",
  // width: "100%",
  textAlign: "center",
}));

const ItemLogo = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  color: "#023047",
  fontSize: 30,
  marginTop: 50,
  marginLeft: 50,
  marginBottom: 10,
  padding: 5,
  // backgroundImage:
  //   'url("https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
  // backgroundSize: "cover",
  // backgroundPosition: "center",
  backgroundColor: "#FB8500",
  // width: "100%",
  // height: "100%",
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  backgroundColor: "#fff",
  height: "100vh",
  position: "relative",
  zIndex: 1,
  padding: "20px",
}));

export default function GlobalView() {
  const [videoUrl, setVideoUrl] = React.useState("");
  const [notifImage, setNotifImage] = React.useState(null);
  const [fireCheckTO, setfireCheckTO] = React.useState(null);
  const [switchFireButton, setSwitchFireButton] = React.useState(false);

  async function checkFire() {
    try {
      // Call the function again after 3 seconds
      setfireCheckTO(setTimeout(checkFire, 7000));
      console.log("This function is called every 5 seconds.");
      const response = await fetch("http://127.0.0.1:5000/api/check-fire");
      const result = await response.json();
      console.log(result);
      if (result.error) {
        console.log("ERROR : " + result.message);
        return;
      }
      const { fire, frameFire } = result;
      if (fire) {
        // to display video background
        //  Set the image of notification to returned image
        setNotifImage(frameFire);
        setSwitchFireButton(!switchFireButton);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function testButton() {
    console.log("clicked");
    // clearTimeout(fireCheckTO);
  }

  return (
    <StyledGrid container>
      <video
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
        playsInline
        loop
        muted
        autoPlay
        alt="All the devices"
        className=""
        src={videoFire}
      />

      <Grid item xs={12} xl={3} style={{ height: "5vhx" }}>
        <ItemLogo> FIRE DETECTION </ItemLogo>
      </Grid>
      <Grid item xs={12} xl={6} style={{ height: "5vh" }}></Grid>
      <Grid item xs={12} xl={3} style={{ height: "5vh" }}>
        <FireCheckSwitchItem>
          <Typography
            component="h1"
            variant="h3"
            style={{ padding: "5px 50px", color: "#DDDDDD", fontSize: "25px" }}
          >
            Check state :
          </Typography>
          <FireCheckSwitch
            fireCheckTO={fireCheckTO}
            checkFire={checkFire}
            videoUrl={videoUrl}
            switchFireButton={switchFireButton}
          ></FireCheckSwitch>
        </FireCheckSwitchItem>
      </Grid>
      <Grid item xs={12} xl={8}>
        <ItemVideo>
          <VideoPlayer videoUrl={videoUrl}></VideoPlayer>
        </ItemVideo>
        <ItemUrl>
          <UrlVideo setVideoUrl={setVideoUrl}></UrlVideo>
        </ItemUrl>
      </Grid>
      <Grid item xs={12} xl={4}>
        <ItemRegister>
          <Notification
            notifImage={notifImage}
            setNotifImage={setNotifImage}
          ></Notification>
        </ItemRegister>
        <ItemRegister>
          <User notifImage={notifImage} setNotifImage={setNotifImage}></User>
        </ItemRegister>

        <ItemRegister>
          <ImageHist
            notifImage={notifImage}
            setNotifImage={setNotifImage}
          ></ImageHist>
        </ItemRegister>
        {/* <ItemRegister>
          <button
            onClick={() => {
              testButton();
            }}
          >
            {" "}
            Click{" "}
          </button>
        </ItemRegister> */}
      </Grid>
    </StyledGrid>
  );
}
