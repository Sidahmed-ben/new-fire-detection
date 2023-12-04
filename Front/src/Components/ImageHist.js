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
import { Grid, Card, CardContent, CardMedia } from "@mui/material";

export default function ImageHist(props) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [histList, setHistList] = React.useState([]);

  const handleClickOpen = async () => {
    await getHist();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getHist = async () => {
    await fetch("http://127.0.0.1:5000/api/get-images", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (resp) => {
        const result = await resp.json();
        console.log(result.images);
        setHistList(result.images);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container component="main" maxWidth="lg" style={{ minWidth: 400 }}>
      <Typography
        component="h1"
        variant="h3"
        style={{ paddingTop: "8px", color: "#023047", fontSize: "30px" }}
      >
        Gallery
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 3, backgroundColor: "#023047", width: "200px" }}
        onClick={handleClickOpen}
      >
        View Gallery
      </Button>

      <Box component="form" autoComplete="off" noValidate>
        <Dialog
          maxWidth="lg"
          PaperProps={{
            style: {
              maxHeight: "100vh", // Ajustez la valeur en fonction de vos besoins
            },
          }}
          fullWidth={true}
          open={open}
          onClose={handleClose}
        >
          <DialogTitle
            style={{ color: "#023047", fontSize: "40px" }}
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
          >
            Gallery
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
            <Grid container spacing={2}>
              {histList.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card
                    style={{ height: "100%", boxShadow: "2px 5px 5px #023047" }}
                  >
                    <CardMedia
                      component="img"
                      // height="140"
                      image={`data:image/jpeg;base64,${card.data}`}
                      alt={card.id}
                    />
                    <CardContent>
                      <Typography variant="h4" component="div">
                        {card.created_date}
                      </Typography>
                      <Typography variant="h5" color="text.secondary">
                        {card.user ? (
                          <>Sended to : {card.user.email}</>
                        ) : (
                          <>Not sended</>
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
}
