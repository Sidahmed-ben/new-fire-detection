import * as React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

export default function UrlVideo(props) {
  const { setVideoUrl } = props;
  let url = "";

  async function saveVideoUrl() {
    console.log("url =>>>> ", url);
    if (url) {
      const response = await fetch("http://127.0.0.1:5000/api/set-strem-url", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ streamUrl: url }),
      });
    } else {
      console.log(" No url in UrlVideo");
    }
  }
  function handleChange(event) {
    url = event.target.value;
  }

  return (
    <Grid container style={{ textAlign: "center", width: "100%" }}>
      <Grid item xs={8}>
        <TextField
          InputProps={{
            sx: { fontSize: "20px", height: 60, backgroundColor: "#DDDDFF" },
          }}
          id="filled-basic"
          label="Url Video"
          variant="filled"
          fullWidth
          style={{ height: 60 }}
          onChange={(event) => handleChange(event)}
        />
      </Grid>
      <Grid item xs={4}>
        <Button
          type="submit"
          onClick={() => {
            setVideoUrl(url);
            saveVideoUrl();
          }}
          // fullWidth
          variant="contained"
          sx={{ mt: 1.5, backgroundColor: "#023047", width: "200px" }}
        >
          Start
        </Button>
      </Grid>
    </Grid>
  );
}
