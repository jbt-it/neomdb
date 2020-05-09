/**
 * The MemberPage-Component displays details of a member and can be edited by the owner of this page
 */

import React, {
  useState,
  useEffect
} from "react";
import { RouteComponentProps } from "react-router-dom";
import api from "../../utils/api";
import DisplayMemberDetails from "./DisplayMemberDetails";
import classes from "*.module.css";
import { IconButton, Button, Paper, Typography } from "@material-ui/core";
import {
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme:Theme) =>
  createStyles({
    memberPageRoot:{
      flexGrow: 1,
      padding: "5px",
        marginTop: "58px",
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
  generation: string;
  internesprojekt: string;
  mentor: string;
  trainee_seit: string;
  mitglied_seit: string;
  alumnus_seit: string;
  senior_seit: string;
  aktiv_seit: string;
  passiv_seit: string;
  ausgetreten_seit: string;
  ressort: string;
  arbeitgeber: string;
  strasse1: string;
  plz1: number;
  ort1: string;
  tel1: number;
  email1: string;
  strasse2: string;
  plz2: number;
  ort2: string;
  tel2: number;
  email2: string;
  hochschule: string;
  studiengang: string;
  studienbeginn: string;
  studienende: string;
  vertiefungen: string;
  ausbildung: string;
  kontoinhaber: string;
  iban: string;
  bic: string;
  engagement: string;
  canPL: string;
  canQM: string;
  lastchange: string;
  fuehrerschein: string;
  ersthelferausbildung: string;
}

/**
 * Interface for the match parameter of the router
 */
interface RouterMatch {
  id: string;
}

const MemberPage: React.FunctionComponent<RouteComponentProps<RouterMatch>> = (props: RouteComponentProps<RouterMatch>) => {
  const classes = useStyles();

  const [memberDetails, setMembersDetails] = useState<MemberDetails>();

  /**
   * Retrieves the member details
   */
  const getMemberDetails: VoidFunction = () => {
    // Variable for checking, if the component is mounted
    let mounted = true;
    api.get(`/users/${props.match.params.id}`, {
      headers: {Authorization : `Bearer ${localStorage.getItem("token")}`}
    })
    .then((res) => {
      if (res.status === 200){
        if (mounted){
          setMembersDetails(res.data[0]);
        }
      }
    });

    return () => {mounted = false;};
  };

  useEffect(() => getMemberDetails(), []);

  return (
    <div className={classes.memberPageRoot}>
      <DisplayMemberDetails memberDetails={memberDetails}/>
    </div>
  );
};

export default MemberPage;