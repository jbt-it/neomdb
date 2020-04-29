import React from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    backgroundColor: "white",
    minWidth: 250,
    maxWidth: 330,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  notFound: {
    backgroundColor: "white",
    position: "absolute",
    left: "35%",
    top: "20%",
  },
});
const NotFound: React.FunctionComponent = () => {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <div className={classes.notFound}>
      <Card className={classes.root}>
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
          <Button size="small" variant="contained" color="primary" href="./">Zurück zum Dashboard</Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NotFound;
