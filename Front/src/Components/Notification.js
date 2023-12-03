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
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Notification(props) {
  const [open, setOpen] = React.useState(false);
  const { notifImage, setNotifImage } = props;
  const theme = useTheme();
  const [personEmail, setPersonEmail] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);

  const handleClickOpen = async () => {
    setOpen(true);
    await getUsers();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCancel = () => {
    setNotifImage(null);
  };
  const handleSendEmail = async () => {
    setNotifImage(null);
    const email = personEmail[0];
    const response = await fetch("http://127.0.0.1:5000/api/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // Handle successful response
      console.log("Email sended succesffully");
    } else {
      // Handle error response
      console.error("Error sending email");
    }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonEmail([value[value.length - 1]]);
  };
  const getUsers = async () => {
    await fetch("http://127.0.0.1:5000/api/get-users", {
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
        Notification
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#023047", width: "200px" }}
        onClick={handleClickOpen}
      >
        Open dialog
      </Button>

      <Box component="form" autoComplete="off" noValidate>
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
              color: (theme) => theme.palette.grey[100],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            dividers
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-name-label">Email</InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={personEmail}
                  onChange={handleChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                >
                  {usersList.map((user) => (
                    <MenuItem
                      key={user.id}
                      value={user.email}
                      style={getStyles(user.email, personEmail, theme)}
                    >
                      {user.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {notifImage ? (
              <>
                <Typography
                  component="h1"
                  variant="h3"
                  style={{
                    paddingTop: "8px",
                    color: "#023047",
                    fontSize: "30px",
                    marginBottom: "20px",
                  }}
                >
                  This image will be sended to the user :
                </Typography>
                <img
                  style={{ maxWidth: "100%", height: "auto" }}
                  src={notifImage}
                  alt="Your Alt Text"
                />
              </>
            ) : (
              <Typography
                component="h1"
                variant="h3"
                style={{
                  paddingTop: "8px",
                  color: "#023047",
                  fontSize: "30px",
                  marginBottom: "20px",
                }}
              >
                No notification
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCancel}>
              Do not send
            </Button>

            <Button variant="contained" autoFocus onClick={handleSendEmail}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
