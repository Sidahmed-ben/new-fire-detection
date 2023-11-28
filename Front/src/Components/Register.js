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
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
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
          // autoComplete="email"
          // autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="Name"
          label="Name"
          type="name"
          id="name"
          size="small"
          // autoComplete="current-password"
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
