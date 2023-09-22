/**
 * Component that handles the not found error
 */
import React from "react";
import { Button, Theme, CardActions, CardContent, Typography } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import Card from "@mui/material/Card";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

const NotFound: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <div className={"content-page ${classes.root}"}>
      <Card className={classes.notFoundCard} variant="outlined">
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
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
          <Button className={classes.backButton} size="medium" variant="contained" disableElevation href="#/">
            Zurück zum Dashboard
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NotFound;
