import React from "react";
import { Paper, Typography, Grid, Divider, ButtonBase, useTheme } from "@mui/material";
import JBTLogoBlack from "../../assets/jbt-logo-black.png";
import { useNavigate } from "react-router-dom";
import * as membersTypes from "../../types/membersTypes";
import useDepartments from "../../hooks/members/useDepartments";

const DirectorOverview: React.FunctionComponent = () => {
  const { directorPositions } = useDepartments();
  const theme = useTheme();

  const navigate = useNavigate();

  const styles = {
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
  };

  const renderDirectorImageAndName = (position: membersTypes.DirectorDetailsDto) => {
    if (position.memberId === null) {
      return (
        <Grid item xs={12} lg={2} sx={styles.memberDisplay}>
          <Grid item xs={12}>
            <img style={(styles.memberImage, styles.alignCenter)} alt="Profile" src={JBTLogoBlack} />
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
        <Grid item xs={12} lg={2} sx={styles.memberDisplay}>
          <Grid item xs={12}>
            <ButtonBase onClick={() => navigate(`/gesamtuebersicht/${position.memberId}`)} sx={styles.alignCenter}>
              <img style={styles.memberImage} alt="Profile" src={JBTLogoBlack} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12}>
            <ButtonBase onClick={() => navigate(`/gesamtuebersicht/${position.memberId}`)} sx={styles.fullWidth}>
              <Typography align="center" variant="h6" color="primary">
                {`${position.firstname} ${position.lastname}`}
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
          <Grid container sx={styles.memberContainer} key={position.directorId}>
            {renderDirectorImageAndName(position)}
            <Grid item xs={9} lg={10}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {position.gender ? position.designationMale : position.designationFemale}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{position.shortIntroduction}</Typography>
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
    <Paper sx={styles.paperContainer}>
      <Typography variant="h4" sx={styles.paperHeaderText}>
        Der aktuelle Vorstand
      </Typography>
      {renderDirectorPositions()}
    </Paper>
  );
};

export default DirectorOverview;
