/**
 * Contains the global styling of the components
 */
import { createTheme } from "@mui/material/styles";

// Global theme
export default createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "standard",
      },
    },
  },
  palette: {
    primary: {
      // Ci-orange as hex
      main: "#f6891f",
      contrastText: "#ffffff",
    },
    secondary: {
      // Ci-grey as hex
      main: "#aeb0b2",
      contrastText: "#000000",
    },
  },
});
