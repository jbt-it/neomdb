import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles, Theme, createStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    title: {
      fontSize: 17,
    },
    pos: {
      marginBottom: 10,
    },
    notFoundCard: {
      backgroundColor: "white",
      [theme.breakpoints.up("xl")]: {
        transform: "scale(1.1, 1.1)",
        maxWidth: "45%",
        marginTop: "5%",
        marginLeft: "auto",
        marginRight: "auto",
      },
      [theme.breakpoints.only("lg")]: {
        transform: "scale(1.1, 1.1)",
        maxWidth: "50%",
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
      [theme.breakpoints.down("xs")]: {
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
  }));
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
            Diese Seite wurde nicht gefunden.
        </Typography>
          <Typography className={classes.pos} color="textSecondary">
            404
        </Typography>
          <Typography variant="body2" component="p">
            Bei Problemen bitte melden bei: <a href="mailto:it@studentische-beratung.de">it@studentische-beratung.de</a>
            <br />
            {""}
          </Typography>
        </CardContent>
        <CardActions>
          <Button className={classes.backButton} size="medium" variant="contained" disableElevation href="./">Zurück zum Dashboard</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NotFound;
