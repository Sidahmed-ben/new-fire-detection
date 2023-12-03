import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Register() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const name = data.get("name");
    if (email && name) {
      const response = await fetch("http://127.0.0.1:5000/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (response.ok) {
        // Handle successful response
        console.log("User added successfully");
      } else {
        // Handle error response
        console.error("Error adding user");
      }
    } else {
      console.log("Email or Name empty !");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      // sx={{ backgroundColor: "#FB8500" }}
    >
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          size="small"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="name"
          label="Name"
          type="name"
          id="name"
          size="small"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, backgroundColor: "#023047" }}
        >
          Add user
        </Button>
      </Box>
    </Container>
  );
}
