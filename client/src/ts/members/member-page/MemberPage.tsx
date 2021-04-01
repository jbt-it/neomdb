/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {AuthContext} from "../../global/AuthContext";
import PageBar from "../../global/navigation/PageBar";
import CustomSnackbar from "../../global/CustomSnackbar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    memberPageRoot: {
      flexGrow: 1,
      padding: "5px",
      marginTop: "58px",
      marginBottom: "45px",
      [theme.breakpoints.up("md")]: {
        marginTop: "65px",
        marginLeft: "287px",
        marginRight: "7px",
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: "65px",
      },
    },
  })
);

/**
 * Interface for the member object
 */
interface MemberDetails {
  mitgliedID: number;
  nachname: string;
  vorname: string;
  geschlecht: string;
  geburtsdatum: string;
  handy: string;
  jbt_email: string;
  mitgliedstatus: string;
  generation: string | null;
  internesprojekt: string | null;
  mentor: string | null;
  trainee_seit: string | null;
  mitglied_seit: string | null;
  alumnus_seit: string | null;
  senior_seit: string | null;
  aktiv_seit: string | null;
  passiv_seit: string | null;
  ausgetreten_seit: string | null;
  ressort: string;
  arbeitgeber: string | null;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string | null;
  plz2: number | null;
  ort2: string | null;
  tel2: number | null;
  email2: string | null;
  hochschule: string;
  studiengang: string;
  studienbeginn: string;
  studienende: string;
  vertiefungen: string | null;
  ausbildung: string | null;
  kontoinhaber: string;
  iban: string;
  bic: string;
  engagement: string | null;
  canPL: string | null;
  canQM: string | null;
  lastchange: string;
  fuehrerschein: boolean;
  ersthelferausbildung: boolean;
}
/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

const MemberProfile: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (
  props: RouteComponentProps<RouterMatch>
) => {
  const classes = useStyles();
  const [open, setOpen] = useState<number>(0);
  const [authenticated, setAuthenticated,
    userID, setUserID, userName, setUserName] = useContext(AuthContext);

  const [memberDetails, setMembersDetails] = useState<MemberDetails>();
  const [isOwner, setIsOwner] = useState<boolean>(false);

  /**
   * Retrieves the member details
   */
  const getMemberDetails: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get(`/users/${props.match.params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setMembersDetails(res.data[0]);
          }
        }
      });

    return () => {
      mounted = false;
    };
  };

  /**
   * Updates the member details
   */
  const updateMemberDetails = (data: MemberDetails) => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api
      .patch(`/users/${props.match.params.id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.status === 200) {
          if (mounted) {
            setOpen(open+1);
          }
        }
      });

    return () => {
      mounted = false;
    };
  };

  useEffect(() => {
    // Checks if the user is the owner of the member page
    setIsOwner(userID === parseInt(props.match.params.id, 10));
    getMemberDetails();
  }, []);

  return (
    <div>
      <div className={classes.memberPageRoot}>
        {memberDetails ? (
          <DisplayMemberDetails
            memberDetails={memberDetails}
            isOwner={isOwner}
            getMemberDetails={getMemberDetails}
            updateMemberDetails={updateMemberDetails}
          />
        ) : null}
      </div>
      <PageBar pageTitle="Profilseite" />
      { open ? <CustomSnackbar snackbarMessage="Aktualisierung des Profils war erfolgreich!" snackProps={{variant:"success"}}/> : null}
    </div>
  );
};

export default MemberProfile;
