import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function Notification(props) {
  const [open, setOpen] = React.useState(false);
  const { notifImage, setNotifImage } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setNotifImage(null);
  };
  const handleSend = () => {
    setNotifImage(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Container component="main" maxWidth="lg" style={{ minWidth: 400 }}>
      <Typography
        component="h1"
        variant="h3"
        style={{ paddingTop: "8px", color: "#023047", fontSize: "30px" }}
      >
        Notification
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#023047", width: "200px" }}
        onClick={handleClickOpen}
      >
        Open dialog
      </Button>

      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        noValidate
      >
        <Dialog fullWidth={true} open={open} onClose={handleClose}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Notification
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            {/* TODO : Display image here */}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancel}>
              Do not send
            </Button>

            <Button variant="contained" autoFocus onClick={handleSend}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
