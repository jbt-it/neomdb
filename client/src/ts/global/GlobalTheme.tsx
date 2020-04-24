/**
 * Contains the global styling of the components
 */
import { createMuiTheme } from "@material-ui/core/styles";

// Global theme
const globalTheme = createMuiTheme({
  palette: {
    primary: {
      // Ci-orange as hex
      main: "#f6891f",
    },
    secondary: {
      // Ci-grey as hex
      main: "#aeb0b2",
    },
    text: {
      primary: "#000000",
      secondary: "#ffffff",
    }
  },
});

export default globalTheme;