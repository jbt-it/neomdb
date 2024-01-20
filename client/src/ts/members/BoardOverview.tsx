import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import { Theme, Paper, Typography, Grid, Button, Link, Divider, IconButton } from "@mui/material";
import PageBar from "../global/components/navigation/PageBar";
import JBTLogoBlack from "../../images/jbt-logo-black.png";
import { AuthContext } from "../global/AuthContext";
import { doesPermissionsHaveSomeOf } from "../utils/authUtils";
import { authReducerActionType } from "../global/globalTypes";
import api from "../utils/api";
import * as membersTypes from "../members/membersTypes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";

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
      width: "100%",
      aspectRatio: 1 / 1,
      backgroundColor: "grey",
      borderRadius: "50%",
    },
  })
);

const boardMembers: Array<membersTypes.DirectorDetails> = [
  {
    evPostenID: 1,
    bezeichnung_maennlich: "1. Vorstand",
    bezeichnung_weiblich: "1. Vorstand",
    kuerzel: "1V",
    kurzvorstellung:
      "A member of the board, often referred to as a board member or director, plays a crucial role in the governance and decision-making processes of an organization.",
    inhalt:
      "A member of the board, often referred to as a board member or director, plays a crucial role in the governance and decision-making processes of an organization. Their primary responsibilities include providing strategic direction and oversight to ensure the organization achieves its goals and objectives. Board members are expected to actively participate in board meetings, contribute their expertise, and make informed decisions on matters ranging from financial management to policy development. They must act in the best interests of the organization and its stakeholders, often representing the organization to external parties. Additionally, board members are responsible for ensuring compliance with legal and ethical standards, maintaining transparency, and fostering a culture of accountability within the organization. Their role is pivotal in guiding the organization toward long-term success and sustainability.",
    mitgliedID: 1,
    vorname: "Walter",
    nachname: "Luft",
    geschlecht: 0,
    ressortID: null,
    jbtEmail: "vorstand@studentische-beratung.de",
  },
  {
    evPostenID: 1,
    bezeichnung_maennlich: "1. Vorstand",
    bezeichnung_weiblich: "1. Vorstand",
    kuerzel: "1V",
    kurzvorstellung:
      "A member of the board, often referred to as a board member or director, plays a crucial role in the governance and decision-making processes of an organization.",
    inhalt:
      "A member of the board, often referred to as a board member or director, plays a crucial role in the governance and decision-making processes of an organization. Their primary responsibilities include providing strategic direction and oversight to ensure the organization achieves its goals and objectives. Board members are expected to actively participate in board meetings, contribute their expertise, and make informed decisions on matters ranging from financial management to policy development. They must act in the best interests of the organization and its stakeholders, often representing the organization to external parties. Additionally, board members are responsible for ensuring compliance with legal and ethical standards, maintaining transparency, and fostering a culture of accountability within the organization. Their role is pivotal in guiding the organization toward long-term success and sustainability.",
    mitgliedID: 1,
    vorname: "Walter",
    nachname: "Luft",
    geschlecht: 0,
    ressortID: null,
    jbtEmail: "vorstand@studentische-beratung.de",
  },
  {
    evPostenID: 1,
    bezeichnung_maennlich: "1. Vorstand",
    bezeichnung_weiblich: "1. Vorstand",
    kuerzel: "1V",
    kurzvorstellung:
      "A member of the board, often referred to as a board member or director, plays a crucial role in the governance and decision-making processes of an organization.",
    inhalt:
      "A member of the board, often referred to as a board member or director, plays a crucial role in the governance and decision-making processes of an organization. Their primary responsibilities include providing strategic direction and oversight to ensure the organization achieves its goals and objectives. Board members are expected to actively participate in board meetings, contribute their expertise, and make informed decisions on matters ranging from financial management to policy development. They must act in the best interests of the organization and its stakeholders, often representing the organization to external parties. Additionally, board members are responsible for ensuring compliance with legal and ethical standards, maintaining transparency, and fostering a culture of accountability within the organization. Their role is pivotal in guiding the organization toward long-term success and sustainability.",
    mitgliedID: null,
    vorname: "Walter",
    nachname: "Luft",
    geschlecht: 0,
    ressortID: null,
    jbtEmail: "vorstand@studentische-beratung.de",
  },
];

const BoardOverview: React.FunctionComponent = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [boardMembers, setBoardMembers] = useState<membersTypes.DirectorDetails[]>();

  const classes = useStyles();

  const getBoard: VoidFunction = () => {
    let mounted = true;

    api
      .get(`/users/department-members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    api
      .get(`/users/current-directors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setBoardMembers(res.data);
          }
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });

    // Clean-up function
    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    getBoard();
  }, []);

  const renderBoardMembers = () => {
    if (boardMembers) {
      return boardMembers.map((member) => {
        return (
          <Grid container className={classes.memberContainer} key={member.mitgliedID}>
            <Grid item xs={2} lg={1} className={classes.memberDisplay}>
              <img className={classes.memberImage} alt="Profile" src={JBTLogoBlack} />
              <Grid item xs={12}>
                <Typography
                  align="center"
                  variant="h6"
                  color="primary"
                >{`${member.vorname} ${member.nachname}`}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={10} lg={11}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {member.geschlecht === 0 ? member.bezeichnung_weiblich : member.bezeichnung_maennlich}
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>{member.kurzvorstellung}</Typography>
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
            <Button className={classes.headerButton} variant="contained" endIcon={<AddCircleIcon />}>
              Ressortleitung hinzufügen
            </Button>
          </Typography>

          {renderBoardMembers()}
        </Paper>
      </div>
      <PageBar pageTitle="Der Vorstand" />
    </div>
  );
};

export default BoardOverview;
