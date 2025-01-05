import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "avinash" && password === "123") {
      localStorage.setItem("userCredentials", JSON.stringify({ username }));
      navigate("/");
      window.location.reload();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper
        sx={{
          padding: 3,
          borderRadius: 3,
          boxShadow: 4,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom color="primary">
          Sign In
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            size="large"
            sx={{
              marginTop: 2,
              padding: "10px 0",
              fontWeight: "bold",
              borderRadius: "8px",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "#1d61d1",
                boxShadow: 6,
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
