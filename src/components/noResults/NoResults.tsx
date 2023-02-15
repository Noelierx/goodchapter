import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import noResultsImage from "./images/noResults.png";

const NoResults = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      margin: "0 auto",
    }}
  >
    <img src={noResultsImage} alt="" width="230" height="230" />
    <Typography variant="h2" sx={{ my: 2 }}>
      No results found
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      You should try to search for something else.
    </Typography>
  </Box>
);

export default NoResults;
