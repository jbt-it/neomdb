/**
 * Contains the global styling of the components
 */
import { createTheme } from "@material-ui/core/styles";

// Global theme
export default createTheme({
  palette: {
    primary: {
      // Ci-orange as hex
      main: "#f6891f",
      contrastText: "white",
    },
    secondary: {
      // Ci-grey as hex
      main: "#aeb0b2",
      contrastText: "black",
    },
  },
});
