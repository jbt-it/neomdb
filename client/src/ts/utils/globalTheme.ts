/**
 * Contains the global styling of the components
 */
import { createMuiTheme } from "@material-ui/core/styles";

// Global theme
export default createMuiTheme({
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
    }
  },
});
