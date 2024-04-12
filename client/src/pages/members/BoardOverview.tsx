import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme, Paper, Typography, Grid, Divider, ButtonBase } from "@mui/material";
import PageBar from "../../components/navigation/PageBar";
import JBTLogoBlack from "../../assets/jbt-logo-black.png";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { authReducerActionType } from "../../types/globalTypes";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import * as membersTypes from "../../types/membersTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperContainer: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    paperHeaderText: {
      marginLeft: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    headerButton: {
      marginLeft: theme.spacing(1),
    },
    memberContainer: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    memberDisplay: {
      paddingRight: theme.spacing(1),
    },
    memberImage: {
      maxHeight: "135px",
      aspectRatio: 1 / 1,
      backgroundColor: "grey",
      borderRadius: "50%",
    },
    modalPaper: {
      overflowY: "auto",
      position: "absolute",
      margin: "auto",
      top: "20%",
      left: "10%",
      right: "10%",
      bottom: "20%",
      width: "60%",
      display: "flex",
      justifyContent: "center",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    fullWidth: {
      width: "100%",
    },
    alignCenter: {
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    },
  })
);

const DirectorOverview: React.FunctionComponent = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [directorPositions, setDirectorPositions] = useState<membersTypes.DirectorDetails[]>();

  const classes = useStyles();
  const navigate = useNavigate();

  const getDirectorPositions = () => {
    let mounted = true;
    api
      .get(`/members/director-positions?includeDirectorMembers=true`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setDirectorPositions(res.data);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    getDirectorPositions();
  }, []);

  const renderDirectorImageAndName = (position: membersTypes.DirectorDetails) => {
    if (position.mitgliedID === null) {
      return (
        <Grid item xs={12} lg={2} className={classes.memberDisplay}>
          <Grid item xs={12}>
            <img className={`${classes.memberImage} ${classes.alignCenter}`} alt="Profile" src={JBTLogoBlack} />
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="h6" color="primary">
              unbesetzt
            </Typography>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} lg={2} className={classes.memberDisplay}>
          <Grid item xs={12}>
            <ButtonBase
              onClick={() => navigate(`/gesamtuebersicht/${position.mitgliedID}`)}
              className={classes.alignCenter}
            >
              <img className={classes.memberImage} alt="Profile" src={JBTLogoBlack} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12}>
            <ButtonBase
              onClick={() => navigate(`/gesamtuebersicht/${position.mitgliedID}`)}
              className={classes.fullWidth}
            >
              <Typography align="center" variant="h6" color="primary">
                {`${position.vorname} ${position.nachname}`}
              </Typography>
            </ButtonBase>
          </Grid>
        </Grid>
      );
    }
  };

  const renderDirectorPositions = () => {
    if (directorPositions) {
      return directorPositions.map((position) => {
        return (
          <Grid container className={classes.memberContainer} key={position.evpostenID}>
            {renderDirectorImageAndName(position)}
            <Grid item xs={9} lg={10}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {position.geschlecht === 0 ? position.bezeichnung_weiblich : position.bezeichnung_maennlich}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{position.kurzvorstellung}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        );
      });
    }
  };

  return (
    <div>
      <div className="content-page">
        <Paper className={classes.paperContainer}>
          <Typography variant="h4" className={classes.paperHeaderText}>
            Der aktuelle Vorstand
          </Typography>
          {renderDirectorPositions()}
        </Paper>
      </div>
      <PageBar pageTitle="Der Vorstand" />
    </div>
  );
};

export default DirectorOverview;
