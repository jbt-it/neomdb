/**
 * Component that handles the not found error
 */
import React from "react";
import { Box, Button, CardActions, CardContent, Typography, useTheme } from "@mui/material";
import Card from "@mui/material/Card";

const NotFound: React.FunctionComponent = () => {
  const theme = useTheme();

  const styles = {
    root: {
      display: "flex",
    },
    title: {
      fontSize: 17,
    },
    notFoundCard: {
      backgroundColor: "white",
      [theme.breakpoints.up("xl")]: {
        transform: "scale(1.2, 1.2)",
        maxWidth: "580px",
        marginTop: "5%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      [theme.breakpoints.only("lg")]: {
        transform: "scale(1.1, 1.1)",
        maxWidth: "570px",
        marginTop: "5%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      [theme.breakpoints.only("md")]: {
        transform: "scale(1.1, 1.1)",
        maxWidth: "470px",
        marginTop: "10%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      [theme.breakpoints.only("sm")]: {
        maxWidth: "430px",
        marginTop: "10%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      [theme.breakpoints.down("sm")]: {
        maxWidth: "430px",
        marginTop: "10%",
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    backButton: {
      color: "white",
      backgroundColor: "#f6891f",
    },
  };
  return (
    <Box sx={styles.root}>
      <Card sx={styles.notFoundCard} variant="outlined">
        <CardContent>
          <Typography sx={styles.title} color="textSecondary" gutterBottom>
            Fehler:
          </Typography>
          <Typography variant="h5" component="h2">
            404: Diese Seite wurde nicht gefunden.
          </Typography>
          <Typography variant="body2" component="p">
            Bei Problemen bitte melden bei:
            <a href="mailto:it@studentische-beratung.de">it@studentische-beratung.de</a>
            <br />
          </Typography>
        </CardContent>
        <CardActions>
          <Button sx={styles.backButton} size="medium" variant="contained" disableElevation href="/">
            Zurück zum Dashboard
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default NotFound;
