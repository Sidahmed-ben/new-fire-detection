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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Register from "./Register";

export default function User(props) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [usersList, setUsersList] = React.useState([]);

  const openList = Boolean(anchorEl);
  // const { notifImage, setNotifImage } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const handleClickItem = async (event) => {
    setAnchorEl(event.currentTarget);
    await getUsers();
  };
  const handleCloseList = () => {
    setAnchorEl(null);
  };

  const getUsers = async () => {
    return fetch("http://127.0.0.1:5000/api/get-users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (resp) => {
        const result = await resp.json();
        console.log(result.users);
        setUsersList(result.users);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };
  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container component="main" maxWidth="lg" style={{ minWidth: 400 }}>
      <Typography
        component="h1"
        variant="h3"
        style={{ paddingTop: "8px", color: "#023047", fontSize: "30px" }}
      >
        User
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#023047", width: "200px" }}
        onClick={handleClickOpen}
      >
        Add user
      </Button>

      <Box component="form" autoComplete="off" noValidate>
        <Dialog fullWidth={true} open={open} onClose={handleClose}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            User handling
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
            <div>
              <Button
                variant="outlined"
                sx={{
                  mt: 3,
                  mb: 2,
                  // backgroundColor: "#023047",
                  width: "90%",
                  textAlign: "left",
                  flex: 1,
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
                id="basic-button"
                aria-controls={openList ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openList ? "true" : undefined}
                onClick={handleClickItem}
              >
                Users List
                <ArrowDropDownCircleIcon></ArrowDropDownCircleIcon>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openList}
                onClose={handleCloseList}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                sx={{ width: "100%", maxHeight: "300px" }}
              >
                {usersList.map((user, ind) => (
                  <div>
                    <MenuItem key={ind.toString()}>
                      <Typography variant="body1" fontWeight="bold">
                        Name :&nbsp;
                      </Typography>
                      {user.name}&nbsp;&nbsp;&nbsp;
                      <Typography variant="body1" fontWeight="bold">
                        Email :&nbsp;
                      </Typography>
                      {user.email}
                      <Button
                        style={{ marginLeft: 20 }}
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        <DeleteIcon />
                      </Button>
                    </MenuItem>
                    <Divider sx={{ bgcolor: "black" }} />
                  </div>
                ))}
              </Menu>
            </div>
            <Divider textAlign="center">Add a new user</Divider>
            <Register></Register>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
}
