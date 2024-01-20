import React, { useState, useEffect, useContext } from "react";
import { makeStyles, createStyles } from "@mui/styles";
import {
  Theme,
  Paper,
  Typography,
  Grid,
  Button,
  Link,
  Divider,
  IconButton,
  Modal,
  TextField,
  Autocomplete,
} from "@mui/material";
import PageBar from "../../components/navigation/PageBar";
import JBTLogoBlack from "../../assets/jbt-logo-black.png";
import { AuthContext } from "../../context/auth-context/AuthContext";
import { doesPermissionsHaveSomeOf } from "../../utils/authUtils";
import { authReducerActionType } from "../../types/globalTypes";
import api from "../../utils/api";
import * as membersTypes from "../../types/membersTypes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers";

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
  })
);

const DirectorOverview: React.FunctionComponent = () => {
  interface memberSelection {
    vorname: string;
    nachname: string;
    mitgliedID: number;
  }

  const { auth, dispatchAuth } = useContext(AuthContext);
  const [directorPositions, setDirectorPositions] = useState<membersTypes.DirectorDetails[]>();
  const [isEditingPosition, setIsEditingPosition] = useState<boolean>(false);
  const [directorPositionToEdit, setDirectorPositionToEdit] = useState<number>();
  const [members, setMembers] = useState<membersTypes.Member[]>();
  const [memberOptions, setMemberOptions] = useState<memberSelection[]>([]);
  const [selectedMember, setSelectedMember] = useState<memberSelection | null>(null);
  const [vonValue, setVonValue] = useState<Dayjs | null>(dayjs());
  const [bisValue, setBisValue] = useState<Dayjs | null>(dayjs());

  const defaultProps = {
    options: members,
    getOptionLabel: (option: memberSelection) => option.vorname + " " + option.nachname,
  };

  const classes = useStyles();

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

  const handleEditOpen = (directorPosition: number) => {
    setDirectorPositionToEdit(directorPosition);
    api
      .get(`/members`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setMembers(res.data);
          const memberOpt = [];
          for (const member of res.data) {
            memberOpt.push({ vorname: member.vorname, nachname: member.nachname, mitgliedID: member.mitgliedID });
          }
          setMemberOptions(memberOpt);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          dispatchAuth({ type: authReducerActionType.deauthenticate });
        }
      });
    setIsEditingPosition(true);
  };

  const assignPosition = () => {
    if (selectedMember && directorPositionToEdit && vonValue && bisValue) {
      const mitgliedID = selectedMember.mitgliedID;
      const evpostenID = directorPositionToEdit;
      const von = vonValue.format("YYYY-MM-DD");
      const bis = bisValue.format("YYYY-MM-DD");
      api
        .post(
          "/members/change-director",
          { evpostenID, mitgliedID, von, bis },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log("Member:", selectedMember.mitgliedID);
            console.log("EV posten:", directorPositionToEdit);
            console.log("Von", von);
            console.log("Bis", bis);
            getDirectorPositions();
            setIsEditingPosition(false);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatchAuth({ type: authReducerActionType.deauthenticate });
          }
        });
    }
  };

  const renderEditDirectorPosition = () => {
    return (
      <Modal
        open={isEditingPosition}
        onClose={() => setIsEditingPosition(false)}
        aria-labelledby="EV Posten zuweisen"
        aria-describedby="Zuweisung eines EV Posten"
      >
        <Paper className={classes.modalPaper}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.paperHeaderText}>
                Neuen Vorstand bestimmen
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                {...defaultProps}
                disablePortal
                options={memberOptions}
                value={selectedMember}
                onChange={(event: any, newValue: memberSelection | null) => {
                  setSelectedMember(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Mitglied" />}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker label="von" value={vonValue} onChange={(newValue) => setVonValue(newValue)} />
            </Grid>
            <Grid item xs={12}>
              <DatePicker label="bis" value={bisValue} onChange={(newValue) => setBisValue(newValue)} />
            </Grid>
            <Grid item xs={12}>
              <Button className={classes.headerButton} variant="contained" onClick={() => assignPosition()}>
                Neue Position besetzen
              </Button>
              <Button className={classes.headerButton} variant="contained" onClick={() => setIsEditingPosition(false)}>
                Abbrechen
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    );
  };

  const renderDirectorPositions = () => {
    if (directorPositions) {
      return directorPositions.map((position) => {
        return (
          <Grid container className={classes.memberContainer} key={position.evpostenID}>
            <Grid item xs={2} lg={1} className={classes.memberDisplay}>
              <img className={classes.memberImage} alt="Profile" src={JBTLogoBlack} />
              <Grid item xs={12}>
                <Typography align="center" variant="h6" color="primary">
                  {position.mitgliedID === null ? "unbesetzt" : `${position.vorname} ${position.nachname}`}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={10} lg={11}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  {position.geschlecht === 0 ? position.bezeichnung_weiblich : position.bezeichnung_maennlich}
                  <IconButton onClick={() => handleEditOpen(position.evpostenID)}>
                    <EditIcon />
                  </IconButton>
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
        {renderEditDirectorPosition()}
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
