import { Box } from "@mui/material";
import { useState } from "react";

const Logo = ({ variant = "default" }) => {
  const [error, setError] = useState(false);
  const logoSrc =
    variant === "home" ? "/freefuel-logo2.png" : "/freefuel-logo.png";

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          height: 100,
          bgcolor: "grey.200",
        }}>
        <span>FreeFuel</span>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <img
        src={logoSrc}
        alt="FreeFuel Logo"
        style={{
          height: 100,
          width: "auto",
          maxWidth: 100,
          objectFit: "contain",
        }}
        onError={() => setError(true)}
      />
    </Box>
  );
};

export default Logo;
